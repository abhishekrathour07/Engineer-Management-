import Assignment from "../models/assignmentModel.js";
import response from "../utils/responseHandler.js";

export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("engineerId", "name skills")
      .populate("projectId", "name");
    return response(res, 200, "Assignments fetched successfully", assignments);
  } catch (error) {
    return response(
      res,
      500,
      "Failed to fetch  the assignments",
      error.message
    );
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id)
      .populate("engineerId", "name skills")
      .populate("projectId", "name");
    
    if (!assignment) {
      return response(res, 404, "Assignment not found");
    }
    
    return response(res, 200, "Assignment fetched successfully", assignment);
  } catch (error) {
    return response(
      res,
      500,
      "Failed to fetch the assignment",
      error.message
    );
  }
};

export const createAssignment = async (req, res) => {
  try {
    const {
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role,
    } = req.body;
     if (!engineerId || !projectId || !allocationPercentage || !startDate || !role) {
          return response(
            res,
            400,
            "All Fields are mandatory please check it out properly"
          );
        }
    const assignment = await Assignment.create({
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role,
    });
    
    // Populate the created assignment with related data
    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate("engineerId", "name skills")
      .populate("projectId", "name");
    
    return response(res, 200, "assignment created successfully", populatedAssignment);
  } catch (error) {
    return response(res, 500, "failed to create the assignment", error.message);
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Assignment.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("engineerId", "name skills").populate("projectId", "name");
    
    if (!updated) {
      return response(res, 404, "Assignment not found");
    }
    return response(res, 200, "assignment updated successfully", updated);
  } catch (error) {
    return response(res, 500, "failed to update the assignment", error.message);
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Assignment.findByIdAndDelete(id);
    if (!deleted) {
      return response(res, 404, "Assignment not found");
    }
    return response(res, 200, "Assignment deleted successfully");
  } catch (error) {
    return response(res, 500, "failed to deleteAssignment", error.message);
  }
};
