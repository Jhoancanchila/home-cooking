// Definición de tipos para los datos de usuario en el dominio
export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  source?: string;
  created_at?: string;
} 