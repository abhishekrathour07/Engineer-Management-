
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import response from "../utils/responseHandler.js";

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return response(res, 400, "User already exists, you can login");
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return response(res, 201, "Account created successfully", {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

  } catch (error) {
    return response(res, 500, "Internal Server Error", error.message);
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await userModel.findOne({ email });

    if (!existUser) {
      return response(res, 404, "User not found");
    }

    const passwordCorrect = await bcrypt.compare(password, existUser.password);
    if (!passwordCorrect) {
      return response(res, 401, "Incorrect password");
    }

    const token = jwt.sign(
      { email: existUser.email, _id: existUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return response(res, 200, "Login Successfully", {
      userId: existUser._id,
      token: token,
      name: existUser.name,
      role: existUser.role,
      profileImage: existUser.profileImage,
    });
  } catch (error) {
    response(res, 500, "Internal server Error", { error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    return response(res, 200, "Logout Successfully");
  } catch (error) {
    response(res, 500, "Internal server Error", error);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return response(res, 404, "User not found");
    }

    return response(res, 200, "Profile fetched successfully", user);
  } catch (error) {
    return response(res, 500, "internal server error", error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, skills, seniority, maxCapacity, department } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (skills !== undefined) updateData.skills = skills;
    if (seniority !== undefined) updateData.seniority = seniority;
    if (maxCapacity !== undefined) updateData.maxCapacity = maxCapacity;
    if (department !== undefined) updateData.department = department;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return response(res, 404, "User not found");
    }

    return response(res, 200, "Profile updated successfully", updatedUser);
  } catch (error) {
    return response(res, 500, "Internal server error", error.message);
  }
};

export { login, signup, logout, getProfile, updateProfile };
