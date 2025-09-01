import mongoose from "mongoose";

//creating schema for states
const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }
}); //to add createdAt and updatedAt fields

const State = mongoose.model('State', stateSchema);
export default State;