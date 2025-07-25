import { AuthService } from '../../core/ports/AuthService';
import { createClient, SupabaseClient, Session, AuthError } from '@supabase/supabase-js';

export class SupabaseAuthService implements AuthService {
  private supabase: SupabaseClient;

  constructor() {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  async signInWithEmail(email: string, password: string): Promise<{ error: AuthError | null }> {
    return this.supabase.auth.signInWithPassword({
      email,
      password
    });
  }
  signUpWithEmail(email: string, password: string): Promise<{ error: AuthError | null; }> {
    return this.supabase.auth.signUp({
      email,
      password
    });
  }

  async signInWithGoogle() {
    return await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    return { session: data.session };
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
} 