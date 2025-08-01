import { api } from "./axiosRequest";

// Assignment service interfaces
export interface Assignment {
  id: string;
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  engineer?: {
    id: string;
    name: string;
    skills: string[];
  };
  project?: {
    id: string;
    name: string;
  };
}

export interface CreateAssignmentData {
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string;
  role: string;
}

export interface UpdateAssignmentData {
  engineerId?: string;
  projectId?: string;
  allocationPercentage?: number;
  startDate?: string;
  endDate?: string;
  role?: string;
}

export interface AssignmentsResponse {
  assignments: Assignment[];
  total: number;
}

export interface AssignmentResponse {
  assignment: Assignment;
}

export const assignmentService = {
  async getAssignments(): Promise<AssignmentsResponse> {
    try {
      const response = await api.get("/assignments");
      const assignments = response.data.data || [];

      // Transform backend data to match frontend interface
      const transformedAssignments = assignments.map((assignment: any) => ({
        id: assignment._id || assignment.id,
        engineerId: assignment.engineerId?._id || assignment.engineerId || null,
        projectId: assignment.projectId?._id || assignment.projectId || null,
        allocationPercentage: assignment.allocationPercentage,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        role: assignment.role,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
        engineer:
          assignment.engineerId && typeof assignment.engineerId === "object"
            ? {
                id: assignment.engineerId._id || assignment.engineerId.id,
                name: assignment.engineerId.name,
                skills: assignment.engineerId.skills || [],
              }
            : undefined,
        project:
          assignment.projectId && typeof assignment.projectId === "object"
            ? {
                id: assignment.projectId._id || assignment.projectId.id,
                name: assignment.projectId.name,
              }
            : undefined,
      }));

      return {
        assignments: transformedAssignments,
        total: transformedAssignments.length,
      };
    } catch (error) {
      console.error("Error fetching assignments:", error);
      return {
        assignments: [],
        total: 0,
      };
    }
  },

  async getAssignmentById(id: string): Promise<AssignmentResponse> {
    try {
      const response = await api.get(`/assignments/${id}`);
      const assignment = response.data.data;

      const transformedAssignment = {
        id: assignment._id || assignment.id,
        engineerId: assignment.engineerId?._id || assignment.engineerId || null,
        projectId: assignment.projectId?._id || assignment.projectId || null,
        allocationPercentage: assignment.allocationPercentage,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        role: assignment.role,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
        engineer:
          assignment.engineerId && typeof assignment.engineerId === "object"
            ? {
                id: assignment.engineerId._id || assignment.engineerId.id,
                name: assignment.engineerId.name,
                skills: assignment.engineerId.skills || [],
              }
            : undefined,
        project:
          assignment.projectId && typeof assignment.projectId === "object"
            ? {
                id: assignment.projectId._id || assignment.projectId.id,
                name: assignment.projectId.name,
              }
            : undefined,
      };

      return {
        assignment: transformedAssignment,
      };
    } catch (error) {
      console.error("Error fetching assignment:", error);
      throw error;
    }
  },

  async createAssignment(
    data: CreateAssignmentData
  ): Promise<AssignmentResponse> {
    try {
      const response = await api.post("/assignments", data);
      const assignment = response.data.data;

      const transformedAssignment = {
        id: assignment._id || assignment.id,
        engineerId: assignment.engineerId,
        projectId: assignment.projectId,
        allocationPercentage: assignment.allocationPercentage,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        role: assignment.role,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
      };

      return {
        assignment: transformedAssignment,
      };
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  },

  async updateAssignment(
    id: string,
    data: UpdateAssignmentData
  ): Promise<AssignmentResponse> {
    try {
      const response = await api.patch(`/assignments/${id}`, data);
      const assignment = response.data.data;

      const transformedAssignment = {
        id: assignment._id || assignment.id,
        engineerId: assignment.engineerId,
        projectId: assignment.projectId,
        allocationPercentage: assignment.allocationPercentage,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        role: assignment.role,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
      };

      return {
        assignment: transformedAssignment,
      };
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  },

  async deleteAssignment(id: string): Promise<void> {
    try {
      await api.delete(`/assignments/${id}`);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      throw error;
    }
  },
};

export default assignmentService;
