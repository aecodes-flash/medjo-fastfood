import Order from "../models/Order.js";
import Checkout from "../models/Checkout.js";

const DELIVERY_FEE = 49;

export const placeOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item." });
    }

    //limit quantity per item to prevent abuse (e.g., ordering 1000 pizzas in one go) AI
    const MAX_ALLOWED_QUANTITY = 30;
    for (const item of items) {
      if (item.quantity > MAX_ALLOWED_QUANTITY) {
        return res.status(400).json({ 
          message: `You cannot order more than ${MAX_ALLOWED_QUANTITY} units of ${item.name}.` 
        });
      }
    }

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPrice = itemsTotal + DELIVERY_FEE;

    const order = await Order.create({
    userId: req.userId,
    items,
    totalPrice,   
    phone: req.body.phone || "",
    address: req.body.address || "",
    });

    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order.", error: error.message });
  }
};

export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders.", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders.", error: error.message });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.userId.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order." });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order.", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });

    res.status(200).json({ message: "Order status updated.", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status.", error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to cancel this order." });
    }
    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled." });
    }

    order.status = "Cancelled";
    await order.save();

    // Sync — also reject the linked payment if one exists
    await Checkout.findOneAndUpdate(
      { orderId: order._id },
      { status: "Rejected" }
    );

    res.status(200).json({ message: "Order cancelled.", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order.", error: error.message });
  }
};