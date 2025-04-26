import { ServiceRepository } from '../../core/ports/ServiceRepository';
import { Service } from '../../core/entities/Service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseServiceRepository implements ServiceRepository {
  private supabase: SupabaseClient;

  constructor() {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  async saveService(serviceData: Service) {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .insert([serviceData])
        .select();

      if (error) {
        console.error('Error al guardar el servicio:', error);
        
        // Comprobar si el error es de tipo 404 (tabla no existe)
        if (error.code === '404' || error.message.includes('does not exist')) {
          throw new Error('La tabla "services" no existe en la base de datos. Debes crear las tablas necesarias en Supabase.');
        }
        
        throw new Error('Error al guardar el servicio: ' + error.message);
      }

      return { data, error };
    } catch (err) {
      console.error('Excepción al guardar servicio:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Error desconocido al guardar servicio') 
      };
    }
  }

  async findServicesByUserEmail(userEmail: string): Promise<Service[]> {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .select('*')
        .eq('user_email', userEmail);
      
      if (error) {
        console.error('Error fetching services:', error);
        
        // Comprobar si el error es de tipo 404 (tabla no existe)
        if (error.code === '404' || error.message.includes('does not exist')) {
          console.error('La tabla "services" no existe en la base de datos.');
        }
        
        return [];
      }
      
      return data as Service[];
    } catch (err) {
      console.error('Excepción al buscar servicios:', err);
      return [];
    }
  }

  async updateService(serviceId: string, serviceData: Partial<Service>) {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .update(serviceData)
        .eq('id', serviceId)
        .select();

      if (error) {
        console.error('Error al actualizar el servicio:', error);
        throw new Error('Error al actualizar el servicio: ' + error.message);
      }

      return { data, error: null };
    } catch (err) {
      console.error('Excepción al actualizar servicio:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Error desconocido al actualizar servicio') 
      };
    }
  }

  async getServiceById(serviceId: string) {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .maybeSingle();
      
      if (error) {
        console.error('Error al obtener el servicio por ID:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Excepción al obtener servicio por ID:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Error desconocido al obtener servicio') 
      };
    }
  }
} 