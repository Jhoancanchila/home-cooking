// Definición de tipos para los datos de perfil de usuario en el dominio
export interface UserProfile {
  id?: string;
  auth_id?: string;  // ID del usuario en Supabase Auth
  name: string;
  email: string;
  phone: string;
  source?: string;
  created_at?: string;
} 