import React, { useState, useEffect } from "react";
import supabase from "../helper/supabaseClient";
import Navbar from "./Navbar";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🧩 Check user session when app loads
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    fetchUser();

    // 🔄 Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🚪 Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  // 🔍 Show Navbar only on non-dashboard routes
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && (
        <Navbar
          user={user}
          onLogin={() => setShowLogin(true)}
          onSignup={() => setShowSignup(true)}
          onLogout={handleLogout}
        />
      )}

      {/* 🔐 Auth Modals */}
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />

      <SignupModal
        open={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />

      {/* Render child pages */}
      <main>{children}</main>
    </>
  );
}
