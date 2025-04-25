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