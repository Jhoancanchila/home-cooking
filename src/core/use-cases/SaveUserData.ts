import { UserProfile } from '../entities/User';
import { UserProfileRepository } from '../ports/UserRepository';

// Caso de uso para guardar datos de usuario
export class SaveUserData {
  constructor(private userRepository: UserProfileRepository) {}

  async execute(userData: UserProfile): Promise<{ success: boolean; error: string | null; data?: UserProfile }> {
    try {
      const { data, error } = await this.userRepository.saveUserProfile(userData);
      
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