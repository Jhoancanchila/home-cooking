// Definición de tipos para los datos de servicio en el dominio
export interface Service {
  id?: string;
  user_id: string;
  service?: string;
  occasion?: string;
  location?: string;
  persons?: string;
  meal_time?: string;
  cuisine?: string;
  event_date?: string;
  description?: string;
  created_at?: string;
} 