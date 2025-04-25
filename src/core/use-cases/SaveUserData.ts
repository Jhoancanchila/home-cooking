import { User } from '../entities/User';
import { UserRepository } from '../ports/UserRepository';

// Caso de uso para guardar datos de usuario
export class SaveUserData {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: User): Promise<{ success: boolean; error: string | null; data?: User }> {
    try {
      const { data, error } = await this.userRepository.saveUser(userData);
      
      if (error) {
        return { 
          success: false, 
          error: error.message || 'Error al guardar los datos del usuario'
        };
      }
      
      return { success: true, error: null, data: data && data.length > 0 ? data[0] : undefined };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error inesperado al guardar datos' 
      };
    }
  }
} 