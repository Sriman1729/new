// src/components/ChatbaseControls.jsx
import React, { useEffect, useState } from "react";

export default function ChatbaseControls() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // if the script is already there, skip adding again
    let script = document.getElementById("chatbase-script");
    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "chatbase-script"; // unique ID
      script.domain = "www.chatbase.co";
      script.onload = () => {
        // give Chatbase a moment to initialize
        setTimeout(() => {
          setReady(true);
          // open automatically once ready (optional)
          // window.chatbase && window.chatbase("open");
        }, 800);
      };
      document.body.appendChild(script);
    } else {
      // already loaded; wait a bit then mark ready
      setTimeout(() => setReady(true), 800);
    }

    // cleanup on unmount: close + remove iframe
    return () => {
      if (window.chatbase) {
        // force close the chat
        window.chatbase("close");
      }
      const iframe = document.querySelector("iframe[src*='chatbase']");
      if (iframe) iframe.remove();
    };
  }, []);

  const toggleChat = () => {
    if (window.chatbase && ready) {
      window.chatbase("toggle");
    }
  };

  const closeChat = () => {
    if (window.chatbase && ready) {
      window.chatbase("close");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end gap-2">
      <button
        onClick={toggleChat}
        disabled={!ready}
        className="bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-700 disabled:opacity-50"
      >
        💬 Toggle Chat
      </button>
      <button
        onClick={closeChat}
        disabled={!ready}
        className="bg-red-600 text-white px-4 py-2 rounded-full shadow hover:bg-red-700 disabled:opacity-50"
      >
        ✖ Close Chat
      </button>
    </div>
  );
}
