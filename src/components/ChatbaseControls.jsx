// src/components/ChatbaseControls.jsx
import { useEffect, useState } from "react";
import { FiMessageCircle, FiX, FiRefreshCcw } from "react-icons/fi"; // icons

export default function ChatbaseControls() {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Wait until Chatbase script finishes loading
  useEffect(() => {
    const check = setInterval(() => {
      if (window.chatbase && typeof window.chatbase === "function") {
        setReady(true);
        clearInterval(check);
      }
    }, 500);

    return () => clearInterval(check);
  }, []);

  const openBot = () => ready && window.chatbase("open");
  const closeBot = () => ready && window.chatbase("close");
  const toggleBot = () => ready && window.chatbase("toggle");

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 9999,
      }}
    >
      {/* Main Floating Button */}
      <button
        onClick={() => setMenuOpen((o) => !o)}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "14px",
          borderRadius: "50%",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          cursor: "pointer",
        }}
        title="Chatbot Controls"
      >
        <FiMessageCircle size={20} />
      </button>

      {/* Menu Buttons */}
      {menuOpen && (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onClick={openBot}
            style={{
              background: "#16a34a",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            title="Open Chat"
          >
            <FiMessageCircle size={18} />
          </button>

          <button
            onClick={closeBot}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            title="Close Chat"
          >
            <FiX size={18} />
          </button>

          <button
            onClick={toggleBot}
            style={{
              background: "#f59e0b",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            title="Toggle Chat"
          >
            <FiRefreshCcw size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
