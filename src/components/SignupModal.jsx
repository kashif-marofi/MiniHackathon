import React, { useState } from "react";
import supabase from "../helper/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export default function SignupModal({ open, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { userName } },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } else {
      Swal.fire({
        title: "🎉 Account Created!",
        text: "Check your email for verification link.",
        icon: "success",
        confirmButtonColor: "#6366f1",
        background: "#fff",
      });
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <form
        onSubmit={handleSignup}
        className="relative bg-white/90 dark:bg-gray-900/80 p-8 rounded-2xl shadow-2xl w-96 border border-white/30"
      >
        {/* Gradient Accent Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-pink-500 to-purple-600 opacity-20 blur-2xl -z-10"></div>

        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          Create Your Account
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 w-full p-3 rounded-lg outline-none transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 w-full p-3 rounded-lg outline-none transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 w-full p-3 rounded-lg outline-none transition"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition-all text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-pink-300/50 disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-700">
          Already have an account?{" "}
          <span
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="text-indigo-600 hover:text-pink-500 font-medium cursor-pointer transition"
          >
            Login
          </span>
        </p>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
