import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    requiredSkills: {
        type: [String],
        default: []
    },
    teamSize: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ["planning", "active", "completed"],
        default: "planning"
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);