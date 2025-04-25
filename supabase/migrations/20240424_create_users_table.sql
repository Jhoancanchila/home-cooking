-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  source text,
  created_at timestamp with time zone DEFAULT now()
);

-- Agregar índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Permitir a los usuarios autenticados insertar sus propios datos
CREATE POLICY "Usuarios pueden insertar sus propios datos" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Permitir a los usuarios autenticados leer sus propios datos
CREATE POLICY "Usuarios pueden leer sus propios datos" ON public.users
  FOR SELECT TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE email = users.email
  ));

-- Permitir a los usuarios autenticados actualizar sus propios datos
CREATE POLICY "Usuarios pueden actualizar sus propios datos" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE email = users.email
  )); 