import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  uploadedBy: String,
  size: Number,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("SharedDocument", DocumentSchema);
