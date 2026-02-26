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

// getBookmarkById
export const getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.user._id });
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    res.json(bookmark);
  } catch (error) {
    console.error('Error fetching bookmark:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};




export const createBookmark = async (req, res) => {
  try {
    // console.log("Request received to create bookmark:", req.body);
    const bookmark = new Bookmark({ ...req.body, user: req.user._id });
    await bookmark.save();
    await logActivity(req.user._id, 'bookmark_added', `Added bookmark: ${bookmark.title}`, bookmark._id);
    res.status(201).json(bookmark);
  } catch (err) {
    console.error("Error creating bookmark:", err);
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
};



//updateBookmark
export const updateBookmark = async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json(bookmark);
  } catch (err) {
    console.error('Update bookmark error:', err);
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