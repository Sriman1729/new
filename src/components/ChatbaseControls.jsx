// src/components/ChatbaseControls.jsx
import { useEffect, useState } from "react";
import { FiMessageCircle } from "react-icons/fi"; // npm install react-icons

export default function ChatbaseControls() {
  const [ready, setReady] = useState(false);

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

  const toggleBot = () => ready && window.chatbase("toggle");

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px", // ⬅️ Move to right corner if you prefer: right: "20px"
        zIndex: 9999,
      }}
    >
      <button
        onClick={toggleBot}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "16px",
          borderRadius: "50%",
          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
        title="Chat with us"
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <FiMessageCircle size={22} />
      </button>
    </div>
  );
}
