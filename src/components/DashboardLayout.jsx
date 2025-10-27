// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import supabase from "../helper/supabaseClient";
import { FiMenu, FiSearch } from "react-icons/fi";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // close sidebar on route change (mobile)
    setSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800">
      {/* Sidebar (mobile slide + desktop hidden from this component) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />

      <div className="flex-1 flex flex-col">
        {/* Top Navbar for medium+ screens */}
        <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white/80 border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold">
                PC
              </div>
              <h1 className="text-lg font-semibold">PitchCraft</h1>
            </Link>

            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2">
              <FiSearch />
              <input
                className="bg-transparent outline-none text-sm w-64"
                placeholder="Search projects, templates..."
                // optional: wire this to state if you want global search
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-4">
              <Link to="/dashboard" className="hover:underline">Home</Link>
              <Link to="/dashboard/templates" className="hover:underline">Templates</Link>
            </nav>

            {/* user avatar */}
            <div className="flex items-center gap-3">
              <img
                src={user?.user_metadata?.avatar_url || `https://i.pravatar.cc/40?u=${user?.id}`}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />
            </div>

            {/* mobile menu button visible on md- */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen((s) => !s)}
            >
              <FiMenu size={20} />
            </button>
          </div>
        </header>

        {/* Top compact bar for mobile (hamburger + title) */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md">
              <FiMenu size={20} />
            </button>
            <div className="text-lg font-semibold">PitchCraft</div>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={user?.user_metadata?.avatar_url || `https://i.pravatar.cc/40?u=${user?.id}`}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          </div>
        </div>

        {/* Main content area where pages render */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
