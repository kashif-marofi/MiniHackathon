import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../helper/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { FiUserPlus, FiLoader, FiX } from "react-icons/fi";

export default function SignupModal({ open, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { userName } },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Signup failed", {
        position: "top-right",
      });
    } else {
      Swal.fire({
        title: "🎉 Account Created!",
        text: "Please check your email to verify your account.",
        icon: "success",
        confirmButtonColor: "#6366f1",
        background: "#fff",
      });
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.form
            onSubmit={handleSignup}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={22} />
            </button>

            {/* Header */}
            <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-2">
              Create Account ✨
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Start crafting your dream startup pitches today!
            </p>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Username</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white/80"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white/80"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white/80"
                  required
                />
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-90 transition-all mt-6"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Creating Account...
                </>
              ) : (
                <>
                  <FiUserPlus /> Sign Up
                </>
              )}
            </button>

            {/* Switch to Login */}
            <p className="text-center text-sm text-gray-700 mt-5">
              Already have an account?{" "}
              <span
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

            <ToastContainer />
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
