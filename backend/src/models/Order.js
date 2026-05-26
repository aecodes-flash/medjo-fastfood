import mongoose from "mongoose";

//1- create a schema
//2- model based off of that schema

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
      name:       { type: String, required: true },
      price:      { type: Number, required: true },
      quantity:   { type: Number, required: true, min: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"],
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);