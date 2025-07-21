

// src/pages/AddNote.jsx
import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();



const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await API.post("/notes", { title, content });
    const savedNote = response.data;

    console.log("Saved note:", savedNote); // ✅ Check for _id here

    if (!savedNote._id) {
      throw new Error("Note saved, but no ID returned.");
    }

    alert("Note added!");

    // Pass the saved note to dashboard via navigation if needed
    navigate("/dashboard", { state: { noteAdded: true } });

  } catch (error) {
    console.error("Add note error:", error.response?.data || error.message);
    alert("Error adding note.");
  }
};
  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-2xl font-bold mb-6">📝 Add New Note</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 rounded bg-slate-800"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-3 rounded bg-slate-800"
          placeholder="Note Content"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded"
        >
          Save Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;

