import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 1. Initial fetch of all notifications
    fetchNotifications();

    // 2. Connect to SSE stream
    const evtSource = new EventSource("https://new-gsp1.onrender.com/stream");

    evtSource.onmessage = (e) => {
      const newNotif = JSON.parse(e.data);
      if (newNotif.active) {
        setNotifications((prev) => [...prev, newNotif]);
      }
    };

    evtSource.onerror = (err) => {
      console.error("SSE error:", err);
      evtSource.close();
    };

    return () => {
      evtSource.close();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("https://new-gsp1.onrender.com/notifications");
      setNotifications(res.data.filter((n) => n.active));
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  return (
    <div className="p-4 border rounded shadow max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No active notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className="mb-2 p-3 border rounded bg-yellow-100 shadow-sm"
          >
            <h3 className="font-semibold">{n.title}</h3>
            <p>{n.message}</p>
            <span className="text-xs text-gray-500">
              {n.date || new Date(n.id).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
