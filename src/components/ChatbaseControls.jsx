import React, { useEffect } from "react";

export default function ChatbaseControls() {
  useEffect(() => {
    // Load Chatbase script dynamically when this component mounts
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "l5nRL-tkRCH-xVFi1Tz4r"; // your actual ID here
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script & widget when component unmounts
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
