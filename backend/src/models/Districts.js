import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true,
        index: true,
    }
}, { timestamps: true }); //to add createdAt and updatedAt fields

const District = mongoose.model('District', districtSchema);
export default District;