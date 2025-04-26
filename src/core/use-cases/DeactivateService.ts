import { ServiceRepository } from '../ports/ServiceRepository';

export class DeactivateService {
  private serviceRepository: ServiceRepository;

  constructor(serviceRepository: ServiceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(serviceId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      // Verificar que el servicio existe
      const serviceExists = await this.serviceRepository.getServiceById(serviceId);
      
      if (!serviceExists.data) {
        return { 
          success: false, 
          error: 'El servicio que intentas desactivar no existe'
        };
      }

      // Desactivar el servicio
      const result = await this.serviceRepository.deactivateService(serviceId);
      
      if (!result.success) {
        return { 
          success: false, 
          error: result.error?.message || 'Error al desactivar el servicio'
        };
      }
      
      return { success: true, error: null };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error inesperado al desactivar el servicio' 
      };
    }
  }
} 