import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogin, onSignup, onLogout }) {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold">
            PC
          </div>
          <h1 className="text-lg font-semibold">PitchCraft</h1>
        </div>

        <nav className="flex items-center gap-4">
          {!user ? (
            <>
              <button onClick={onLogin} className="bg-white/20 px-4 py-2 rounded-md">Login</button>
              <button onClick={onSignup} className="bg-white px-4 py-2 rounded-md text-indigo-600 font-semibold">
                Sign Up
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <button onClick={onLogout} className="bg-white/20 px-3 py-1 rounded-md">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
