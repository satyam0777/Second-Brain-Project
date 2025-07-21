// models/favorite.js
import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of note/bookmark/etc
    itemType: {
      type: String,
      enum: ["Note", "Bookmark", "Comment"], // or add more
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", favoriteSchema);
