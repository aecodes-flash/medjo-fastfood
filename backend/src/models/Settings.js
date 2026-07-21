import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Medjo Fast Food" },
    deliveryFee: { type: Number, default: 49 },
    minOrder: { type: Number, default: 100 },
    onlineOrdering: { type: Boolean, default: true },
    gcashPayments: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    customerReviews: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);