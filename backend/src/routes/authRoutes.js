import express from "express";
import { register, login } from "../controllers/authController.js";
import { authLimiter } from "../Middleware/rateLimiter.js";

const router = express.Router();

// POST /api/auth/register
// Public — anyone can register
// authLimiter — max 10 attempts per 15 minutes
router.post("/register", authLimiter, register);

// POST /api/auth/login
// Public — anyone can login
// authLimiter — prevents brute force password guessing
router.post("/login", authLimiter, login);

export default router;    