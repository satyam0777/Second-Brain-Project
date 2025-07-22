// src/pages/SingleBookmark.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash2, Globe, Calendar } from "lucide-react";
import axios from "../api/axios";

const SingleBookmark = () => {
  const { id } = useParams();
  const [bookmark, setBookmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmark = async () => {
      const token = localStorage.getItem("token");
      console.log("📌 Bookmark ID:", id);
      if (!token || !id) {
        console.warn("Missing token or bookmark ID");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/bookmarks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("✅ Bookmark fetched:", res.data);
        setBookmark(res.data);
      } catch (err) {
        console.error("❌ Error fetching bookmark:", err.response?.data || err.message);
        setBookmark(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmark();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this bookmark?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/bookmarks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/dashboard");
      } catch (err) {
        console.error("Error deleting bookmark:", err.response?.data || err.message);
        alert("Failed to delete bookmark");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white text-xl animate-pulse">Loading bookmark...</p>
      </div>
    );
  }

  if (!bookmark || !bookmark._id) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-center text-white">
        <div>
          <h2 className="text-2xl font-bold mb-4">Bookmark Not Found</h2>
          <p className="text-gray-400 mb-6">It seems the bookmark was deleted or the ID is incorrect.</p>
          <RouterLink
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </RouterLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-purple-400" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Bookmarks
            </span>
          </div>
          <RouterLink
            to="/dashboard"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            <ArrowLeft className="inline w-4 h-4 mr-1" />
            Back
          </RouterLink>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <div className="flex justify-between mb-4">
            <div>
              <h1 className="text-3xl font-semibold">{bookmark.title || "Untitled"}</h1>
              <div className="flex items-center text-sm text-gray-400 mt-2 space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(bookmark.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => alert("Edit functionality coming soon")}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-red-600 hover:bg-red-700 rounded"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 bg-slate-800/40 rounded p-4 border border-white/10">
            {/* <p className="text-sm">
              <strong className="text-purple-300">URL:</strong>{" "}
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">
                {bookmark.url || "No URL"}
              </a>
            </p> */}
            <p className="text-gray-600">
  URL:{" "}
  {bookmark?.url ? (
    <a
      href={bookmark.url.startsWith("http") ? bookmark.url : `https://${bookmark.url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      {bookmark.url}
    </a>
  ) : (
    "No URL"
  )}
</p>

            <p className="mt-2 text-sm">
              <strong className="text-purple-300">Description:</strong> {bookmark.description || "No description"}
            </p>
          </div>

          <div className="mt-6 text-gray-400 text-xs flex justify-between">
            <span>Updated: {new Date(bookmark.updatedAt || bookmark.createdAt).toLocaleString()}</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SingleBookmark;
