
import Note from '../models/Note.js';
import Bookmark from '../models/bookmark.js';
import Comment from '../models/comment.js';

export const searchAll = async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;

    if (!query) {
      return res.json({ notes: [], bookmarks: [], comments: [] });
    }

    const searchRegex = { $regex: query, $options: 'i' };
    const results = {};

    // Log search request (for debugging)
    console.log(` Searching for '${query}' in: ${type}`);

    if (type === 'all' || type === 'notes') {
      results.notes = await Note.find({
        user: req.user._id,
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex },
        ],
      }).limit(10);
    }

    if (type === 'all' || type === 'bookmarks') {
      results.bookmarks = await Bookmark.find({
        user: req.user._id,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { url: searchRegex },
          { tags: searchRegex },
        ],
      }).limit(10);
    }

    if (type === 'all' || type === 'comments') {
      results.comments = await Comment.find({
        user: req.user._id,
        content: searchRegex,
      }).limit(10);
    }

    return res.json(results);
  } catch (error) {
    console.error(' Search Error:', error);
    return res.status(500).json({ error: 'Failed to perform search' });
  }
};
