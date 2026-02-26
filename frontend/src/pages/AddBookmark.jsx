
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import API from "../api/axios";

const AddBookmark = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (!url.trim()) {
      setError("URL is required");
      return;
    }
    
    if (title.length > 200) {
      setError("Title must be less than 200 characters");
      return;
    }
    
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      setError("Please enter a valid URL");
      return;
    }
    
    setLoading(true);
    
    try {
      await API.post("/bookmarks", { 
        title: title.trim(), 
        url: url.trim(), 
        description: description.trim() 
      });
      alert("Bookmark added successfully!");
      setTitle("");
      setUrl("");
      setDescription("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Add bookmark error:", error);
      setError(error.response?.data?.error || "Error adding bookmark. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔖 Add New Bookmark</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter bookmark title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">{title.length}/200 characters</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">URL</label>
            <input
              type="url"
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Add a description for this bookmark..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            ></textarea>
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : "Save Bookmark"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookmark;
