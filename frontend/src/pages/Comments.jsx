

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, ArrowLeft, Calendar, Link as LinkIcon } from "lucide-react";
import API from "../api/axios";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get("/comments");
        setComments(res.data);
      } catch (err) {
        console.error("Failed to load comments:", err);
        alert("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl animate-pulse">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8 text-green-400" />
          <h1 className="text-3xl font-bold">All Comments</h1>
        </div>
        <p className="text-gray-400">View all your comments across bookmarks and notes</p>
      </div>

      {/* Comments List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
          >
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No comments yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Comments you post on bookmarks will appear here.
            </p>
          </motion.div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                    {comment.referenceType || 'bookmark'}
                  </span>
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-200 leading-relaxed">{comment.text}</p>
              
              {comment.referenceId && (
                <button
                  onClick={() => navigate(`/bookmarks/${comment.referenceId}`)}
                  className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  View related item
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
