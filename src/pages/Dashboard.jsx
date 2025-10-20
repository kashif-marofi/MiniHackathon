import React, { useState, useEffect } from "react";
import { FiSearch, FiLogOut, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import supabase from "../helper/supabaseClient";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [pitches, setPitches] = useState([]);
  const [user, setUser] = useState(null);

  // ✅ Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        toast.error("Please log in first");
        navigate("/");
        return;
      }
      setUser(data.user);
    };
    fetchUser();
  }, [navigate]);

  // ✅ Fetch user pitches
  useEffect(() => {
    if (user) loadPitches();
  }, [user]);

  const loadPitches = async () => {
    const { data, error } = await supabase
      .from("pitches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to fetch pitches.");
      return;
    }

    setPitches(data);
  };

  const filteredPitches = pitches.filter((pitch) =>
    pitch.title.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info("Logging out...", { position: "top-center", autoClose: 1000 });
    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 shadow-md flex flex-col justify-between">
        <div className="p-5">
          <h2 className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text mb-6">
            Your Pitches
          </h2>

          <div className="space-y-2 overflow-y-auto max-h-[65vh] pr-1">
            {filteredPitches.length > 0 ? (
              filteredPitches.map((pitch) => (
                <div
                  key={pitch.id}
                  className="group p-3 rounded-lg bg-gray-100/70 hover:bg-gradient-to-r from-indigo-600 to-pink-500 hover:text-white cursor-pointer transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                  onClick={() => navigate("/create-pitch", { state: { pitchId: pitch.id } })}
                >
                  <FiFileText size={16} />
                  <p className="font-medium">{pitch.title}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No pitches found</p>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-2 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text mb-8">
            PitchCraft Dashboard
          </h1>

          {/* Search Bar */}
          <div className="flex items-center bg-white/90 rounded-lg shadow-md p-3 mb-8 border border-gray-100 focus-within:ring-2 focus-within:ring-indigo-400">
            <FiSearch className="text-gray-500 mr-2" size={20} />
            <input
              type="text"
              placeholder="Search your pitches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Empty State */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-10 min-h-[60vh] flex flex-col items-center justify-center text-gray-500 text-center">
            <p className="text-lg mb-4">
              ✨ Start creating your next amazing pitch idea.
            </p>
            <button
              onClick={() => navigate("/create-pitch")}
              className="mt-4 bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-6 py-3 rounded-full shadow-md font-semibold hover:opacity-90 transition-all"
            >
              + Create New Pitch
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
