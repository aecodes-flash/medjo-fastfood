import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
  orderId:   { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
  method:    { type: String, enum: ["gcash", "cash"], required: true },
  amount:    { type: Number, required: true },
  reference: { type: String, default: "" },
  status:    { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Checkout", checkoutSchema);