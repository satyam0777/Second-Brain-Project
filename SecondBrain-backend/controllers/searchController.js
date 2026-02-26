
import Note from '../models/Note.js';
import Bookmark from '../models/bookmark.js';
import Comment from '../models/comment.js';

export const searchAll = async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;

    if (!query) {
      return res.json({ notes: [], bookmarks: [], comments: [], favorites: [] });
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
      }).limit(20).sort({ updatedAt: -1 });
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
      }).limit(20).sort({ updatedAt: -1 });
    }

    if (type === 'all' || type === 'comments') {
      results.comments = await Comment.find({
        user: req.user._id,
        text: searchRegex,
      })
      .limit(20)
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .select('text createdAt user referenceType referenceId');
    }

    // Search favorites (notes and bookmarks with isFavorite=true)
    if (type === 'all' || type === 'favorites') {
      const favoriteNotes = await Note.find({
        user: req.user._id,
        isFavorite: true,
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex },
        ],
      }).limit(10).sort({ updatedAt: -1 });

      const favoriteBookmarks = await Bookmark.find({
        user: req.user._id,
        isFavorite: true,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { url: searchRegex },
          { tags: searchRegex },
        ],
      }).limit(10).sort({ updatedAt: -1 });

      results.favorites = [
        ...favoriteNotes.map(note => ({ ...note.toObject(), type: 'note' })),
        ...favoriteBookmarks.map(bookmark => ({ ...bookmark.toObject(), type: 'bookmark' }))
      ];
    }

    // Log results count
    console.log(` Found: ${results.notes?.length || 0} notes, ${results.bookmarks?.length || 0} bookmarks, ${results.comments?.length || 0} comments, ${results.favorites?.length || 0} favorites`);

    return res.json(results);
  } catch (error) {
    console.error(' Search Error:', error);
    return res.status(500).json({ error: 'Failed to perform search' });
  }
};
