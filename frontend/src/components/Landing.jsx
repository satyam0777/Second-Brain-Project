
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../api/auth";
import { setAuthToken } from "../api/axios";

function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
   const navigate = useNavigate(); // Navigation hook

   useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

 //  THIS IS WHAT YOU NEED
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

// const url = isLogin ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";

const url = isLogin
  ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`
  : `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`;



  const payload = isLogin
    ? { email: form.email, password: form.password }
    : { name: form.name, email: form.email, password: form.password };

  console.log("Sending to backend:", payload);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Backend error:", data);
      throw new Error(data.message || "Authentication failed");
    }

    localStorage.setItem("token", data.token);
     // ✅ Set token to Axios
    setAuthToken(data.token);
    setShowAuthModal(false);
    setForm({ name: "", email: "", password: "" });
    navigate("/dashboard");
  } catch (err) {
    alert(err.message || "Something went wrong!");
  } finally {
    setIsLoading(false);
  }
};



  // Neural network nodes data
  const nodes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
  }));

  // Floating brain concepts
  const brainConcepts = [
    { text: "Ideas", icon: "💡", delay: 0 },
    { text: "Notes", icon: "📝", delay: 1 },
    { text: "Links", icon: "🔗", delay: 2 },
    { text: "Thoughts", icon: "💭", delay: 3 },
    { text: "Memory", icon: "🧠", delay: 4 },
    { text: "Knowledge", icon: "📚", delay: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-gray-900 dark:to-black text-white relative overflow-hidden transition-colors duration-500">
      {/* Animated Neural Network Background */}
      <div className="absolute inset-0 -z-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Connections */}
          {nodes.map((node, i) => 
            nodes.slice(i + 1).map((otherNode, j) => {
              const distance = Math.sqrt((node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2);
              if (distance < 15) {
                return (
                  <motion.line
                    key={`${i}-${j}`}
                    x1={node.x}
                    y1={node.y}
                    x2={otherNode.x}
                    y2={otherNode.y}
                    stroke="url(#gradient)"
                    strokeWidth="0.1"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: node.delay }}
                  />
                );
              }
              return null;
            })
          )}
          
          {/* Nodes */}
          {nodes.map((node) => (
            <motion.circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.size / 10}
              fill="url(#nodeGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 3,
                delay: node.delay,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id="nodeGradient">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Brain Concepts */}
      <div className="absolute inset-0 -z-5 pointer-events-none">
        {brainConcepts.map((concept, i) => (
          <motion.div
            key={concept.text}
            className="absolute flex items-center space-x-2 text-white/60 text-sm font-medium"
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${20 + (i % 2) * 60}%`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [20, -20, 20],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 8,
              delay: concept.delay,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <span className="text-2xl">{concept.icon}</span>
            <span>{concept.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Particle System */}
      <div className="absolute inset-0 -z-8 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              delay: Math.random() * 5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        ))}
      </div>

      {/* Dark Mode Toggle */}
      <div className="absolute top-5 right-5 z-50">
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full shadow-lg hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? "☀️" : "🌙"}
        </motion.button>
      </div>

      {/* Hero Section */}
      {/* <motion.section className="h-screen flex flex-col justify-center items-center text-center px-4 relative z-10"> */}
      <motion.section className="min-h-screen pt-20 flex flex-col justify-center items-center text-center px-4 relative z-10">
        {/* Brain Icon Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            🧠
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"
           

          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.span
            animate={{ 
              backgroundPosition: ['0%', '100%'],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_200%]"
          >
            SecondBrain
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-xl max-w-3xl mb-8 text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Your AI-powered digital mind palace. Store, organize, and connect your ideas, thoughts, and knowledge in a beautiful neural network of information.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <motion.button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg font-semibold text-lg"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{ 
                backgroundPosition: ['0%', '100%'],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent bg-[length:200%_200%]"
            >
              Start Your Journey
            </motion.span>
          </motion.button>
          
          {/* <motion.button
            className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-full font-semibold text-lg hover:bg-purple-400 hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button> */}
          <motion.button
  onClick={() => navigate("/about")} 
  className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-full font-semibold text-lg hover:bg-purple-400 hover:text-white transition-all"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Learn More
</motion.button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Instant search and retrieval" },
            { icon: "🔗", title: "Smart Connections", desc: "AI-powered linking system" },
            { icon: "🎨", title: "Beautiful Interface", desc: "Intuitive and delightful UX" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + i * 0.1 }}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
              
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-4xl mb-4">🧠</div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  {isLogin ? "Welcome Back" : "Join SecondBrain"}
                </h2>
                <p className="text-gray-400 mt-2">
                  {isLogin ? "Enter your digital mind palace" : "Create your neural network"}
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </motion.div>
                )}
                
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange} 
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
                
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
                
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Processing...
                    </div>
                  ) : (
                    isLogin ? "Enter SecondBrain" : "Create Account"
                  )}
                </motion.button>
              </form>
              
              <p className="mt-6 text-sm text-center text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Landing;

