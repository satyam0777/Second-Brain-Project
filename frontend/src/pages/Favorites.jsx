import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowLeft, BookOpen, Bookmark as BookmarkIcon, Calendar, ExternalLink } from "lucide-react";
import API from "../api/axios";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all, notes, bookmarks
  const [removing, setRemoving] = useState(null); // Track which item is being removed
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Fetch all notes and bookmarks with isFavorite: true
        const [notesRes, bookmarksRes] = await Promise.all([
          API.get("/notes"),
          API.get("/bookmarks")
        ]);
        
        // Filter for favorites and format them
        const favoriteNotes = notesRes.data
          .filter(note => note.isFavorite)
          .map(note => ({
            _id: note._id,
            itemId: note._id,
            itemType: "Note",
            note: note,
            createdAt: note.createdAt
          }));
        
        const favoriteBookmarks = bookmarksRes.data
          .filter(bookmark => bookmark.isFavorite)
          .map(bookmark => ({
            _id: bookmark._id,
            itemId: bookmark._id,
            itemType: "Bookmark",
            bookmark: bookmark,
            createdAt: bookmark.createdAt
          }));
        
        // Combine and sort by creation date
        const allFavorites = [...favoriteNotes, ...favoriteBookmarks].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setFavorites(allFavorites);
        console.log("Favorites loaded:", allFavorites);
      } catch (err) {
        console.error("Failed to load favorites:", err);
        alert("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = useCallback(async (favorite) => {
    if (!window.confirm("Remove from favorites?")) return;
    
    setRemoving(favorite._id);
    
    // Optimistically update UI first
    setFavorites((prev) => prev.filter((f) => f.itemId !== favorite.itemId));
    
    try {
      console.log("Removing favorite:", favorite);
      
      // Update the note/bookmark's isFavorite field
      if (favorite.itemType === "Note") {
        await API.put(`/notes/${favorite.itemId}`, { isFavorite: false });
      } else if (favorite.itemType === "Bookmark") {
        await API.put(`/bookmarks/${favorite.itemId}`, { isFavorite: false });
      }
      
      console.log("Favorite removed successfully");
      
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      alert("Failed to remove favorite. Reloading...");
      // Reload if failed
      window.location.reload();
    } finally {
      setRemoving(null);
    }
  }, []);

  const filteredFavorites = useMemo(() => {
    return favorites.filter((fav) => {
      if (activeTab === "all") return true;
      return fav.itemType === activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1); // "notes" -> "Note"
    });
  }, [favorites, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl animate-pulse">Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          <h1 className="text-3xl font-bold">Favorites</h1>
        </div>
        <p className="text-gray-400">All your starred notes and bookmarks in one place</p>

        {/* Tabs */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "all"
                ? "bg-purple-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            All ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "notes"
                ? "bg-purple-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Notes ({favorites.filter((f) => f.itemType === "Note").length})
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "bookmarks"
                ? "bg-purple-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            <BookmarkIcon className="w-4 h-4" />
            Bookmarks ({favorites.filter((f) => f.itemType === "Bookmark").length})
          </button>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="max-w-6xl mx-auto">
        {filteredFavorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
          >
            <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No favorites yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Star your important notes and bookmarks to see them here.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFavorites.map((favorite, index) => (
              <motion.div
                key={favorite._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {favorite.itemType === "Note" ? (
                      <BookOpen className="w-5 h-5 text-purple-400" />
                    ) : (
                      <BookmarkIcon className="w-5 h-5 text-blue-400" />
                    )}
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
                      {favorite.itemType}
                    </span>
                  </div>
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>

                {/* Show resource details if populated */}
                {favorite.note && (
                  <>
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                      {favorite.note.title}
                    </h2>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                      {favorite.note.content}
                    </p>
                    {favorite.note.tags && favorite.note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {favorite.note.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {favorite.bookmark && (
                  <>
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                      {favorite.bookmark.title}
                    </h2>
                    <a
                      href={favorite.bookmark.url.startsWith("http") ? favorite.bookmark.url : `https://${favorite.bookmark.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mb-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="line-clamp-1">{favorite.bookmark.url}</span>
                    </a>
                    {favorite.bookmark.tags && favorite.bookmark.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {favorite.bookmark.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                  <Calendar className="w-3 h-3" />
                  Added {new Date(favorite.createdAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => {
                      if (favorite.itemType === "Note" && favorite.itemId) {
                        navigate(`/notes/${favorite.itemId}`);
                      } else if (favorite.itemType === "Bookmark" && favorite.itemId) {
                        navigate(`/bookmarks/${favorite.itemId}`);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
                  >
                    View {favorite.itemType}
                  </button>
                  <button
                    onClick={() => handleRemoveFavorite(favorite._id)}
                    disabled={removing === favorite._id}
                    className={`p-2 rounded transition-colors ${
                      removing === favorite._id 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    title="Remove from favorites"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
