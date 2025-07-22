// // import React from "react";

// // const Analytics = () => {
// //   return (
// //     <div className="min-h-screen bg-slate-900 text-white p-10">
// //       <h1 className="text-2xl font-bold mb-6">📊 Analytics</h1>
// //       <p className="text-gray-400">Coming soon! You can use chart libraries like Chart.js or Recharts.</p>
// //     </div>
// //   );
// // };

// // export default Analytics;



import React, { useEffect, useState } from "react";
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
} from "recharts";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [error, setError] = useState(null);

  // Colors for different chart types
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  const fetchAnalytics = async (type = 'overview') => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual backend URL
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/analytics?type=${type}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      
      if (Array.isArray(result)) {
        setData(result);
      } else {
        console.error("Data is not an array:", result);
        setData([]);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(activeView);
  }, [activeView]);

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          {/* <p className="text-red-400 mb-4">Error: {error}</p> */}
          <p className="text-red-400 mb-4">Comming Soon.....</p>
          <button 
            onClick={() => fetchAnalytics(activeView)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            UnderWork
          </button>
        </div>
      );
    }

    if (data.length === 0) {
      return <p className="text-gray-400 text-center py-8">No data available</p>;
    }

    switch (activeView) {
      case 'activity':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'tags':
        return (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} layout="horizontal">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
        
      default:
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'categories': return '📂 Notes by Category';
      case 'bookmarks': return '🔖 Bookmarks by Category';
      case 'activity': return '📈 Activity Over Time';
      case 'tags': return '🏷️ Popular Tags';
      case 'overview': return '📊 Overview Statistics';
      default: return '📊 Analytics';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📊 Analytics Dashboard</h1>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-800 p-2 rounded-lg">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'categories', label: 'Notes Categories' },
            { key: 'bookmarks', label: 'Bookmarks' },
            { key: 'activity', label: 'Activity' },
            { key: 'tags', label: 'Tags' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeView === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chart Container */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">{getViewTitle()}</h2>
          {renderChart()}
        </div>

        {/* Quick Stats */}
        {activeView === 'overview' && !loading && data.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {data.map((stat, index) => (
              <div key={stat.name} className="bg-slate-800 rounded-lg p-6 text-center">
                <div 
                  className="text-3xl font-bold mb-2"
                  style={{ color: colors[index % colors.length] }}
                >
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.name}</div>
              </div>
            ))}
          </div>
        )}

        {/* Data Summary */}
        {!loading && data.length > 0 && (
          <div className="mt-8 bg-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Data Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
              <div>Total Items: {data.length}</div>
              <div>
                Max Value: {Math.max(...data.map(d => d.value))}
              </div>
              <div>
                Average: {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;