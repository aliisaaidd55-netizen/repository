import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  avatarUrl: String
});

export default mongoose.model("TeamMember", MemberSchema);
