import express from "express";
import { getEngineerCapacity, getEngineers } from "../controller/engineerController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, getEngineers);
router.get("/:id/capacity", authMiddleware, getEngineerCapacity);

export default router;
