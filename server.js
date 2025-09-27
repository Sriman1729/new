const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const NOTIF_FILE = path.join(__dirname, "notifications.json");

// Ensure notifications.json exists
if (!fs.existsSync(NOTIF_FILE)) {
  fs.writeFileSync(NOTIF_FILE, "[]");
}

// SSE clients array
let clients = [];

// Utility to safely read notifications
function readNotifications() {
  try {
    return JSON.parse(fs.readFileSync(NOTIF_FILE, "utf-8"));
  } catch (err) {
    console.error("Failed to read notifications, resetting file:", err);
    fs.writeFileSync(NOTIF_FILE, "[]");
    return [];
  }
}

// GET all notifications
app.get("/notifications", (req, res) => {
  const data = readNotifications();
  res.json(data);
});

// POST new notification
app.post("/notifications", (req, res) => {
  try {
    const data = readNotifications();
    const newNotif = { id: Date.now(), ...req.body };
    data.push(newNotif);
    fs.writeFileSync(NOTIF_FILE, JSON.stringify(data, null, 2));

    // Send new notification to all SSE clients
    clients.forEach(client => {
      client.write(`data: ${JSON.stringify(newNotif)}\n\n`);
    });

    res.json(newNotif);
  } catch (err) {
    console.error("Failed to add notification:", err);
    res.status(500).json({ error: "Failed to add notification" });
  }
});

// SSE endpoint for real-time notifications
app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Push response object into clients
  clients.push(res);

  // Send keep-alive comment every 15s
  const keepAlive = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 15000);

  // Cleanup when client disconnects
  req.on("close", () => {
    clearInterval(keepAlive);
    clients = clients.filter(c => c !== res);
  });
});

// Root endpoint (optional for health check)
app.get("/", (req, res) => {
  res.send("✅ Notification Server is running!");
});

// Use dynamic port for Render deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
