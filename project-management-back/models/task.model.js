import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({

  // ===== Basic Info =====
  title: { type: String, required: true },
  description: { type: String, default: "" },

  // ===== Project Link (Required for system) =====
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  // ===== Assignment =====
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // ===== Priority =====
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium"
  },

  // ===== Status =====
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },

  // ===== Due Date =====
  dueDate: { type: Date, required: true },

  // ===== Comments =====
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],

  // ===== Attachments =====
  attachments: [
    {
      fileUrl: String,
      fileName: String,
      uploadedAt: { type: Date, default: Date.now }
    }
  ]

}, { timestamps: true }); // adds createdAt + updatedAt automatically

export default mongoose.model("Task", TaskSchema);
