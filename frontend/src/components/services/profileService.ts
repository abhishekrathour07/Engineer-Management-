import { api } from './axiosRequest';

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  seniority?: string;
  maxCapacity: number;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  skills?: string[];
  seniority?: string;
  maxCapacity?: number;
  department?: string;
}

class ProfileService {
  async getProfile(): Promise<ProfileData> {
    try {
      const response = await api.get('/auth/profile');
      const user = response.data.data;
      
      return {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills || [],
        seniority: user.seniority,
        maxCapacity: user.maxCapacity || 100,
        department: user.department,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<ProfileData> {
    try {
      const response = await api.put('/auth/profile', data);
      const user = response.data.data;
      
      return {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills || [],
        seniority: user.seniority,
        maxCapacity: user.maxCapacity || 100,
        department: user.department,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      throw error;
    }
  }
}

export const profileService = new ProfileService(); 