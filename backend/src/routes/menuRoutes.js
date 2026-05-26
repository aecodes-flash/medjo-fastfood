import express from "express";
import { getAllMenuItems, getSingleMenuItem, createMenuItem, updateMenuItem, deleteMenuItem } from "../controllers/menuController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/menu
// Public — anyone can browse the menu (no login needed)
// Returns all menu items from MongoDB
router.get("/", getAllMenuItems);

// GET /api/menu/:id
// Public — get one specific menu item by its MongoDB ID
// Example: /api/menu/64f1a2b3c4d5e6f7a8b9c0d1
router.get("/:id", getSingleMenuItem);
router.post("/",        authMiddleware, adminMiddleware, createMenuItem);
router.put("/:id",      authMiddleware, adminMiddleware, updateMenuItem);
router.delete("/:id",   authMiddleware, adminMiddleware, deleteMenuItem);

export default router;