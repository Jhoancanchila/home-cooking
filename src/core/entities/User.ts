// Definición de tipos para los datos de perfil de usuario en el dominio
export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  source?: string;
  created_at?: string;
} 