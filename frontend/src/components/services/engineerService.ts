import { api } from "./axiosRequest";

// Engineer service interfaces
export interface Engineer {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  availability: number;
  seniority?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EngineerCapacity {
  engineerId: string;
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  assignments: Array<{
    id: string;
    projectName: string;
    hoursAllocated: number;
  }>;
}

export interface EngineersResponse {
  engineers: Engineer[];
  total: number;
}

export interface EngineerCapacityResponse {
  capacity: EngineerCapacity;
}

export const engineerService = {
  async getEngineers(): Promise<EngineersResponse> {
    try {
      const response = await api.get('/engineers');
      const engineers = response.data.data || [];
      
      // Transform backend data to match frontend interface
      const transformedEngineers = engineers.map((engineer: any) => ({
        id: engineer._id || engineer.id,
        name: engineer.name,
        email: engineer.email,
        role: engineer.role,
        skills: engineer.skills || [],
        availability: engineer.maxCapacity || 100,
        seniority: engineer.seniority,
        department: engineer.department,
        createdAt: engineer.createdAt,
        updatedAt: engineer.updatedAt
      }));
      
      return {
        engineers: transformedEngineers,
        total: transformedEngineers.length
      };
    } catch (error) {
      console.error('Error fetching engineers:', error);
      return {
        engineers: [],
        total: 0
      };
    }
  },

  async getEngineerCapacity(id: string): Promise<EngineerCapacityResponse> {
    try {
      const response = await api.get(`/engineers/${id}/capacity`);
      const capacityData = response.data.data;
      
      return {
        capacity: {
          engineerId: id,
          totalCapacity: 100, // Default max capacity
          usedCapacity: capacityData ? (100 - capacityData.availableCapacity) : 0,
          availableCapacity: capacityData?.availableCapacity || 0,
          assignments: [] // This would come from assignments API
        }
      };
    } catch (error) {
      console.error('Error fetching engineer capacity:', error);
      return {
        capacity: {
          engineerId: id,
          totalCapacity: 100,
          usedCapacity: 0,
          availableCapacity: 100,
          assignments: []
        }
      };
    }
  }
};

export default engineerService; 