import Assignment from "../models/assignmentModel.js";
import User from "../models/userModel.js";

import response from "../utils/responseHandler.js";

export const getEngineers = async (req, res) => {
  try {
    const engineers = await User.find({ role: "engineer" });
    if (!engineers) {
      return response(res, 404, "not found");
    } else {
      return response(res, 200, "engineer fetched successfully", engineers);
    }
  } catch (error) {
    return response(res, 500, "Failed to fetch ", error.message);
  }
};

export const getEngineerCapacity = async (req, res) => {
  try {
    const { id } = req.params;
    const engineer = await User.findById(id);
    if (!engineer) {
      return response(res, 404, "Engineer not found");
    }
    const assignments = await Assignment.find({ engineerId: id });
    if(!assignments){
      return response (res,404,"assignment not found")
    }
    const allocated = assignments.reduce(
      (sum, a) => sum + a.allocationPercentage,
      0
    );
    const available = engineer.maxCapacity - allocated;
     const capacityData = {
      engineer: engineer.name,
      availableCapacity: available,
    };
    return response(res, 200, "Engineer capacity fetched successfully", capacityData);
  } catch (error) {
    return response(res,500,"internal server error",error.message)
  }
};
