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

// GET all notifications
app.get("/notifications", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(NOTIF_FILE));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to read notifications" });
  }
});

// POST new notification
app.post("/notifications", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(NOTIF_FILE));
    const newNotif = { id: Date.now(), ...req.body };
    data.push(newNotif);
    fs.writeFileSync(NOTIF_FILE, JSON.stringify(data, null, 2));
    res.json(newNotif);
  } catch (err) {
    res.status(500).json({ error: "Failed to add notification" });
  }
});

// Use dynamic port for Render deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
