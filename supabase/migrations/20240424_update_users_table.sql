-- Primero, guardar los datos existentes para migrarlos luego a la tabla de servicios si fuera necesario
CREATE TEMPORARY TABLE tmp_users_data AS
SELECT 
  id, 
  service, 
  occasion, 
  location, 
  persons, 
  meal_time, 
  cuisine, 
  event_date, 
  description
FROM public.users
WHERE service IS NOT NULL 
   OR occasion IS NOT NULL 
   OR location IS NOT NULL
   OR persons IS NOT NULL 
   OR meal_time IS NOT NULL 
   OR cuisine IS NOT NULL 
   OR event_date IS NOT NULL 
   OR description IS NOT NULL;

-- Eliminar las columnas que ahora estarán en la tabla de servicios
ALTER TABLE public.users 
  DROP COLUMN IF EXISTS service,
  DROP COLUMN IF EXISTS occasion,
  DROP COLUMN IF EXISTS location,
  DROP COLUMN IF EXISTS persons,
  DROP COLUMN IF EXISTS meal_time,
  DROP COLUMN IF EXISTS cuisine,
  DROP COLUMN IF EXISTS event_date,
  DROP COLUMN IF EXISTS description;

-- Mantener solo location en users ya que es un dato relevante del usuario
-- En caso de querer migrar datos existentes a la nueva estructura:
-- INSERT INTO public.services (user_id, service, occasion, location, persons, meal_time, cuisine, event_date, description)
-- SELECT id, service, occasion, location, persons, meal_time, cuisine, event_date, description FROM tmp_users_data; 