import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    notes: [],
    todos: [],
    bookmarks: [],
    favorites: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      console.log("Searching for:", query);
      
      const res = await API.get(`/search?query=${encodeURIComponent(query)}&type=all`);

      console.log("Full API response:", res);
      
      if (res.data) {
        const normalizedData = {
          notes: res.data.notes || [],
          todos: res.data.comments || [],
          bookmarks: res.data.bookmarks || [],
          favorites: res.data.favorites || []
        };
        
        console.log("Notes found:", normalizedData.notes?.length || 0);
        console.log("Comments found:", normalizedData.todos?.length || 0);
        console.log("Bookmarks found:", normalizedData.bookmarks?.length || 0);
        console.log("Favorites found:", normalizedData.favorites?.length || 0);
        
        setResults(normalizedData);
      } else {
        console.error("No data in response");
        setError("No data received from server");
      }
    } catch (err) {
      console.error("Search failed:", err);
      console.error("Error details:", err.response?.data);
      setError(`Search failed: ${err.response?.data?.error || err.message}`);
      setResults({ notes: [], todos: [], bookmarks: [], favorites: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const totalResults = (results?.notes?.length || 0) + 
                       (results?.todos?.length || 0) + 
                       (results?.bookmarks?.length || 0) + 
                       (results?.favorites?.length || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          🔍 Universal Search
        </h1>
        <p className="text-gray-400 mb-6">
          Search across all your notes, bookmarks, comments, and favorites. Click on any result to view full details.
        </p>
        
        <div className="flex gap-4 mb-6">
          <input
            className="flex-1 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
            placeholder="Search for anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <button 
            onClick={handleSearch} 
            disabled={loading || !query.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed font-semibold transition-all shadow-lg"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Results Summary */}
        {query && !loading && totalResults > 0 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-lg font-semibold">Found {totalResults} result{totalResults !== 1 ? 's' : ''}</span>
              {results?.notes?.length > 0 && (
                <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  📝 {results.notes.length} Note{results.notes.length !== 1 ? 's' : ''}
                </span>
              )}
              {results?.bookmarks?.length > 0 && (
                <span className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                  🔗 {results.bookmarks.length} Bookmark{results.bookmarks.length !== 1 ? 's' : ''}
                </span>
              )}
              {results?.todos?.length > 0 && (
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  💬 {results.todos.length} Comment{results.todos.length !== 1 ? 's' : ''}
                </span>
              )}
              {results?.favorites?.length > 0 && (
                <span className="bg-pink-600/20 text-pink-400 px-3 py-1 rounded-full text-sm">
                  ⭐ {results.favorites.length} Favorite{results.favorites.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Notes Section */}
          {results?.notes?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                📝 Notes ({results.notes.length})
              </h2>
              <div className="space-y-3">
                {results.notes.map((note, i) => (
                  <div 
                    key={note._id || `note-${i}`} 
                    onClick={() => navigate(`/notes/${note._id}`)}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-green-500/50 hover:scale-[1.02] transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {note.title && <h3 className="text-lg font-semibold mb-2 text-white">{note.title}</h3>}
                        <p className="text-sm text-gray-300 line-clamp-3">{note.content}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {note.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          {results?.todos?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                💬 Comments ({results.todos.length})
              </h2>
              <div className="space-y-3">
                {results.todos.map((comment, i) => (
                  <div 
                    key={comment._id || `comment-${i}`} 
                    onClick={() => {
                      if (comment.referenceType === 'note') {
                        navigate(`/notes/${comment.referenceId}`);
                      } else if (comment.referenceType === 'bookmark') {
                        navigate(`/bookmarks/${comment.referenceId}`);
                      }
                    }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-blue-500/50 hover:scale-[1.02] transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">{comment.text || comment.content}</p>
                        {comment.createdAt && (
                          <p className="text-xs text-gray-500 mt-3">
                            📅 {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookmarks Section */}
          {results?.bookmarks?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                🔗 Bookmarks ({results.bookmarks.length})
              </h2>
              <div className="space-y-3">
                {results.bookmarks.map((bm, i) => (
                  <div 
                    key={bm._id || `bm-${i}`} 
                    onClick={() => navigate(`/bookmarks/${bm._id}`)}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-yellow-500/50 hover:scale-[1.02] transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 text-white">{bm.title}</h3>
                        <a 
                          href={bm.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-blue-400 hover:text-blue-300 underline break-all"
                        >
                          {bm.url}
                        </a>
                        {bm.description && <p className="text-sm text-gray-300 mt-2">{bm.description}</p>}
                        {bm.tags && bm.tags.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {bm.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorites Section */}
          {results?.favorites?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-pink-400 mb-4 flex items-center gap-2">
                ⭐ Favorites ({results.favorites.length})
              </h2>
              <div className="space-y-3">
                {results.favorites.map((fav, i) => (
                  <div 
                    key={fav._id || `fav-${i}`} 
                    onClick={() => {
                      if (fav.type === 'note') {
                        navigate(`/notes/${fav._id}`);
                      } else if (fav.type === 'bookmark') {
                        navigate(`/bookmarks/${fav._id}`);
                      }
                    }}
                    className="bg-white/5 backdrop-blur-md border-l-4 border-pink-500 rounded-xl p-5 hover:bg-white/10 hover:border-pink-400 hover:scale-[1.02] transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-pink-600 px-2 py-1 rounded font-semibold">
                            {fav.type === 'note' ? '📝 Note' : '🔗 Bookmark'}
                          </span>
                          <h3 className="text-lg font-semibold text-white">{fav.title}</h3>
                        </div>
                        {fav.type === 'note' && fav.content && (
                          <p className="text-sm text-gray-300 mt-2 line-clamp-3">{fav.content}</p>
                        )}
                        {fav.type === 'bookmark' && (
                          <div className="mt-2">
                            <a 
                              href={fav.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm text-blue-400 hover:text-blue-300 underline break-all"
                            >
                              {fav.url}
                            </a>
                            {fav.description && <p className="text-sm text-gray-300 mt-2">{fav.description}</p>}
                          </div>
                        )}
                        {fav.tags && fav.tags.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {fav.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs bg-pink-600/20 text-pink-400 px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-pink-400 transition-colors flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {query && !loading && totalResults === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">No results found</h3>
              <p className="text-gray-500">Try searching with different keywords for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
