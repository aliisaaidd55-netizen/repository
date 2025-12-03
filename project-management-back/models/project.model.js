import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  startDate: { type: Date, default: Date.now },
  endDate: Date,

  // ---- Project Leader ----
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // ---- Team Members ----
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  // ---- Tasks inside this project ----
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  ],

  // ---- Attached Files ----
  files: [
    {
      type: String
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

// ========================================
// Instance Methods
// ========================================
ProjectSchema.methods.isLeader = function (userId) {
  return String(this.leader) === String(userId);
};

ProjectSchema.methods.isMember = function (userId) {
  if (!userId) return false;

  // Leader is always considered a member
  if (String(this.leader) === String(userId)) return true;

  return this.members.some(m => String(m) === String(userId));
};

// ========================================
// Static Helper
// ========================================
ProjectSchema.statics.findUserProjects = function (userId) {
  return this.find({
    $or: [{ leader: userId }, { members: userId }]
  });
};

export default mongoose.model("Project", ProjectSchema);
