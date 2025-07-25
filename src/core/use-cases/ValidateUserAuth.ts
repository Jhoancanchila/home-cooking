import { UserAuthInfo } from '../entities/User';
import { UserProfileRepository } from '../ports/UserRepository';

// Caso de uso para validar la autenticación del usuario según su email
export class ValidateUserAuth {
  constructor(private userProfileRepository: UserProfileRepository) {}

  async execute(email: string): Promise<boolean> {
    if (!email) return false;
    
    try {
      return await this.userProfileRepository.findUserProfileByEmail(email);
    } catch (error) {
      console.error('Error al validar la autenticación del usuario:', error);
      return false;
    }
  }
} 

export class ValidateUserInfoAuth {
  constructor(private userProfileRepository: UserProfileRepository) {}

  async execute(email: string): Promise<{ data: UserAuthInfo | null; error: Error | null }> {
    if (!email) {
      return { data: null, error: new Error('Email no proporcionado') };
    }
    
    try {
      return await this.userProfileRepository.getInfoUserAuthByEmail(email);
    } catch (error) {
      console.error('Error al obtener información del usuario por email:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Error desconocido al obtener información del usuario') };
    }
  }
}