import { Service } from '../entities/Service';
import { ServiceRepository } from '../ports/ServiceRepository';

export class SaveServiceData {
  private serviceRepository: ServiceRepository;

  constructor(serviceRepository: ServiceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(serviceData: Service): Promise<{ success: boolean; error: string | null; data?: Service }> {
    try {
      const { data, error } = await this.serviceRepository.saveService(serviceData);
      
      if (error) {
        return { 
          success: false, 
          error: error.message || 'Error al guardar los datos del servicio'
        };
      }
      
      return { success: true, error: null, data: data && data.length > 0 ? data[0] : undefined };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error inesperado al guardar datos del servicio' 
      };
    }
  }
} 