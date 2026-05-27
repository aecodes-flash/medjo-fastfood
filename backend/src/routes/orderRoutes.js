import express from "express";
import {
  placeOrder,
  getOrderHistory,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from "../controllers/orderController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { orderLimiter } from "../Middleware/rateLimiter.js";
import { verifyToken, isAdmin } from "../Middleware/adminMiddleware.js";

const router = express.Router();

// GET /api/orders/all — get all orders (admin only)
router.get("/all", verifyToken, isAdmin, getAllOrders);

// POST /api/orders — place a new order
router.post("/", authMiddleware, orderLimiter, placeOrder);

// GET /api/orders/history — get all orders of logged in user
router.get("/history", authMiddleware, getOrderHistory);

// GET /api/orders/:id — get one specific order
router.get("/:id", authMiddleware, getSingleOrder);

// PUT /api/orders/:id/status — update order status (admin)
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

// PATCH /api/orders/:id/cancel — cancel a pending order (matches frontend)
router.patch("/:id/cancel", authMiddleware, cancelOrder);

// DELETE /api/orders/:id — delete an order
router.delete("/:id", verifyToken, isAdmin, cancelOrder);

export default router;