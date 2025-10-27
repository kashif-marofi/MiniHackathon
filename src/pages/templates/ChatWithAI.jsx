import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiRotateCw,
  FiDownload,
  FiHome,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const GEMINI_API_KEY = "AIzaSyATspIz1woiIjZDJ3L4Pih5sEmiXFNR-qo";

export default function ChatWithAI() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("pitchcraft_chat");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Scroll to bottom when new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ✅ Save chat in localStorage
  useEffect(() => {
    localStorage.setItem("pitchcraft_chat", JSON.stringify(messages));
  }, [messages]);

  // ✅ Gemini AI Response
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

      setMessages((prev) => [...prev, { sender: "bot", text: aiText }]);
      toast.success("✨ Gemini replied!");
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error connecting to Gemini API." },
      ]);
      toast.error("Failed to fetch AI response.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Send message
  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setLastPrompt(input);
    setInput("");
    setLoading(true);
    await generateAIResponse(input);
  }

  // ♻️ Regenerate
  async function regenerateResponse() {
    if (!lastPrompt) {
      toast.warn("⚠️ No previous prompt found.");
      return;
    }
    toast.info("🔁 Regenerating response...");
    setLoading(true);

    setMessages((prev) => {
      const newMsgs = [...prev];
      if (newMsgs[newMsgs.length - 1]?.sender === "bot") newMsgs.pop();
      return newMsgs;
    });

    await generateAIResponse(lastPrompt);
  }

  // 📄 Download PDF
  function downloadPDF() {
    if (!messages.length) {
      toast.warn("⚠️ No messages to download!");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.text("PitchCraft AI Chat History", pageWidth / 2, 15, {
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
    });

    doc.save("PitchCraft_Conversation.pdf");
    toast.success("📄 PDF Downloaded!");
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* ✅ Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text mb-8">
          PitchCraft
        </h2>

        <nav className="flex flex-col gap-4 text-gray-700">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 hover:text-indigo-600 transition-all"
          >
            <FiHome /> Dashboard
          </button>

          <button
            onClick={() => toast.info("Chat history coming soon!")}
            className="flex items-center gap-3 hover:text-indigo-600 transition-all"
          >
            💬 Chat History
          </button>
        </nav>

        <button
          onClick={() => navigate("/")}
          className="mt-auto flex items-center gap-3 text-red-500 hover:text-red-600 transition-all"
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* ✅ Main Chat Section */}
      <main className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm flex justify-center items-center px-6 py-4 z-10">
          <h2 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text">
            Chat With AI 💬
          </h2>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent">
          {messages.length === 0 ? (
            <p className="text-center text-gray-400 mt-20">
              💬 Start chatting with PitchCraft AI...
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
                  className={`max-w-xs md:max-w-md p-4 rounded-2xl shadow ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-br-none"
                      : "bg-white/90 text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-center mt-4">
              <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 border-t border-gray-200 bg-white/90 py-3">
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
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-3 bg-white border-t border-gray-200 p-4"
        >
          <input
            type="text"
            placeholder="Type your message..."
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
      </main>
    </div>
  );
}