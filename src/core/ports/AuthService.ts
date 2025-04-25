import { Session, AuthError, OAuthResponse } from '@supabase/supabase-js';

// Puerto para el servicio de autenticación
export interface AuthService {
  signInWithGoogle(): Promise<OAuthResponse>;
  signOut(): Promise<{ error: AuthError | null }>;
  getSession(): Promise<{ session: Session | null }>;
  onAuthStateChange(callback: (event: string, session: Session | null) => void): { 
    data: { subscription: { unsubscribe: () => void } } 
  };
} 