import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
      password: {              
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["engineer", "manager"],
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    seniority: {
        type: String,
        enum: ["junior", "mid", "senior"]
    },
    maxCapacity: {
        type: Number,
        default: 100
    },
    department: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);