// 📁 src/components/ForgotPasswordModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMail, FiLoader } from "react-icons/fi";
import supabase from "../helper/supabaseClient";
import { toast } from "react-toastify";

export default function ForgotPasswordModal({ open, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Something went wrong!");
    } else {
      toast.success("📩 Password reset link sent! Check your email.");
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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={22} />
            </button>

            <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-2">
              Reset Password 🔑
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Enter your email to receive a password reset link
            </p>

            <form onSubmit={handleReset} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-90 transition-all"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <FiMail /> Send Reset Link
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-700 mt-5">
              Remember your password?{" "}
              <span
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              >
                Back to Login
              </span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
