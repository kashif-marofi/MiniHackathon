import React from "react";
import FeatureCard from "../components/FeatureCard";
import { motion } from "framer-motion";

export default function Home({ onLogin, onSignup, user }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-6">
      <section className="max-w-3xl text-center backdrop-blur-md bg-white/60 shadow-xl rounded-3xl p-10 border border-white/30">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 mb-5"
        >
          Build Startup Pitches Instantly 🚀
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-gray-700 text-lg md:text-xl mb-8"
        >
          AI-powered assistant to help you create pitch decks, landing copy, and startup ideas in seconds — designed for founders & hackathons.
        </motion.p>

        {!user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
            className="flex justify-center gap-4 flex-wrap"
          >
            <button
              onClick={onLogin}
              className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              Login
            </button>
            <button
              onClick={onSignup}
              className="border-2 border-indigo-500 text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 hover:scale-105 transition-transform duration-300"
            >
              Sign Up
            </button>
          </motion.div>
        )}
      </section>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
      >
        <FeatureCard
          title="Generate Pitches"
          desc="AI drafts investor-ready pitches and taglines instantly."
          icon="💡"
        />
        <FeatureCard
          title="Save Progress"
          desc="Persist your drafts to your account and access them anytime."
          icon="💾"
        />
        <FeatureCard
          title="Preview Landing"
          desc="Get HTML snippets & a quick landing preview for your idea."
          icon="🌐"
        />
      </motion.div>
    </main>
  );
}
