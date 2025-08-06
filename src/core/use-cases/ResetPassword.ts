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
  constructor(private authRepository: AuthService) {}

  async execute(newPassword: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Validaciones básicas
      if (!newPassword || !newPassword.trim()) {
        throw new Error('La nueva contraseña es requerida.');
      }

      if (newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }

      if (newPassword.length > 128) {
        throw new Error('La contraseña no puede exceder 128 caracteres.');
      }

      // Validar que tenga al menos una letra y un número
      const hasLetter = /[a-zA-Z]/.test(newPassword);
      const hasNumber = /\d/.test(newPassword);
      
      if (!hasLetter || !hasNumber) {
        throw new Error('La contraseña debe contener al menos una letra y un número.');
      }

      const result = await this.authRepository.updatePassword(newPassword);
      
      if (result.error) {
        throw result.error;
      }

      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Error al actualizar la contraseña') 
      };
    }
  }
}