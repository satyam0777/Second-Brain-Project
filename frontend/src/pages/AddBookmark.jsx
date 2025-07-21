
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import API from "../api/axios";

const AddBookmark = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState(""); // New state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bookmarks", { title, url, description });
      alert("Bookmark added!");
      setTitle("");
      setUrl("");
      setDescription("");
      navigate("/dashboard");
    } catch (error) {
      alert("Error adding bookmark.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-2xl font-bold mb-6">🔖 Add New Bookmark</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 rounded bg-slate-800"
          placeholder="Bookmark Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full p-3 rounded bg-slate-800"
          placeholder="Bookmark URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <textarea
          className="w-full p-3 rounded bg-slate-800"
          placeholder="Bookmark Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
        >
          Save Bookmark
        </button>
      </form>
    </div>
  );
};

export default AddBookmark;
