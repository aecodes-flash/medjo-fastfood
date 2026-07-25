import express from "express";
import { getUserProfile, updateProfile } from "../controllers/profileController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/",  authMiddleware, getUserProfile);
router.put("/",  authMiddleware, updateProfile);

export default router;