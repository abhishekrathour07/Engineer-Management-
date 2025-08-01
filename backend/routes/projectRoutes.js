import express from "express";
import { createProject, getProjectById, getProjects } from "../controller/projectController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProjects);
router.post("/", authMiddleware, createProject);
router.get("/:id", authMiddleware, getProjectById);

export default router;
