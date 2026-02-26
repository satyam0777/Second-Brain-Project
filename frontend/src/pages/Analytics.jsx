import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { 
  TrendingUp, 
  BookOpen, 
  Bookmark as BookmarkIcon, 
  MessageSquare, 
  Star,
  Activity as ActivityIcon,
  Calendar,
  ArrowLeft,
  Brain,
  Target,
  Zap
} from "lucide-react";
import API from "../api/axios";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const navigate = useNavigate();

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  const fetchAnalytics = async (type = 'overview') => {
    setLoading(true);
    try {
      const [analyticsRes, statsRes] = await Promise.all([
        API.get(`/analytics?type=${type}`),
        API.get('/analytics/stats')
      ]);
      
      setData(analyticsRes.data || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(activeView);
  }, [activeView]);

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+{trend}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </motion.div>
  );

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-80">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-80">
          <Brain className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No data available yet</p>
          <p className="text-gray-500 text-sm mt-2">Start creating notes and bookmarks to see analytics</p>
        </div>
      );
    }

    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-slate-800 border border-white/10 rounded-lg p-3 shadow-xl">
            <p className="text-white font-semibold">{payload[0].payload.name}</p>
            <p className="text-blue-400">{payload[0].value} items</p>
          </div>
        );
      }
      return null;
    };

    switch (activeView) {
      case 'activity':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
                name="Activities"
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'tags':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'categories':
      case 'bookmarks':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  const getViewTitle = () => {
    const titles = {
      'overview': 'Overview Statistics',
      'categories': 'Notes by Tag',
      'bookmarks': 'Bookmarks by Tag',
      'activity': 'Activity Over Time (Last 7 Days)',
      'tags': 'Most Popular Tags'
    };
    return titles[activeView] || 'Analytics';
  };

  const getViewIcon = () => {
    const icons = {
      'overview': Target,
      'categories': BookOpen,
      'bookmarks': BookmarkIcon,
      'activity': TrendingUp,
      'tags': Star
    };
    const Icon = icons[activeView] || Target;
    return <Icon className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                SecondBrain Analytics
              </span>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">📊 Analytics Dashboard</h1>
          <p className="text-gray-400">
            Insights into your knowledge management and productivity
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={BookOpen}
              title="Total Notes"
              value={stats.totalNotes}
              color="bg-purple-500"
              trend={12}
            />
            <StatCard
              icon={BookmarkIcon}
              title="Total Bookmarks"
              value={stats.totalBookmarks}
              color="bg-blue-500"
              trend={8}
            />
            <StatCard
              icon={MessageSquare}
              title="Total Comments"
              value={stats.totalComments}
              color="bg-green-500"
              trend={25}
            />
            <StatCard
              icon={Star}
              title="Favorites"
              value={stats.totalFavorites}
              color="bg-yellow-500"
              trend={15}
            />
          </div>
        )}

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-2">
            {[
              { key: 'overview', label: 'Overview', icon: Target },
              { key: 'categories', label: 'Notes', icon: BookOpen },
              { key: 'bookmarks', label: 'Bookmarks', icon: BookmarkIcon },
              { key: 'activity', label: 'Activity', icon: ActivityIcon },
              { key: 'tags', label: 'Tags', icon: Star },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveView(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeView === tab.key
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Chart Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            {getViewIcon()}
            <h2 className="text-xl font-semibold">{getViewTitle()}</h2>
          </div>
          {renderChart()}
        </motion.div>

        {/* Data Summary */}
        {!loading && data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold">Total Items</h3>
              </div>
              <p className="text-3xl font-bold text-purple-400">{data.length}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold">Highest Value</h3>
              </div>
              <p className="text-3xl font-bold text-green-400">
                {Math.max(...data.map(d => d.value))}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Average</h3>
              </div>
              <p className="text-3xl font-bold text-blue-400">
                {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)}
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
