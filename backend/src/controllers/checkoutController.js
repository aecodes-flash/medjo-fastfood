import Checkout from "../models/Checkout.js";
import Order from "../models/Order.js";

export const submitPayment = async (req, res) => {
  try {
    const { orderId, method, reference } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const existing = await Checkout.findOne({ orderId });
    if (existing) {
      return res.status(400).json({ message: "Payment already submitted for this order." });
    }

    const payment = await Checkout.create({
      orderId,
      userId: req.userId,
      method,
      amount: order.totalPrice,
      reference: reference || "",
    });
      order.paymentMethod = method;
      await order.save();
    res.status(201).json({ message: "Payment submitted successfully.", payment });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit payment.", error: error.message });
  }
};

export const getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Checkout.findOne({ orderId: req.params.orderId });
    if (!payment) return res.status(404).json({ message: "No payment found for this order." });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment.", error: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Checkout.find()
      .populate("orderId")
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments.", error: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["Pending", "Verified", "Rejected"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const payment = await Checkout.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: "Payment not found." });
    res.status(200).json({ message: "Payment status updated.", payment });
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment.", error: error.message });
  }
};