import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const res = await axios.get("https://new-gsp1.onrender.com/notifications");
    setNotifications(res.data.filter((n) => n.active));
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No active notifications</p>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className="mb-2 p-2 border rounded bg-yellow-100">
            <h3 className="font-semibold">{n.title}</h3>
            <p>{n.message}</p>
            <span className="text-xs text-gray-500">{n.date}</span>
          </div>
        ))
      )}
    </div>
  );
}
