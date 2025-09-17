const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Sample crop knowledge base (you can expand later)
const crops = [
  {
    name: "Groundnut",
    soil: ["loamy", "sandy"],
    water: "low",
    season: "kharif",
    priceTrend: "high",
  },
  {
    name: "Paddy",
    soil: ["clay", "loamy"],
    water: "high",
    season: "kharif",
    priceTrend: "stable",
  },
  {
    name: "Wheat",
    soil: ["loamy"],
    water: "medium",
    season: "rabi",
    priceTrend: "good",
  },
  {
    name: "Maize",
    soil: ["sandy", "loamy"],
    water: "medium",
    season: "kharif",
    priceTrend: "good",
  },
];

// Simple season detection (based on month)
function getSeason(month) {
  if ([6, 7, 8, 9, 10].includes(month)) return "kharif";
  if ([11, 12, 1, 2, 3].includes(month)) return "rabi";
  return "zaid";
}

app.post("/recommend-crop", (req, res) => {
  const { soilType, irrigation, month } = req.body;
  const season = getSeason(month);

  // Rule-based filtering
  let filtered = crops.filter(
    (c) =>
      c.soil.includes(soilType.toLowerCase()) &&
      c.season === season &&
      (irrigation === "yes" || c.water !== "high")
  );

  // Sort by priceTrend (priority: high > good > stable)
  const rank = { high: 3, good: 2, stable: 1 };
  filtered.sort((a, b) => rank[b.priceTrend] - rank[a.priceTrend]);

  if (filtered.length === 0) {
    return res.json({
      recommendations: [
        { crop: "No clear recommendation", reason: "Conditions not matched" },
      ],
    });
  }

  const output = filtered.map((c) => ({
    crop: c.name,
    reason: `Suits ${soilType} soil, ${c.water} water need, ${c.priceTrend} mandi prices.`,
  }));

  res.json({ recommendations: output.slice(0, 3) });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
