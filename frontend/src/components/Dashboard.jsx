import axios from "../api/axios"; 

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, LogOut, Plus, BookOpen, MessageSquare, Link, Search, Settings, Bell, User, TrendingUp, Zap, Star, Clock, BarChart3, Activity, TruckElectricIcon } from "lucide-react";
import { fetchUserProfile } from "../api/user";
import { useNavigate, useLocation } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

// Animated Background Component
const AnimatedBackground = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 5,
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, color, trend, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    onClick={onClick}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group cursor-pointer"
    whileHover={{ scale: 1.02, y: -5 }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      {trend && (
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center text-green-400"
        >
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm">+{trend}%</span>
        </motion.div>
      )}
    </div>
  </motion.div>
);

//Activity item
const ActivityItem = ({ icon, title, time, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    // className={`flex items-center space-x-3  p-2 gap-1 rounded-lg shadow ${color}`}
     className={`flex items-center space-x-3 p-3 gap-x-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer ${color}`}
  >
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-sm font-medium text-purple-300 hover:underline">{title}</p>
      <p className="text-sm text-gray-300">{time}</p>
    </div>
  </motion.div>
);
// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, color, onClick, delay }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    onClick={onClick}
    //  onClick={() => navigate(action.path)}
    className={`flex items-center space-x-2 px-4 py-3 ${color} rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </motion.button>
);

// Main Dashboard Component
function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [notes, setNotes] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();



const logout = () => {
  localStorage.removeItem("token");
  navigate("/");
};


useEffect(() => {
  const getUser = async () => {
    try {
      const data = await fetchUserProfile();
      setUser({
        name: data.name,
        email: data.email,
        
        avatar: data.avatar || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(data.name)}`,

       

      });
    } catch (err) {
      console.error("User fetch error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotes = async () => {
    try {
      const res = await axios.get("/notes");
      setNotes(res.data);
      return res.data; // Return notes data
    } catch (err) {
      console.error("Notes fetch error:", err.message);
      return [];
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get("/bookmarks");
      setBookmarks(res.data);
      return res.data; // Return bookmarks data
    } catch (err) {
      console.error("Bookmarks fetch error:", err.message);
      return [];
    }
  };

  const fetchAllData = async () => {
    const notesData = await getNotes();
    const bookmarksData = await fetchBookmarks();

    // Count favorites from notes and bookmarks
    const favoriteNotesCount = notesData.filter(note => note.isFavorite).length;
    const favoriteBookmarksCount = bookmarksData.filter(bookmark => bookmark.isFavorite).length;
    setFavorites({ length: favoriteNotesCount + favoriteBookmarksCount });

    // Build recent activity from notes
    const noteActivities = notesData.map((note) => ({
      id: note._id,
      icon: "📝",
      title: `Note: ${note.title}`,
      time: new Date(note.createdAt).toLocaleString(),
      color: "bg-purple-600 hover:bg-purple-700 text-white",
      type: "note_created",
      link: `/notes/${note._id}`,
    }));

    // Build recent activity from bookmarks
    const bookmarkActivities = bookmarksData.map((bookmark) => ({
      id: bookmark._id,
      icon: "🔖",
      title: `Bookmarked: ${bookmark.title}`,
      time: new Date(bookmark.createdAt).toLocaleString(),
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      type: "bookmark_added",
      link: `/bookmarks/${bookmark._id}`,
    }));

    // Fetch comments for recent activity
    try {
      const commentsRes = await axios.get("/comments");
      const commentActivities = commentsRes.data.slice(0, 5).map((comment) => ({
        id: comment._id,
        icon: "💬",
        title: `Commented: ${comment.text.substring(0, 30)}${comment.text.length > 30 ? '...' : ''}`,
        time: new Date(comment.createdAt).toLocaleString(),
        color: "bg-green-600 hover:bg-green-700 text-white",
        type: "comment_posted",
        link: `/bookmarks/${comment.referenceId}`,
      }));
      
      // Combine and sort by time (latest first)
      const allActivities = [...noteActivities, ...bookmarkActivities, ...commentActivities].sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );

      setRecentActivities(allActivities.slice(0, 10)); // Show only latest 10
    } catch (err) {
      console.error("Failed to fetch comments for activity:", err);
      // Fallback: just show notes and bookmarks
      const allActivities = [...noteActivities, ...bookmarkActivities].sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );
      setRecentActivities(allActivities);
    }
  };
 
    const fetchComments = async () => {
      try {
        const res = await axios.get("/comments");
        setCommentCount(res.data.length);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        setCommentCount(0);
      }
    };

     const fetchFavorites = async () => {
      // Favorites count is already calculated in fetchAllData
      // This function is kept for compatibility
    };
  fetchFavorites();
  fetchComments();
  fetchAllData();
  getUser();

  fetchAllData();
  getUser();

  if (location.state?.noteAdded) {
    fetchAllData();
    window.history.replaceState({}, document.title);
  }
}, [location]);






  const stats = [
   
    { icon: BookOpen, title: "Notes", value: notes.length, color: "bg-purple-500", trend: 12, onClick: () => navigate("/add-note") },

    
      { icon: Link, title: "Bookmarks", value: bookmarks.length, color: "bg-blue-500", trend: 8, onClick: () => navigate("/bookmarks") },
   
     { icon: MessageSquare, title: "Comments", value: commentCount, color: "bg-green-500", trend: 25, onClick: () => navigate("/comments") },
    
    { icon: Star, title: "Favorites", value: favorites.length, color: "bg-yellow-500", trend: 5, onClick: () => navigate("/favorites") },
     
  ];

  
const quickActions = [
  { icon: Plus, label: "Add Note", path: "/add-note", color: "bg-purple-500 hover:bg-purple-600 text-white" },
  { icon: Link, label: "Add Bookmark", path: "/add-bookmark", color: "bg-blue-500 hover:bg-blue-600 text-white" },
  { icon: Search, label: "Search", path: "/search", color: "bg-gray-700 hover:bg-gray-600 text-white" },
  { icon: BarChart3, label: "Analytics", path: "/analytics", color: "bg-green-500 hover:bg-green-600 text-white" },
  { icon: BookOpen, label: "View Bookmarks", path: "/bookmarks", color: "bg-indigo-500 hover:bg-indigo-600 text-white" },
  { icon: Star, label: "Favorites", path: "/favorites", color: "bg-yellow-500 hover:bg-yellow-600 text-white" },
  { icon: MessageSquare, label: "Comments", path: "/comments", color: "bg-green-500 hover:bg-green-600 text-white" },
];




  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <AnimatedBackground />
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🧠
          </motion.div>
          <motion.div
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white text-lg">Loading your neural network...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
           
             <motion.div 
  className="flex items-center space-x-2 sm:space-x-3"
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
>
  <Brain className="h-8 w-8 text-purple-400" />
  <span className="hidden sm:inline text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
    SecondBrain
  </span>
</motion.div>
            {/* Search Bar */}
            <motion.div
              className="flex-1 max-w-md mx-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search your second brain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all relative"
                >
                  <Bell className="h-5 w-5 text-gray-300" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-lg shadow-lg border border-white/10 p-4"
                    >
                      <h3 className="font-semibold mb-3">Notifications</h3>
                      <div className="space-y-2">
                        <div className="p-2 bg-purple-500/20 rounded">
                          <p className="text-sm">New AI insights available</p>
                        </div>
                        <div className="p-2 bg-blue-500/20 rounded">
                          <p className="text-sm">Weekly summary ready</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <img
                    // src={user.avatar}
                    src ={"https://api.dicebear.com/7.x/pixel-art-neutral/svg"}

                    alt="Profile"
                    className="w-8 h-8 rounded-full ring-2 ring-purple-400"
                  />
                </div>
              )}
              
             
       <button
  onClick={logout}
  className="p-0 sm:px-2 sm:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all flex items-center justify-center"
  title="Logout"
>
  <LogOut className="h-5 w-5" />
</button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || "User"} 🧠
          </h1>
          <p className="text-gray-400">
            Your neural network is growing. Here's what's happening in your second brain.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {quickActions.map((action, index) => (
              <QuickActionButton
                key={action.label}
                icon={action.icon}
                label={action.label}
                color={action.color}
                // onClick={() => alert(`${action.label} clicked - connect to your backend`)}
                onClick={() => navigate(action.path)}
                delay={0.3 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-400" />
            Neural Activity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.title}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                color={stat.color}
                trend={stat.trend}
                delay={0.5 + index * 0.1}
                onClick={stat.onClick}
              />
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Activity Feed */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-400" />
              Recent Activity
            </h3>
            <div className="space-y-3">
             


{recentActivities.length > 0 ? (
  recentActivities.map((activity) => (
    <div
      key={activity.id}
      className={`p-3 my-2 rounded-md shadow-md cursor-pointer ${activity.color}`}
      onClick={() => navigate(activity.link)}
    >
      <div className="flex justify-between items-center">
        <span>{activity.icon} {activity.title}</span>
        <span className="text-sm opacity-70">{activity.time}</span>
      </div>
    </div>
  ))
) : (
  <p>No recent activity found.</p>
)}


            </div>

       
          </div>

          {/* Insights Panel */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-400" />
              AI Insights
            </h3>
            <div className="space-y-4">
              <motion.div
                className="p-4 bg-purple-500/20 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm font-medium mb-2">🎯 Focus Pattern</p>
                <p className="text-xs text-gray-300">
                  You're most productive between 10-12 AM. Consider scheduling important tasks during this time.
                </p>
              </motion.div>
              
              <motion.div
                className="p-4 bg-blue-500/20 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-sm font-medium mb-2">📚 Learning Trend</p>
                <p className="text-xs text-gray-300">
                  Your note-taking has increased 25% this week. Keep up the great work!
                </p>
              </motion.div>
              
              <motion.div
                className="p-4 bg-green-500/20 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <p className="text-sm font-medium mb-2">🔗 Connection Score</p>
                <p className="text-xs text-gray-300">
                  Your ideas are well-connected. 12 new neural pathways formed this week.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;