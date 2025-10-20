import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiArrowLeft, FiRotateCw, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const GEMINI_API_KEY = "AIzaSyATspIz1woiIjZDJ3L4Pih5sEmiXFNR-qo";

export default function CreatePitch() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Fetch logged-in user
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

  // Load chat history
  useEffect(() => {
    if (user) loadChatHistory();
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function loadChatHistory() {
    const { data, error } = await supabase
      .from("conversations_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (!error && data) setMessages(data);
  }

  async function saveMessage(sender, text) {
    await supabase.from("conversations_history").insert([
      {
        user_id: user.id,
        sender,
        text,
      },
    ]);
  }

  async function generateAIResponse(prompt) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No response from Gemini.";

      const botMessage = { sender: "bot", text: aiText };
      setMessages((prev) => [...prev, botMessage]);
      await saveMessage("bot", aiText);
      toast.success("✨ Gemini replied!");
    } catch (err) {
      console.error(err);
      const errorMsg = "❌ Error connecting to Gemini API.";
      setMessages((prev) => [...prev, { sender: "bot", text: errorMsg }]);
      await saveMessage("bot", errorMsg);
      toast.error("Failed to fetch AI response.");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLastPrompt(input);
    setInput("");
    setLoading(true);
    await saveMessage("user", input);
    generateAIResponse(input);
  }

  async function regenerateResponse() {
    if (!lastPrompt) {
      toast.warn("⚠️ No previous prompt found.");
      return;
    }
    toast.info("🔁 Regenerating response...");
    setLoading(true);

    setMessages((prev) => {
      const newMessages = [...prev];
      if (
        newMessages.length &&
        newMessages[newMessages.length - 1].sender === "bot"
      ) {
        newMessages.pop();
      }
      return newMessages;
    });

    await generateAIResponse(lastPrompt);
  }

  function downloadPDF() {
    if (!messages.length) {
      toast.warn("⚠️ No messages to download!");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.text("PitchCraft AI Conversation", pageWidth / 2, 15, {
      align: "center",
    });

    const rows = messages.map((m) => [
      m.sender === "user" ? "👤 You" : "🤖 Gemini",
      m.text,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [["Sender", "Message"]],
      body: rows,
      styles: { fontSize: 11, cellPadding: 4, overflow: "linebreak" },
      columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: pageWidth - 40 } },
      headStyles: { fillColor: [63, 81, 181], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => {
        const page = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(
          `Page ${page}`,
          pageWidth - 20,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    doc.save("PitchCraft_Conversation.pdf");
    toast.success("📄 PDF Downloaded!");
  }

  // ✅ Startup Pitch Assistant Button
  async function generateStartupPitch() {
    const startupPrompt = `
You are a startup pitch assistant.
Task: Generate a startup name, tagline, pitch, target audience, landing page content, brand colors, and logo concept.

For Landing Page Content, structure it EXACTLY like this:
Hero Section: [compelling headline and subheadline]
Problem Statement: [the problem your startup solves]
Solution: [how your product/service solves it]
Key Features:
- [feature 1]
- [feature 2]
- [feature 3]
Call to Action: [strong CTA]

Brand Colors: [Provide 5 hex color codes separated by commas]
Logo Concept: [Describe a simple logo idea]

Format your response EXACTLY in this structure:

Startup Name: [name]
Tagline: [tagline]
Pitch: [2-3 sentence elevator pitch]
Target Audience: [describe ideal customers]
Landing Page Content:
Hero Section: [content]
Problem Statement: [content]
Solution: [content]
Key Features:
- [feature 1]
- [feature 2]
- [feature 3]
Call to Action: [content]
Brand Colors: [#hex1, #hex2, #hex3, #hex4, #hex5]
Logo Concept: [description]
`;

    setInput(startupPrompt);
    setLoading(true);
    setLastPrompt(startupPrompt);
    await generateAIResponse(startupPrompt);
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 w-full bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm flex justify-between items-center px-6 py-4 z-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-700 font-medium hover:text-indigo-600 transition-all"
        >
          <FiArrowLeft /> Back
        </button>
        <h2 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text">
          PitchCraft AI 💡
        </h2>
        <div></div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 w-full flex justify-center px-4 md:px-10 py-6">
        <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 mt-20">
                💬 Start your first pitch below!
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md p-3 md:p-4 rounded-2xl shadow ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-center items-center mt-4">
                <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 border-t border-gray-200 bg-white py-3">
            <button
              onClick={regenerateResponse}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow hover:opacity-90 transition-all"
            >
              <FiRotateCw /> Regenerate
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow hover:opacity-90 transition-all"
            >
              <FiDownload /> Download PDF
            </button>
            <button
              onClick={generateStartupPitch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl shadow hover:opacity-90 transition-all"
            >
              💡 Generate Startup Pitch
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-3 bg-white border-t border-gray-200 p-4"
          >
            <input
              type="text"
              placeholder="Type your idea..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white p-3 rounded-xl shadow-md hover:opacity-90 transition-all"
            >
              <FiSend size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
