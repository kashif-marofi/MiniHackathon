import React from "react";
import { motion } from "framer-motion";

export default function FeatureCard({ title, desc, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-6 flex flex-col items-start"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold mb-4">
        {icon || title.charAt(0)}
      </div>
      <h3 className="text-lg font-semibold text-indigo-700 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}
