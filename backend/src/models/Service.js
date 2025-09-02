import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // links to service provider
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true }, // new field for location
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
