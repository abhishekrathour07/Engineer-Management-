import express from 'express'
import { login, logout, signup, getProfile, updateProfile } from '../controller/authController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';


const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/profile", authMiddleware, getProfile);
authRouter.put("/profile", authMiddleware, updateProfile);

export default authRouter