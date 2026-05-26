import express from "express";
import {
  submitReview,
  getOrderReviews,
  getAllReviews
} from "../controllers/reviewController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all", authMiddleware, adminMiddleware, getAllReviews);

// POST /api/reviews
// Protected — only logged in users can submit a review
// User can only review after their order is "Delivered"
router.post("/", authMiddleware, submitReview);

// GET /api/reviews/:orderId
// Public — anyone can see reviews for a specific order
// Example: /api/reviews/64f1a2b3c4d5e6f7a8b9c0d1
router.get("/:orderId", getOrderReviews);

export default router;