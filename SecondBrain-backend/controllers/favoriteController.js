
import Favorite from "../models/favorite.js";
import Note from "../models/Note.js";
import Bookmark from "../models/bookmark.js";

// Get user's all favorites
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // Populate the actual note/bookmark data
    const populatedFavorites = await Promise.all(
      favorites.map(async (fav) => {
        const favObj = fav.toObject();
        if (fav.itemType === "Note") {
          const note = await Note.findById(fav.itemId);
          favObj.note = note;
        } else if (fav.itemType === "Bookmark") {
          const bookmark = await Bookmark.findById(fav.itemId);
          favObj.bookmark = bookmark;
        }
        return favObj;
      })
    );
    
    res.json(populatedFavorites);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

// Add favorite
export const addFavorite = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const existing = await Favorite.findOne({ user: req.user._id, itemId });
    if (existing) return res.status(400).json({ error: "Already favorited" });

    const favorite = new Favorite({ user: req.user._id, itemId, itemType });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

// Remove favorite
export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    await Favorite.findOneAndDelete({ _id: id, user: req.user._id });
    res.status(200).json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};
