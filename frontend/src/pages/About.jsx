import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";


function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-6 py-12">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
        About SecondBrain 🧠
      </h1>

      {/* Intro */}
      <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto text-center">
        <strong>SecondBrain</strong>  is your intelligent digital workspace — built to help you capture thoughts, organize ideas, and manage personal knowledge with ease. Designed for focus, speed, and simplicity, it's your second brain in the cloud — ready to evolve.
      </p>

      <div className="mt-12 max-w-5xl mx-auto space-y-10">
        {/* Features */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">🚀 Key Features</h2>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>🛡️ Secure authentication system using JWT</li>
            <li>🧠 Store notes, bookmarks, thoughts, and links in one place</li>
            <li>⚡ Real-time dynamic dashboard built with React & Framer Motion</li>
            <li>🌙 Fully responsive dark mode user interface</li>
            <li>🪄 Smooth transitions and animations for better UX</li>
            <li>📡 API integration between frontend and backend using Axios</li>
            <li>🗃️ Backend powered by Node.js, Express.js, MongoDB</li>
          </ul>
        </section>

        {/* About Developer */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">👨‍💻 About the Developer</h2>
          <p className="text-gray-300 leading-relaxed">
            Hey there! I'm <strong>Satyam Prajapati</strong>, a self-driven full-stack developer currently pursuing Computer Science.
            I enjoy building meaningful and scalable web applications that solve real-world problems.
            <br /><br />
            <strong>SecondBrain</strong> is one of my personal passion projects, crafted to combine productivity with elegant design.
            I believe in simplicity, speed, and user-first experiences.
          </p>
        </section>

        {/* Other Work */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">🧩 Other Projects</h2>
         
          <ul className="text-left list-disc list-inside space-y-2 text-gray-300">
  <li>
    <strong>VetCare:</strong> A complete online pet and animal consultation platform, offering virtual appointments, premium services, and a doctor dashboard — built for pet owners and veterinary professionals.
  </li>
  <li>
    <strong>DevTinder:</strong> A Tinder-like matchmaking platform tailored for developers to discover, connect, and collaborate based on skills and shared tech interests.
  </li>
  <li>
    <strong>BlogSpace:</strong> A minimalist platform to read, write, and explore technical and creative articles. Features markdown support and user-friendly publishing tools.
  </li>
  <li>
    ...and many more in progress — pushing the limits of creativity and functionality.
  </li>
</ul>
        </section>

        {/* Connect */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">🔗 Connect With Me</h2>
          <p className="text-gray-300 mb-2">I'd love to collaborate or help you with your projects! Feel free to connect:</p>
          <div className="flex flex-wrap gap-4 mt-3 text-lg">
            <a
              href="https://github.com/satyam0777"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:underline"
            >
              <FaGithub className="text-xl" /> <span>Github</span>
            </a>

            <a
              href="https://www.linkedin.com/in/satyam-prajapati-13a690256/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:underline"
            >
              <FaLinkedin className="text-xl" /> <span>LinkedIn</span>
            </a>

            <a
              href="https://x.com/Satyam9352"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:underline"
            >
              <span className="text-xl font-bold">𝕏</span> <span>Twitter</span>

            </a>
            <a
  href="mailto:officialsatyam0777@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center space-x-2 text-blue-400 hover:underline"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8.25l7.6 6.3c.26.22.61.22.87 0L20 8.25V18H4z" />
  </svg>
  <span>officialsatyam0777@gmail.com</span>
</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
