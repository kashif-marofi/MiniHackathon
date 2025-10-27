import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiLayers,
  FiChevronDown,
  FiLogOut,
  FiCpu,
  FiSend,
  FiGlobe,
  FiBriefcase,
  FiUser,
} from "react-icons/fi";

import supabase from "../helper/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ open = false, onClose = () => {}, user }) {
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const submenuItems = [
    {
      path: "business-ideas",
      label: "Business Ideas",
      icon: <FiBriefcase className="text-indigo-500" />,
      emoji: "💼",
    },
    {
      path: "website-design",
      label: "Website Design",
      icon: <FiGlobe className="text-blue-500" />,
      emoji: "🌐",
    },
    {
      path: "startup-ideas",
      label: "Startup Ideas",
      icon: <FiSend className="text-pink-500" />,
      emoji: "🚀",
    },
    {
      path: "chat-with-ai",
      label: "Chat with AI",
      icon: <FiCpu className="text-purple-500" />,
      emoji: "🤖",
    },
    {
      path: "portfolio",
      label: "Portfolio",
      icon: <FiUser className="text-green-500" />,
      emoji: "🧩",
    },
  ];

  return (
    <>
      {/* 🖥️ Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-72 bg-white/90 backdrop-blur-sm border-r border-gray-200 p-4 shadow-md">
        {/* Logo + Title */}
        <div className="mb-6 flex items-center gap-3 px-1">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            PC
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">PitchCraft</h3>
            <p className="text-sm text-gray-500">Create & Manage Pitches</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 transition-all font-medium"
          >
            <FiHome className="text-indigo-500" /> <span>Dashboard Home</span>
          </Link>

          {/* Templates Section */}
          <div>
            <button
              onClick={() => setTemplatesOpen(!templatesOpen)}
              className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition font-medium
              ${
                templatesOpen
                  ? "bg-gradient-to-r from-indigo-50 to-pink-50 text-indigo-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <FiLayers className="text-pink-500" />
                <span>Templates</span>
              </div>
              <FiChevronDown
                className={`transform transition-transform duration-300 ${
                  templatesOpen ? "rotate-180 text-indigo-500" : ""
                }`}
              />
            </button>

            {/* Animated Dropdown */}
            <AnimatePresence>
              {templatesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-5 mt-2 flex flex-col gap-2 border-l-2 border-indigo-200 pl-3"
                >
                  {submenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={`/dashboard/templates/${item.path}`}
                      className="flex items-center gap-3 p-2.5 rounded-md text-sm text-gray-700 font-medium hover:bg-gradient-to-r hover:from-indigo-100 hover:to-pink-100 hover:translate-x-1 transition-all duration-200"
                    >
                      {item.icon}
                      <span>
                        {item.emoji} {item.label}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Footer / User Info */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={
                user?.user_metadata?.avatar_url ||
                `https://i.pravatar.cc/40?u=${user?.id}`
              }
              alt="avatar"
              className="w-11 h-11 rounded-full object-cover border"
            />
            <div>
              <div className="font-semibold text-gray-800">
                {user?.user_metadata?.userName || user?.email?.split("@")[0]}
              </div>
              <div className="text-sm text-gray-500">Pro Member</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-600 text-white justify-center hover:opacity-90 transition font-medium shadow-sm"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* 📱 Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 p-4 border-r border-gray-200 shadow-xl md:hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold">
                  PC
                </div>
                <div>
                  <h3 className="font-bold">PitchCraft</h3>
                  <p className="text-xs text-gray-500">Manage your ideas</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex flex-col gap-2">
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 transition"
              >
                <FiHome className="text-indigo-500" /> Home
              </Link>

              {/* Mobile Dropdown */}
              <div>
                <button
                  onClick={() => setTemplatesOpen(!templatesOpen)}
                  className="w-full flex items-center justify-between gap-3 p-3 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <FiLayers className="text-pink-500" /> Templates
                  </div>
                  <FiChevronDown
                    className={`transform transition-transform ${
                      templatesOpen ? "rotate-180 text-indigo-500" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {templatesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-6 mt-2 flex flex-col gap-2 border-l-2 border-indigo-200 pl-3"
                    >
                      {submenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={`/dashboard/templates/${item.path}`}
                          onClick={onClose}
                          className="flex items-center gap-3 text-sm p-2.5 rounded-md text-gray-700 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-pink-100 hover:translate-x-1 transition-all duration-200"
                        >
                          {item.icon}
                          <span>
                            {item.emoji} {item.label}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={
                    user?.user_metadata?.avatar_url ||
                    `https://i.pravatar.cc/40?u=${user?.id}`
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <div className="font-medium">
                    {user?.user_metadata?.userName || user?.email?.split("@")[0]}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-600 text-white justify-center hover:opacity-90 transition font-medium shadow-sm"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
