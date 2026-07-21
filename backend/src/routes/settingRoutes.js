import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { adminMiddleware, authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

// GET /api/settings - Public (or protected) to read store config
router.get("/", getSettings);

// PUT /api/settings - Admin only to update settings
router.put("/", authMiddleware, adminMiddleware, updateSettings);

export default router;