import mongoose from "mongoose";


const serviceRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
    requestDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected','Working', 'Completed'], default: 'Pending' },
}, { timestamps: true });
const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;