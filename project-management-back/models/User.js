import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        select: false // مهم جداً عشان ميطلعش في أي Query
    },

    // ---- Role Handling (Leader / Member) ----
    role: {
        type: String,
        enum: ["leader", "member"],
        default: "member"
    },

    // ---- User Projects (Array not single object) ----
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ],

    // ---- Reset password system ----
    resetPasswordToken: String,
    resetPasswordExpire: Date

}, { timestamps: true });

export default mongoose.model("User", userSchema);
