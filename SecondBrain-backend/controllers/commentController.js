import Comment from '../models/comment.js';
import logActivity from '../utils/logActivity.js';


// Get comments for a bookmark
export const getComments = async (req, res) => {
  try {
    const { referenceId } = req.params;
    const comments = await Comment.find({ referenceId }).populate('user', 'name');
    res.json(comments);
  } catch {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Create a comment for a bookmark
export const createComment = async (req, res) => {
  try {
    const { content, referenceId } = req.body;
    const comment = new Comment({
      content,
      referenceId,
      user: req.user._id
    });
    await comment.save();
    await logActivity(req.user._id, 'comment_posted', 'Posted a comment', comment._id);
    res.status(201).json(comment);
  } catch {
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

