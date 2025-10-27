// src/pages/DashboardHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import { FiFileText, FiPlus, FiLoader } from "react-icons/fi";

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPitches = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pitches")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setPitches(data || []);
      setLoading(false);
    };

    if (user?.id) fetchPitches();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-gray-600">
          {user?.email || "Your saved startup pitches are below."}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <Link
          to="/create-pitch"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
        >
          <FiPlus /> Create New Pitch
        </Link>
        <Link
          to="/dashboard/templates"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          <FiFileText /> Explore Templates
        </Link>
      </div>

      {/* My Pitches Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Your Saved Pitches</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <FiLoader className="animate-spin" /> Loading your projects...
          </div>
        ) : pitches.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pitches.map((pitch) => (
              <Link
                to={`/dashboard/pitch/${pitch.id}`}
                key={pitch.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{pitch.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {pitch.description || "No description added."}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(pitch.created_at).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't created any pitches yet.</p>
        )}
      </div>
    </div>
  );
}
