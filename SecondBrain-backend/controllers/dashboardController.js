import Note from '../models/Note.js';
import Bookmark from '../models/bookmark.js';
import Comment from '../models/comment.js';
import Activity from '../models/activity.js';

//getdashboardstats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [notesCount, bookmarksCount, commentsCount, noteFavs, bookmarkFavs] = await Promise.all([
      Note.countDocuments({ user: userId }),
      Bookmark.countDocuments({ user: userId }),
      Comment.countDocuments({ user: userId }),
      Note.countDocuments({ user: userId, isFavorite: true }),
      Bookmark.countDocuments({ user: userId, isFavorite: true })
    ]);
    res.json({
      notes: notesCount,
      bookmarks: bookmarksCount,
      comments: commentsCount,
      favorites: noteFavs + bookmarkFavs
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

//getrecentactivities
export const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(activities);
  } catch {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};