// src/components/ChatbaseControls.jsx
import { useEffect, useState } from "react";

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
        display: "flex",
        gap: "8px",
      }}
    >
      <button
        onClick={openBot}
        style={{
          background: "#16a34a",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
        }}
      >
        Open Chat
      </button>
      <button
        onClick={closeBot}
        style={{
          background: "#dc2626",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
        }}
      >
        Close
      </button>
      <button
        onClick={toggleBot}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
        }}
      >
        Toggle
      </button>
    </div>
  );
}
