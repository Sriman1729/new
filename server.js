const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const NOTIF_FILE = "./notifications.json";

// Get all notifications
app.get("/notifications", (req, res) => {
  const data = JSON.parse(fs.readFileSync(NOTIF_FILE));
  res.json(data);
});

// Add new notification
app.post("/notifications", (req, res) => {
  const data = JSON.parse(fs.readFileSync(NOTIF_FILE));
  const newNotif = { id: Date.now(), ...req.body };
  data.push(newNotif);
  fs.writeFileSync(NOTIF_FILE, JSON.stringify(data, null, 2));
  res.json(newNotif);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
