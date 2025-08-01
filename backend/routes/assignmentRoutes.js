import express from "express";
import { createAssignment, deleteAssignment, getAssignmentById, getAssignments, updateAssignment } from "../controller/assignmentController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAssignments);
router.get("/:id", authMiddleware, getAssignmentById);
router.post("/", authMiddleware, createAssignment);
router.patch("/:id", authMiddleware, updateAssignment);
router.delete("/:id", authMiddleware, deleteAssignment);

export default router;
