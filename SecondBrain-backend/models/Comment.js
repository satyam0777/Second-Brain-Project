
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referenceType: { type: String, default: 'bookmark' }, // Could be post, video, etc.
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the bookmark
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Comment", commentSchema);
