import { UserProfile, UserAuthInfo } from '../entities/User';

// Puerto para el repositorio de usuarios
export interface UserProfileRepository {
  saveUserProfile(userProfile: UserProfile): Promise<{ data: UserProfile[] | null; error: Error | null }>;
  findUserProfileByEmail(email: string): Promise<boolean>;
  getUserProfileByEmail(email: string): Promise<{ data: UserProfile | null; error: Error | null }>;
  getUserProfileByAuthId(authId: string): Promise<{ data: UserProfile | null; error: Error | null }>;
  updateUserProfile(userId: string, userProfileData: Partial<UserProfile>): Promise<{ data: UserProfile[] | null; error: Error | null }>;
  getInfoUserAuthByEmail(email: string): Promise<{ data: UserAuthInfo | null; error: Error | null }>;
} 