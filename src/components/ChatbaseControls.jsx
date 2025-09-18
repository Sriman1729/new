// src/components/ChatbaseControls.jsx
import React, { useEffect } from "react";

export default function ChatbaseControls() {
  useEffect(() => {
    // create and inject the script
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "l5nRL-tkRCH-xVFi1Tz4r"; // 🔹 use your Chatbase script ID here
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);

    // optional auto-open after load
    const openTimer = setTimeout(() => {
      if (window.chatbase) {
        window.chatbase("open");
      }
    }, 1500);

    return () => {
      // cleanup when leaving the page
      clearTimeout(openTimer);
      script.remove();
      const iframe = document.querySelector("iframe[src*='chatbase']");
      if (iframe) iframe.remove();
    };
  }, []);

  const toggleChat = () => {
    if (window.chatbase) {
      window.chatbase("toggle");
    }
  };

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-700"
    >
      💬 Chat
    </button>
  );
}
