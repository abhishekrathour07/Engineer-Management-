import Project from "../models/projectModel.js";
import response from "../utils/responseHandler.js";

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find();
    if (projects.length === 0) {
      return response(res, 404, "No projects found");
    }

    return response(res, 200, "Projects fetched successfully", projects);
  } catch (error) {
    return response(res, 500, "internal server error", error.message);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, startDate, managerId } = req.body;

    if (!name || !startDate || !managerId) {
      return response(
        res,
        400,
        "Project name, start date & managerId are required"
      );
    }
    const project = await Project.create(req.body);
    return response(res, 201, "Project created successfully", project);
  } catch (error) {
    return response(res, 500, "internal server error", error.message);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return response(res, 400, "Project ID is required");
    }

    const project = await Project.findById(id);

    if (!project) {
      return response(res, 404, "Project not found");
    }

    return response(res, 200, "Project fetched successfully", project);
  } catch (error) {
    return response(res, 500, "internal server error", error.message);
  }
};
