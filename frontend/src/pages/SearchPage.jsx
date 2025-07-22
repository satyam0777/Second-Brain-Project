

import React, { useState } from "react";
import axios from "axios";
import API from "../api/axios";
const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    notes: [],
    todos: [],
    bookmarks: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      console.log("Searching for:", query); // Debug log
      // Use full URL if backend is on different port
      // const res = await axios.get(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
     

const res = await API.get(`/search?q=${encodeURIComponent(query)}`);

      console.log("Full API response:", res); // Debug log
      console.log("Response data:", res.data); // Debug log
      console.log("Response status:", res.status); // Debug log
      
      // Handle different response formats
      if (res.data) {
        console.log("Type of response data:", typeof res.data);
        console.log("Is array?", Array.isArray(res.data));
        console.log("Keys in response:", Object.keys(res.data));
        
        // If response is an array or doesn't have the expected structure
        if (Array.isArray(res.data)) {
          console.log("Response is an array, treating as notes");
          setResults({ notes: res.data, todos: [], bookmarks: [] });
        } else if (res.data && typeof res.data === 'object') {
          // Handle if your backend returns different property names
          const normalizedData = {
            notes: res.data.notes || res.data.Notes || res.data.note || [],
            todos: res.data.todos || res.data.Todos || res.data.todo || res.data.tasks || [],
            bookmarks: res.data.bookmarks || res.data.Bookmarks || res.data.bookmark || res.data.links || []
          };
          
          console.log("Normalized data:");
          console.log("Notes found:", normalizedData.notes?.length || 0);
          console.log("Todos found:", normalizedData.todos?.length || 0);
          console.log("Bookmarks found:", normalizedData.bookmarks?.length || 0);
          
          setResults(normalizedData);
        } else {
          console.error("Unexpected response format:", res.data);
          setError(`Unexpected response format: ${JSON.stringify(res.data)}`);
        }
      } else {
        console.error("No data in response");
        setError("No data received from server");
      }
    } catch (err) {
      console.error("Search failed:", err);
      console.error("Error details:", err.response?.data);
      setError(`Search failed: ${err.response?.data?.message || err.message}`);
      setResults({ notes: [], todos: [], bookmarks: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-2xl font-bold mb-4">🔍 Search</h1>
      
      <div className="flex gap-4 mb-6">
        <input
          className="flex-1 p-3 bg-slate-800 rounded"
          placeholder="Type something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading || !query.trim()}
          className="bg-green-600 px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Notes Section - Fixed the logic */}
        {results?.notes?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-2">📝 Notes</h2>
            {results.notes.map((note, i) => (
              <div key={note.id || `note-${i}`} className="bg-slate-800 p-4 rounded mb-2">
                {note.title && <h3 className="text-lg font-semibold">{note.title}</h3>}
                <p className="text-sm text-gray-300">{note.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Comments/Todos Section */}
        {results?.todos?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">💬 Comments</h2>
            {results.todos.map((comment, i) => (
              <div key={comment._id || `comment-${i}`} className="bg-slate-800 p-4 rounded mb-2">
                <p className="text-sm text-gray-300">{comment.content}</p>
                {comment.createdAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bookmarks Section */}
        {results?.bookmarks?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">🔗 Bookmarks</h2>
            {results.bookmarks.map((bm, i) => (
              <div key={bm.id || `bm-${i}`} className="bg-slate-800 p-4 rounded mb-2">
                <h3 className="text-lg font-semibold">{bm.title}</h3>
                <p className="text-sm text-gray-400">{bm.url}</p>
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {query && !loading && 
         results?.notes?.length === 0 && 
         results?.todos?.length === 0 && 
         results?.bookmarks?.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No results found for "{query}"
          </div>
        )}
  

      </div>
    </div>
  );
};

export default SearchPage;