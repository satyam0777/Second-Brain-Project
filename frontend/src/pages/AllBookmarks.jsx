import React, { useEffect, useState } from "react";
import axios from "axios";

const AllBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get("/api/bookmarks");
        setBookmarks(res.data);
      } catch (err) {
        console.error("Failed to fetch bookmarks", err);
      }
    };

    fetchBookmarks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bookmark?")) return;
    try {
      await axios.delete(`/api/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete bookmark.");
    }
  };

  return (
    <div className="p-8 text-white bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔖 All Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div key={bookmark._id} className="bg-slate-800 p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{bookmark.title}</h2>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                {bookmark.url}
              </a>
              <div className="mt-2">
                <button
                  onClick={() => handleDelete(bookmark._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBookmarks;
