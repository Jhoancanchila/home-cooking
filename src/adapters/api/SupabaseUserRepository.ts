import { UserRepository } from '../../core/ports/UserRepository';
import { User } from '../../core/entities/User';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseUserRepository implements UserRepository {
  private supabase: SupabaseClient;
  private userCheckInProgress: {[email: string]: boolean} = {};

  constructor() {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  async saveUser(userData: User) {
    // Usar mutex basado en email para evitar operaciones concurrentes sobre el mismo usuario
    if (this.userCheckInProgress[userData.email]) {
      // Esperar hasta que la operación anterior termine (simple polling)
      let attempt = 0;
      const maxAttempts = 10; // Máximo 10 intentos (5 segundos)
      
      while (this.userCheckInProgress[userData.email] && attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Esperar 500ms
        attempt++;
      }
      
      if (this.userCheckInProgress[userData.email]) {
        // Verificar si el usuario ya existe después del tiempo de espera
        const exists = await this.findUserByEmail(userData.email);
        if (exists) {
          return { data: [{...userData, id: 'existing-user'}], error: null };
        }
      }
    }
    
    this.userCheckInProgress[userData.email] = true;
    
    try {
      // Verificar primero si el usuario ya existe (para evitar duplicados)
      const { data: existingUser, error: checkError } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', userData.email)
        .maybeSingle(); // Usar maybeSingle en lugar de single para evitar errores
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no se encontró ningún registro
        console.error('Error al verificar si el usuario existe:', checkError);
        if (checkError.code === '404' || checkError.message.includes('does not exist')) {
          console.error('La tabla "users" no existe en la base de datos.');
          throw new Error('La tabla "users" no existe en la base de datos. Debes crear las tablas necesarias en Supabase.');
        }
      }
      
      if (existingUser) {
        return { data: [existingUser], error: null };
      }
      
      // Verificar una vez más para asegurarnos (doble verificación)
      const userExists = await this.findUserByEmail(userData.email);
      if (userExists) {
        return { data: [{...userData, id: 'existing-user-double-check'}], error: null };
      }
      
      const { data, error } = await this.supabase
        .from('users')
        .insert([userData])
        .select();

      if (error) {
        // Si es un error de unicidad, el usuario probablemente se insertó por otra operación
        if (error.code === '23505' || error.message.includes('violates unique constraint')) {
          // Intentar recuperar el registro ya existente
          const { data: conflictUser } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', userData.email)
            .maybeSingle();
            
          if (conflictUser) {
            return { data: [conflictUser], error: null };
          }
          
          return { data: [{...userData, id: 'conflict-user'}], error: null };
        }
        
        console.error('Error al guardar el usuario:', error);
        
        // Comprobar si el error es de tipo 404 (tabla no existe)
        if (error.code === '404' || error.message.includes('does not exist')) {
          console.error('La tabla "users" no existe en la base de datos.');
          throw new Error('La tabla "users" no existe en la base de datos. Debes crear las tablas necesarias en Supabase.');
        }
        
        throw new Error('Error al guardar el usuario: ' + error.message);
      }

      return { data, error };
    } catch (err) {
      console.error('Excepción al guardar usuario:', err);
      
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Error desconocido al guardar usuario') 
      };
    } finally {
      this.userCheckInProgress[userData.email] = false;
    }
  }

  async getUserByEmail(email: string) {
    try {
      if (!email) {
        return { data: null, error: new Error('Email no proporcionado') };
      }
      
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error al obtener el usuario por email:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Excepción al obtener usuario por email:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Error desconocido al obtener usuario') 
      };
    }
  }

  async updateUser(userId: string, userData: Partial<User>) {
    try {
      if (!userId) {
        return { data: null, error: new Error('ID de usuario no proporcionado') };
      }
      
      // Eliminar campos que no deberían actualizarse
      const updateData: Partial<User> = {};
      
      // Solo copiar los campos que se pueden actualizar
      if (userData.name !== undefined) updateData.name = userData.name;
      if (userData.phone !== undefined) updateData.phone = userData.phone;
      
      const { data, error } = await this.supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error al actualizar el usuario:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Excepción al actualizar usuario:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Error desconocido al actualizar usuario') 
      };
    }
  }

  async findUserByEmail(email: string): Promise<boolean> {
    try {
      if (!email) {
        return false;
      }
      
      const { data, error } = await this.supabase
        .from('users')
        .select('email')
        .eq('email', email);

      // Manejamos el error de forma genérica
      if (error) {
        console.error('Error al verificar el email:', error);
        
        // Comprobar si el error es de tipo 404 (tabla no existe)
        if (error.code === '404' || error.message.includes('does not exist')) {
          console.error('La tabla "users" no existe en la base de datos.');
        }
        
        return false;
      }

      // Verificamos si encontramos algún resultado
      const userExists = Array.isArray(data) && data.length > 0;
      return userExists;
    } catch (err) {
      console.error('Excepción al verificar email:', err);
      return false;
    }
  }
} 