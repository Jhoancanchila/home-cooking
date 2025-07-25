import { AuthService } from '../ports/AuthService';

export class RequestPasswordReset {
  constructor(private authServiceRepository: AuthService) {}

  async execute(email: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('El formato del email no es válido.');
      }

      const { error } = await this.authServiceRepository.resetPassword(email);
      
      if (error) {
        throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Error al solicitar reset de contraseña') 
      };
    }
  }
}

export class UpdatePassword {
  constructor(private authServiceRepository: AuthService) {}

  async execute(newPassword: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Validar contraseña
      if (!newPassword || newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }

      const { error } = await this.authServiceRepository.updatePassword(newPassword);
      
      if (error) {
        throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Error al actualizar contraseña') 
      };
    }
  }
}