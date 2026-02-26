import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, ArrowLeft, ExternalLink, Trash2, Star } from "lucide-react";
import API from "../api/axios";

const AllBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await API.get("/bookmarks");
        setBookmarks(res.data);
      } catch (err) {
        console.error("Failed to fetch bookmarks", err);
        alert("Failed to fetch bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bookmark?")) return;
    try {
      await API.delete(`/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
      alert("Bookmark deleted successfully");
    } catch (err) {
      console.error("Failed to delete bookmark", err);
      alert("Failed to delete bookmark.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl animate-pulse">Loading bookmarks...</p>
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
          <Bookmark className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">All Bookmarks</h1>
        </div>
        <p className="text-gray-400">Manage all your saved bookmarks in one place</p>
      </div>

      {/* Bookmarks Grid */}
      <div className="max-w-6xl mx-auto">
        {bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
          >
            <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No bookmarks yet.</p>
            <button
              onClick={() => navigate("/add-bookmark")}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Add Your First Bookmark
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {bookmark.title}
                  </h2>
                  {bookmark.isFavorite && (
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  )}
                </div>
                
                <a
                  href={bookmark.url.startsWith("http") ? bookmark.url : `https://${bookmark.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mb-3 break-all"
                >
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <span className="line-clamp-1">{bookmark.url}</span>
                </a>
                
                {bookmark.description && (
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {bookmark.description}
                  </p>
                )}
                
                {bookmark.tags && bookmark.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bookmark.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => navigate(`/bookmarks/${bookmark._id}`)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(bookmark._id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBookmarks;
