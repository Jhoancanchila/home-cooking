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