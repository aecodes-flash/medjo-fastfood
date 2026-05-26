import express from "express";
import { submitPayment, getPaymentByOrder, getAllPayments, updatePaymentStatus } from "../controllers/checkoutController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",                    authMiddleware, submitPayment);
router.get("/order/:orderId",       authMiddleware, getPaymentByOrder);
router.get("/all",                  authMiddleware, getAllPayments);
router.put("/:id/status",           authMiddleware, updatePaymentStatus);

export default router;