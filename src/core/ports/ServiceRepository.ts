import { Service } from '../entities/Service';

export interface ServiceRepository {
  saveService(serviceData: Service): Promise<{ data: Service[] | null; error: Error | null }>;
  findServicesByUserEmail(userEmail: string): Promise<Service[]>;
  updateService(serviceId: string, serviceData: Partial<Service>): Promise<{ data: Service[] | null; error: Error | null }>;
  getServiceById(serviceId: string): Promise<{ data: Service | null; error: Error | null }>;
} 