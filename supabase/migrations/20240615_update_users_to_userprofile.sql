-- Renombrar la tabla 'users' a 'user_profile'
ALTER TABLE IF EXISTS public.users RENAME TO user_profile;

-- Agregar la columna auth_id a la tabla user_profile
ALTER TABLE public.user_profile 
ADD COLUMN auth_id UUID REFERENCES auth.users(id);

-- Crear un índice para auth_id para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_user_profile_auth_id ON public.user_profile (auth_id);

-- Actualizar las políticas de RLS para la tabla renombrada (si existen)
DO $$
BEGIN
    -- Eliminar políticas existentes (si las hay)
    DROP POLICY IF EXISTS "Users are viewable by everyone." ON public.user_profile;
    DROP POLICY IF EXISTS "Users can insert their own profile." ON public.user_profile;
    DROP POLICY IF EXISTS "Users can update own profile." ON public.user_profile;
    
    -- Crear nuevas políticas con el nombre actualizado
    CREATE POLICY "User profiles are viewable by everyone."
        ON public.user_profile FOR SELECT
        USING (true);
        
    CREATE POLICY "User profiles can insert their own data."
        ON public.user_profile FOR INSERT
        WITH CHECK (auth.uid() IS NOT NULL);
        
    CREATE POLICY "User profiles can update own data."
        ON public.user_profile FOR UPDATE
        USING (auth.uid() = auth_id)
        WITH CHECK (auth.uid() = auth_id);
END
$$;

-- Comentarios en la tabla y columnas
COMMENT ON TABLE public.user_profile IS 'Perfiles de usuario vinculados a las cuentas de autenticación';
COMMENT ON COLUMN public.user_profile.auth_id IS 'ID de referencia a la tabla auth.users para vincular el perfil con la cuenta de autenticación'; 