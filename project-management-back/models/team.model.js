import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamMember",
    default: null
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamMember"
    }
  ]
});

export default mongoose.model("Team", TeamSchema);
