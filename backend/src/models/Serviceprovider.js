import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  is_verified: { type: Boolean, default: false },
  is_available: { type: Boolean, default: true },
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
const ServiceProvider = mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', serviceProviderSchema);

export default ServiceProvider;
