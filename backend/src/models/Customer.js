import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true }, // ✅ added address field
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
