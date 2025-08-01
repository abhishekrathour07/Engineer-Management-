import { api } from "./axiosRequest";

// Project service interfaces
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  startDate: string;
  endDate?: string;
  requiredSkills: string[];
  teamSize: number;
  managerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  requiredSkills?: string[];
  teamSize?: number;
  managerId: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
}

export interface ProjectResponse {
  project: Project;
}

export const projectService = {
  async getProjects(): Promise<ProjectsResponse> {
    try {
      const response = await api.get('/projects');
      console.log('Raw API response:', response.data); // Debug log
      
      // Handle both success and error responses from backend
      if (response.data.success === false) {
        // If no projects found, return empty array
        if (response.data.message === "No projects found") {
          return {
            projects: [],
            total: 0
          };
        }
        throw new Error(response.data.message);
      }
      
      const projects = response.data.data || [];
      
      // Transform backend data to match frontend interface
      const transformedProjects = projects.map((project: any) => ({
        id: project._id || project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        requiredSkills: project.requiredSkills || [],
        teamSize: project.teamSize || 1,
        managerId: project.managerId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }));
      
      console.log('Transformed projects:', transformedProjects); // Debug log
      
      return {
        projects: transformedProjects,
        total: transformedProjects.length
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  async getProjectById(id: string): Promise<ProjectResponse> {
    try {
      const response = await api.get(`/projects/${id}`);
      const project = response.data.data;
      
      const transformedProject = {
        id: project._id || project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        requiredSkills: project.requiredSkills || [],
        teamSize: project.teamSize || 1,
        managerId: project.managerId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      };
      
      return {
        project: transformedProject
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  async createProject(data: CreateProjectData): Promise<ProjectResponse> {
    try {
      const response = await api.post('/projects', data);
      const project = response.data.data;
      
      const transformedProject = {
        id: project._id || project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        requiredSkills: project.requiredSkills || [],
        teamSize: project.teamSize || 1,
        managerId: project.managerId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      };
      
      return {
        project: transformedProject
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
};

export default projectService; 