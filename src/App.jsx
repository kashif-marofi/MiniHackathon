import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CreatePitch from "./pages/CreatePitch";
import ProtectedRoute from "./pages/ProtectedRoute";
import AuthWrapper from "./components/AuthWrapper";
import "./index.css";

// ✅ Dashboard components
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";

// ✅ Templates pages
import TemplatesIndex from "./pages/TemplatesIndex";
import BusinessIdeas from "./pages/templates/BusinessIdeas";
import WebsiteDesign from "./pages/templates/WebsiteDesign";
import StartupIdeas from "./pages/templates/StartupIdeas";
import ChatWithAI from "./pages/templates/ChatWithAI"; // ✅ Corrected name
import PortfolioTemplates from "./pages/templates/PortfolioTemplates";

export default function App() {
  return (
    <>
      {/* 🔹 AuthWrapper only wraps public pages (so Navbar shows only on Home) */}
      <Routes>
        <Route
          path="/"
          element={
            <AuthWrapper>
              <Home />
            </AuthWrapper>
          }
        />

        {/* ✅ Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* 👇 Nested routes inside DashboardLayout */}
          <Route index element={<DashboardHome />} />
          <Route path="templates" element={<TemplatesIndex />} />
          <Route path="templates/business-ideas" element={<BusinessIdeas />} />
          <Route path="templates/website-design" element={<WebsiteDesign />} />
          <Route path="templates/startup-ideas" element={<StartupIdeas />} />
          <Route path="templates/chat-with-ai" element={<ChatWithAI />} /> {/* ✅ Corrected */}
          <Route path="templates/portfolio" element={<PortfolioTemplates />} />
        </Route>

        {/* ✅ Create Pitch remains separate */}
        <Route
          path="/create-pitch"
          element={
            <ProtectedRoute>
              <CreatePitch />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
