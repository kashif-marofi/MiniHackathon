import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Checking authentication...
      </div>
    );
  }

  // 🔒 if user is not logged in → redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
