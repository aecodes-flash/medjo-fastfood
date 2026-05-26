import Review from "../models/Review.js";
import Order from "../models/Order.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "username email")
      .populate("orderId", "totalPrice status")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews.", error: error.message });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    if (!orderId || !rating) {
      return res.status(400).json({ message: "orderId and rating are required." });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only review your own orders." });
    }
    if (order.status !== "Delivered") {
      return res.status(400).json({ message: "You can only review delivered orders." });
    }

    const existing = await Review.findOne({ orderId, userId: req.userId });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this order." });
    }

    const review = await Review.create({ orderId, userId: req.userId, rating, comment });
    res.status(201).json({ message: "Review submitted.", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review.", error: error.message });
  }
};

export const getOrderReviews = async (req, res) => {
  try {
    const reviews = await Review.findOne({ orderId: req.params.orderId })
      .populate("userId", "username");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews.", error: error.message });
  }
};