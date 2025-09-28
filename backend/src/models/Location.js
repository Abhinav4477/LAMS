import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: true,
        index: true,
    }
}, { timestamps: true }); //to add createdAt and updatedAt fields
const Location = mongoose.model('Location', locationSchema);
export default Location;