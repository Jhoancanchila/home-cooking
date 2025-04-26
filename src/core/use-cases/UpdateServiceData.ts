import { Service } from '../entities/Service';
import { ServiceRepository } from '../ports/ServiceRepository';

export class UpdateServiceData {
  private serviceRepository: ServiceRepository;

  constructor(serviceRepository: ServiceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(serviceId: string, serviceData: Partial<Service>): Promise<{ success: boolean; error: string | null; data?: Service }> {
    try {
      // Verificar que el servicio existe antes de actualizarlo
      const serviceExists = await this.serviceRepository.getServiceById(serviceId);
      
      if (!serviceExists.data) {
        return { 
          success: false, 
          error: 'El servicio que intentas actualizar no existe'
        };
      }
      
      // Realizar la actualización
      const { data, error } = await this.serviceRepository.updateService(serviceId, serviceData);
      
      if (error) {
        return { 
          success: false, 
          error: error.message || 'Error al actualizar los datos del servicio'
        };
      }
      
      return { success: true, error: null, data: data && data.length > 0 ? data[0] : undefined };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error inesperado al actualizar datos del servicio' 
      };
    }
  }
} 