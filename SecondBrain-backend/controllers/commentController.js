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

// Get all user comments
export const getAllUserComments = async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.user._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(comments);
  } catch (err) {
    console.error('Get all comments error:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Create a comment for a bookmark
export const createComment = async (req, res) => {
  try {
    const { text, content, referenceId, referenceType } = req.body;
    const comment = new Comment({
      text: text || content,
      referenceId,
      referenceType: referenceType || 'bookmark',
      user: req.user._id
    });
    await comment.save();
    
    // Populate user data before returning
    await comment.populate('user', 'name');
    
    await logActivity(req.user._id, 'comment_posted', 'Posted a comment', comment._id);
    res.status(201).json(comment);
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

