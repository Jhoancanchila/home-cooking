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

// Definición de tipos para la información de autenticación del usuario
export interface UserAuthInfo {
  //provider es de tipo array de strings para permitir múltiples proveedores
  provider: string[]; // Proveedor de autenticación (email, google, etc.)
}