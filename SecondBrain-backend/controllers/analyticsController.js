import Note from '../models/Note.js';
import Bookmark from '../models/bookmark.js';
import Comment from '../models/comment.js';
import Activity from '../models/activity.js';

// Get analytics data based on type
export const getAnalytics = async (req, res) => {
  try {
    const { type = 'overview' } = req.query;
    const userId = req.user._id;
    
    let data = [];
    
    switch (type) {
      case 'overview':
        // Get counts of different entities
        const [notesCount, bookmarksCount, commentsCount, activitiesCount] = await Promise.all([
          Note.countDocuments({ user: userId }),
          Bookmark.countDocuments({ user: userId }),
          Comment.countDocuments({ user: userId }),
          Activity.countDocuments({ user: userId })
        ]);
        
        data = [
          { name: 'Notes', value: notesCount },
          { name: 'Bookmarks', value: bookmarksCount },
          { name: 'Comments', value: commentsCount },
          { name: 'Activities', value: activitiesCount }
        ];
        break;
        
      case 'categories':
        // Get notes grouped by tags (simulating categories)
        const notesByTag = await Note.aggregate([
          { $match: { user: userId } },
          { $unwind: { path: '$tags', preserveNullAndEmptyArrays: true } },
          { $group: { _id: '$tags', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]);
        
        data = notesByTag.map(item => ({
          name: item._id || 'Untagged',
          value: item.count
        }));
        break;
        
      case 'bookmarks':
        // Get bookmarks grouped by tags
        const bookmarksByTag = await Bookmark.aggregate([
          { $match: { user: userId } },
          { $unwind: { path: '$tags', preserveNullAndEmptyArrays: true } },
          { $group: { _id: '$tags', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]);
        
        data = bookmarksByTag.map(item => ({
          name: item._id || 'Untagged',
          value: item.count
        }));
        break;
        
      case 'activity':
        // Get activity over the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const activities = await Activity.aggregate([
          { 
            $match: { 
              user: userId,
              createdAt: { $gte: sevenDaysAgo }
            }
          },
          {
            $group: {
              _id: { 
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        
        data = activities.map(item => ({
          name: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: item.count
        }));
        break;
        
      case 'tags':
        // Get all popular tags across notes and bookmarks
        const noteTags = await Note.aggregate([
          { $match: { user: userId } },
          { $unwind: '$tags' },
          { $group: { _id: '$tags', count: { $sum: 1 } } }
        ]);
        
        const bookmarkTags = await Bookmark.aggregate([
          { $match: { user: userId } },
          { $unwind: '$tags' },
          { $group: { _id: '$tags', count: { $sum: 1 } } }
        ]);
        
        // Combine and aggregate tags
        const tagMap = {};
        [...noteTags, ...bookmarkTags].forEach(tag => {
          if (tagMap[tag._id]) {
            tagMap[tag._id] += tag.count;
          } else {
            tagMap[tag._id] = tag.count;
          }
        });
        
        data = Object.entries(tagMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid analytics type' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// Get stats summary
export const getStatsSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const [
      totalNotes,
      totalBookmarks,
      totalComments,
      favoriteNotes,
      favoriteBookmarks,
      recentActivity
    ] = await Promise.all([
      Note.countDocuments({ user: userId }),
      Bookmark.countDocuments({ user: userId }),
      Comment.countDocuments({ user: userId }),
      Note.countDocuments({ user: userId, isFavorite: true }),
      Bookmark.countDocuments({ user: userId, isFavorite: true }),
      Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(1)
    ]);
    
    res.json({
      totalNotes,
      totalBookmarks,
      totalComments,
      totalFavorites: favoriteNotes + favoriteBookmarks,
      lastActivityDate: recentActivity[0]?.createdAt || null
    });
  } catch (err) {
    console.error('Stats summary error:', err);
    res.status(500).json({ error: 'Failed to fetch stats summary' });
  }
};
