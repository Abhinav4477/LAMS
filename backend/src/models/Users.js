import mongoose from "mongoose";

//creating schema for users
const userSchema = new mongoose.Schema({ 
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
      minlength: 6,
    },
    email: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        lowercase: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'provider', 'admin'],
        default: 'user',
    },
},
{timestamps: true} //to add createdAt and updatedAt fields 

);

const User = mongoose.model('User', userSchema);

export default User;