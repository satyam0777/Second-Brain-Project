import Bookmark from '../models/bookmark.js';
import logActivity from '../utils/logActivity.js';

// getBookmarks
export const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id });
    res.json(bookmarks);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
};

//createBookmark
export const createBookmark = async (req, res) => {
  try {
    const bookmark = new Bookmark({ ...req.body, user: req.user._id });
    await bookmark.save();
    await logActivity(req.user._id, 'bookmark_added', `Added bookmark: ${bookmark.title}`, bookmark._id);
    res.status(201).json(bookmark);
  } catch {
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
};

//updateBookmark
export const updateBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json(bookmark);
  } catch {
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
};

//deleteBookmark

export const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json({ message: 'Bookmark deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
};