import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      default: null,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Paid",
    },
    receiptId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ Safe export to prevent OverwriteModelError
export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
