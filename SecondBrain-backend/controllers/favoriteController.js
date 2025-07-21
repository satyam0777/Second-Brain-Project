
import Favorite from "../models/favorite.js";

// Get user's all favorites
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id });
    res.json(favorites);
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
    const { itemId } = req.params;
    await Favorite.findOneAndDelete({ user: req.user._id, itemId });
    res.status(200).json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};
