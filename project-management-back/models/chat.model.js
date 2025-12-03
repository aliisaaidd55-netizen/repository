import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userName: String,
  message: String,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("ChatMessage", ChatSchema);
