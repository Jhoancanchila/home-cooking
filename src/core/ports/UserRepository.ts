import { User } from '../entities/User';

// Puerto para el repositorio de usuarios
export interface UserRepository {
  saveUser(user: User): Promise<{ data: User[] | null; error: Error | null }>;
  findUserByEmail(email: string): Promise<boolean>;
  getUserByEmail(email: string): Promise<{ data: User | null; error: Error | null }>;
  updateUser(userId: string, userData: Partial<User>): Promise<{ data: User[] | null; error: Error | null }>;
} 