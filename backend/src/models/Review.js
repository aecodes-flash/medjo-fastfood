import mongoose from "mongoose";

//1- create a schema
//2- model based off of that schema

const reviewSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);