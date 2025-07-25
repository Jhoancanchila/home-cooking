import { UserProfileRepository } from '../../core/ports/UserRepository';
import { UserProfile, UserAuthInfo } from '../../core/entities/User';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseUserProfileRepository implements UserProfileRepository {
  private supabase: SupabaseClient;
  private userCheckInProgress: {[email: string]: boolean} = {};

  constructor() {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  async saveUserProfile(userProfile: UserProfile) {
    // Usar mutex basado en email para evitar operaciones concurrentes sobre el mismo usuario
    if (this.userCheckInProgress[userProfile.email]) {
      // Esperar hasta que la operación anterior termine (simple polling)
      let attempt = 0;
      const maxAttempts = 10; // Máximo 10 intentos (5 segundos)
      
      while (this.userCheckInProgress[userProfile.email] && attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Esperar 500ms
        attempt++;
      }
      
      if (this.userCheckInProgress[userProfile.email]) {
        // Verificar si el usuario ya existe después del tiempo de espera
        const exists = await this.findUserProfileByEmail(userProfile.email);
        console.log("🚀 ~ SupabaseUserProfileRepository ~ saveUserProfile ~ exists:", exists)
        if (exists) {
          return { data: [{...userProfile, id: 'existing-user'}], error: null };
        }
      }
    }
    
    this.userCheckInProgress[userProfile.email] = true;
    
    try {
      // Verificar primero si el usuario ya existe (para evitar duplicados)
      const { data: existingUser, error: checkError } = await this.supabase
        .from('user_profile')
        .select('*')
        .eq('email', userProfile.email)
        .maybeSingle(); // Usar maybeSingle en lugar de single para evitar errores
        
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no se encontró ningún registro
        console.error('Error al verificar si el perfil de usuario existe:', checkError);
        if (checkError.code === '404' || checkError.message.includes('does not exist')) {
          console.error('La tabla "user_profile" no existe en la base de datos.');
          throw new Error('La tabla "user_profile" no existe en la base de datos. Debes crear las tablas necesarias en Supabase.');
        }
      }
      
      if (existingUser) {
        // Si existe un usuario pero no tiene auth_id, actualizarlo
        return { data: [existingUser], error: null };
      }
      
      // Verificar una vez más para asegurarnos (doble verificación)
      const userExists = await this.findUserProfileByEmail(userProfile.email);
      if (userExists) {
        return { data: [{...userProfile, id: 'existing-user-double-check'}], error: null };
      }
      
      const { data, error } = await this.supabase
        .from('user_profile')
        .insert([userProfile])
        .select();

      if (error) {
        // Si es un error de unicidad, el usuario probablemente se insertó por otra operación
        if (error.code === '23505' || error.message.includes('violates unique constraint')) {
          // Intentar recuperar el registro ya existente
          const { data: conflictUser } = await this.supabase
            .from('user_profile')
            .select('*')
            .eq('email', userProfile.email)
            .maybeSingle();
            
          if (conflictUser) {
            // Si existe un usuario pero no tiene auth_id, actualizarlo
            return { data: [conflictUser], error: null };
          }
          
          return { data: [{...userProfile, id: 'conflict-user'}], error: null };
        }
        
        console.error('Error al guardar el perfil de usuario:', error);
        
        // Comprobar si el error es de tipo 404 (tabla no existe)
        if (error.code === '404' || error.message.includes('does not exist')) {
          console.error('La tabla "user_profile" no existe en la base de datos.');
          throw new Error('La tabla "user_profile" no existe en la base de datos. Debes crear las tablas necesarias en Supabase.');
        }
        
        throw new Error('Error al guardar el perfil de usuario: ' + error.message);
      }

      return { data, error };
    } catch (err) {
      console.error('Excepción al guardar perfil de usuario:', err);
      
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Error desconocido al guardar perfil de usuario') 
      };
    } finally {
      this.userCheckInProgress[userProfile.email] = false;
    }
  }

  async getUserProfileByEmail(email: string) {
    try {
      if (!email) {
        return { data: null, error: new Error('Email no proporcionado') };
      }
      
      const { data, error } = await this.supabase
        .from('user_profile')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error al obtener el perfil de usuario por email:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Excepción al obtener perfil de usuario por email:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Error desconocido al obtener perfil de usuario') 
      };
    }
  }

  async getUserProfileByAuthId(authId: string) {
    try {
      if (!authId) {
        return { data: null, error: new Error('ID de autenticación no proporcionado') };
      }
      
      const { data, error } = await this.supabase
        .from('user_profile')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      if (error) {
        console.error('Error al obtener el perfil de usuario por auth_id:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Excepción al obtener perfil de usuario por auth_id:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Error desconocido al obtener perfil de usuario') 
      };
    }
  }

  async updateUserProfile(userId: string, userProfileData: Partial<UserProfile>) {
    try {
      if (!userId) {
        return { data: null, error: new Error('ID de usuario no proporcionado') };
      }
      
      // Solo copiar los campos que se pueden actualizar
      const updateData: Partial<UserProfile> = {};
      
      if (userProfileData.name !== undefined) updateData.name = userProfileData.name;
      if (userProfileData.phone !== undefined) updateData.phone = userProfileData.phone;
      if (userProfileData.auth_id !== undefined) updateData.auth_id = userProfileData.auth_id;
      
      const { data, error } = await this.supabase
        .from('user_profile')
        .update(updateData)
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error al actualizar el perfil de usuario:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Excepción al actualizar perfil de usuario:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Error desconocido al actualizar perfil de usuario') 
      };
    }
  }

  async findUserProfileByEmail(email: string): Promise<boolean> {
    try {
      if (!email) {
        return false;
      }

      const { data, error } = await this.supabase.rpc('verificar_usuario_existe', { email_input: email });
      if (error) {
        console.error('Error al verificar si el usuario existe por email:', error);
        return false;
      }
      return data;
      
    } catch (err) {
      console.error('Excepción al verificar email:', err);
      return false;
    }
  }
  async getInfoUserAuthByEmail(email: string): Promise< { data: UserAuthInfo | null; error: Error | null }> {
    if(!email) {
      return { data: null, error: new Error('Email no proporcionado') };
    }
    try {
      const { data, error } = await this.supabase.rpc('obtener_info_usuario', { email_input: email });
      
      if (error) {
        console.error('Error al obtener información del usuario por email:', error);
        return { data: null, error: error };
      }

      if (data?.providers.length > 0) {
        return { data: { provider: data.providers }, error: null };
      }
      
      return { data: null, error: new Error('Email o contraseña incorrectos') };
    } catch (error) {
      console.error('Error al obtener información del usuario por email:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Error desconocido al obtener información del usuario') };
    }
  }
};
