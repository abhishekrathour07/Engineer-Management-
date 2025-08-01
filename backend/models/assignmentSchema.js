import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    engineerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    allocationPercentage: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    role: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);