import mongoose from 'mongoose';
// Activity Schema
const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['note_created', 'bookmark_added', 'comment_posted', 'item_favorited'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
export default mongoose.model('Activity', activitySchema);