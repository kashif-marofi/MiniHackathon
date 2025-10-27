// src/components/PitchCard.jsx
import React from "react";

export default function PitchCard({ pitch, onView }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-gray-400">{new Date(pitch.created_at).toLocaleDateString()}</div>
          <h3 className="text-lg font-semibold mt-1">{pitch.title}</h3>
          <div className="text-sm text-gray-600 mt-2 line-clamp-3">
            {pitch.content?.slice(0, 180) || "No description"}
          </div>
        </div>

        <div className="text-sm text-indigo-600 font-semibold">{pitch.category || "General"}</div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => onView(pitch)} className="text-sm px-3 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100">View</button>
          <button className="text-sm px-3 py-1 rounded-md border">Edit</button>
        </div>
        <div className="text-sm text-gray-500">ID: {pitch.id}</div>
      </div>
    </div>
  );
}
