import React, { useEffect, useState } from "react";

export default function ChatbaseControls() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Don’t add script if already present
    if (!document.getElementById("chatbase-script")) {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "chatbase-script"; // unique id to avoid duplicates
      script.domain = "www.chatbase.co";
      script.onload = () => {
        // mark ready after small delay to allow initialization
        setTimeout(() => setReady(true), 500);
      };
      document.body.appendChild(script);
    } else {
      // script already present, just wait a bit
      setTimeout(() => setReady(true), 500);
    }

    return () => {
      // Clean up iframe but keep script for faster reload
      const iframe = document.querySelector("iframe[src*='chatbase']");
      if (iframe) iframe.remove();
    };
  }, []);

  const toggleChat = () => {
    if (window.chatbase && ready) {
      window.chatbase("toggle");
    }
  };

  return (
    <button
      onClick={toggleChat}
      disabled={!ready}
      className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-700 disabled:opacity-50"
    >
      💬 Chat
    </button>
  );
}
