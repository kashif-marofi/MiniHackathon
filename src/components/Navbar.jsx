import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogin, onSignup, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const linkClass = (path) =>
    location.pathname === path ? "underline font-semibold" : "hover:underline";

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold">
            PC
          </div>
          <h1 className="text-lg font-semibold tracking-wide">PitchCraft</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={onLogin}
                className="bg-white/20 px-4 py-2 rounded-md hover:bg-white/30 transition"
              >
                Login
              </button>
              <button
                onClick={onSignup}
                className="bg-white px-4 py-2 rounded-md text-indigo-600 font-semibold hover:bg-gray-100 transition"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <button
                onClick={onLogout}
                className="bg-white/20 px-3 py-1 rounded-md hover:bg-white/30 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col gap-1 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`block h-1 w-6 rounded bg-white transition-transform duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-1 w-6 rounded bg-white transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-1 w-6 rounded bg-white transition-transform duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-700/90 backdrop-blur-sm flex flex-col items-center gap-3 py-4 transition-all duration-300">
          {!user ? (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogin();
                }}
                className="bg-white/20 px-4 py-2 rounded-md w-32 hover:bg-white/30 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onSignup();
                }}
                className="bg-white px-4 py-2 rounded-md text-indigo-600 font-semibold w-32 hover:bg-gray-100 transition"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="hover:underline"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                className="bg-white/20 px-3 py-1 rounded-md hover:bg-white/30 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
