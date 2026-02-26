

// src/pages/AddNote.jsx
import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
  
  if (!content.trim()) {
    setError("Content is required");
    return;
  }
  
  if (title.length > 200) {
    setError("Title must be less than 200 characters");
    return;
  }
  
  setLoading(true);
  
  try {
    const response = await API.post("/notes", { title: title.trim(), content: content.trim() });
    const savedNote = response.data;

    console.log("Saved note:", savedNote);

    if (!savedNote._id) {
      throw new Error("Note saved, but no ID returned.");
    }

    alert("Note added successfully!");
    navigate("/dashboard", { state: { noteAdded: true } });

  } catch (error) {
    console.error("Add note error:", error.response?.data || error.message);
    setError(error.response?.data?.error || "Error adding note. Please try again.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📝 Add New Note</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">{title.length}/200 characters</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Write your note content..."
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={10000}
              disabled={loading}
            ></textarea>
            <p className="text-xs text-gray-400 mt-1">{content.length}/10,000 characters</p>
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : "Save Note"}
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

export default AddNote;

