# Instrucciones para crear tablas en Supabase

Para que la aplicación funcione correctamente, necesitas crear las siguientes tablas en tu proyecto de Supabase. Hay dos maneras de hacerlo:

## Opción 1: Usando el Editor SQL

1. Inicia sesión en tu dashboard de Supabase: https://app.supabase.com
2. Selecciona tu proyecto
3. En el menú lateral, ve a "SQL Editor"
4. Crea una nueva consulta (New query)
5. Copia y pega el siguiente código SQL:

```sql
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

-- Crear tabla de servicios
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service text,
  occasion text,
  location text,
  persons text,
  meal_time text,
  cuisine text,
  event_date text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Agregar políticas RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Permitir a los usuarios autenticados crear servicios (solo los suyos)
CREATE POLICY "Usuarios pueden crear sus propios servicios" ON public.services
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Permitir a los usuarios autenticados leer sus propios servicios
CREATE POLICY "Usuarios pueden leer sus propios servicios" ON public.services
  FOR SELECT TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid() FROM public.users WHERE id = user_id
  ));

-- Permitir a los usuarios autenticados actualizar sus propios servicios
CREATE POLICY "Usuarios pueden actualizar sus propios servicios" ON public.services
  FOR UPDATE TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid() FROM public.users WHERE id = user_id
  ));

-- Permitir a los usuarios autenticados eliminar sus propios servicios
CREATE POLICY "Usuarios pueden eliminar sus propios servicios" ON public.services
  FOR DELETE TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid() FROM public.users WHERE id = user_id
  ));
```

6. Haz clic en "Run" o "Ejecutar"

## Opción 2: Usando el Table Editor (más visual)

### Tabla de Usuarios (users)

1. Ve a "Table editor" en el menú lateral
2. Haz clic en "Create a new table"
3. Nombre de la tabla: `users`
4. Añade las siguientes columnas:
   - `id`: tipo UUID, PRIMARY KEY, DEFAULT: `uuid_generate_v4()`
   - `name`: tipo text, NOT NULL
   - `email`: tipo text, NOT NULL
   - `phone`: tipo text, NOT NULL
   - `source`: tipo text, NULL permitido
   - `created_at`: tipo timestamp with time zone, DEFAULT: `now()`
5. Haz clic en "Save"

### Tabla de Servicios (services)

1. Ve a "Table editor" en el menú lateral
2. Haz clic en "Create a new table"
3. Nombre de la tabla: `services`
4. Añade las siguientes columnas:
   - `id`: tipo UUID, PRIMARY KEY, DEFAULT: `uuid_generate_v4()`
   - `user_id`: tipo UUID, NOT NULL, FOREIGN KEY a `users.id`
   - `service`: tipo text, NULL permitido
   - `occasion`: tipo text, NULL permitido
   - `location`: tipo text, NULL permitido
   - `persons`: tipo text, NULL permitido
   - `meal_time`: tipo text, NULL permitido
   - `cuisine`: tipo text, NULL permitido
   - `event_date`: tipo text, NULL permitido
   - `description`: tipo text, NULL permitido
   - `created_at`: tipo timestamp with time zone, DEFAULT: `now()`
5. Haz clic en "Save"

### Configuración de RLS (Row Level Security)

Después de crear ambas tablas, debes habilitar RLS y configurar las políticas de seguridad:

1. Ve a "Authentication" > "Policies" en el menú lateral
2. Selecciona la tabla `users` y habilita RLS
3. Añade políticas para INSERT, SELECT y UPDATE similar a las del script SQL
4. Selecciona la tabla `services` y habilita RLS
5. Añade políticas para INSERT, SELECT, UPDATE y DELETE similar a las del script SQL

## Verificación

Para verificar que las tablas se han creado correctamente:

1. Ve a "Table editor"
2. Deberías ver las tablas `users` y `services` listadas
3. Intenta hacer una inserción de prueba en la tabla `users` para confirmar que todo funciona 