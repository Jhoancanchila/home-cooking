import { UserRepository } from '../ports/UserRepository';

// Caso de uso para validar la autenticación del usuario según su email
export class ValidateUserAuth {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string): Promise<boolean> {
    if (!email) return false;
    
    try {
      return await this.userRepository.findUserByEmail(email);
    } catch (error) {
      console.error('Error al validar la autenticación del usuario:', error);
      return false;
    }
  }
} 