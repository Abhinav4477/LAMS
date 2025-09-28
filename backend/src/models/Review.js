import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate reviews by same user for same service
reviewSchema.index({ service: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
