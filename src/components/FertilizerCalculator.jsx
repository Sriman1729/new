// src/components/FertilizerCalculator.jsx
import React, { useState } from "react";
import { Calculator, Leaf } from "lucide-react";

/* ---------------------------
   Data / Defaults (unchanged)
   --------------------------- */
const DEFAULT_FERTILIZERS = {
  Urea: { N: 46, P: 0, K: 0 },
  DAP: { N: 18, P: 46, K: 0 },
  MOP: { N: 0, P: 0, K: 60 },
};

const DEFAULT_COST = {
  Urea: 8,
  DAP: 25,
  MOP: 20,
};

const CROP_TYPES = {
  Cereals: {
    Wheat: { N: 120, P: 60, K: 40 },
    Rice: { N: 100, P: 50, K: 50 },
    Maize: { N: 150, P: 60, K: 40 },
    Barley: { N: 100, P: 50, K: 50 },
    Sorghum: { N: 80, P: 40, K: 30 },
    Oats: { N: 90, P: 45, K: 35 },
    Ragi: { N: 70, P: 30, K: 25 },
  },
  CashCrops: {
    Cotton: { N: 90, P: 45, K: 45 },
    Sugarcane: { N: 250, P: 115, K: 115 },
    Groundnut: { N: 25, P: 60, K: 40 },
    Soybean: { N: 30, P: 65, K: 35 },
    Tobacco: { N: 100, P: 50, K: 60 },
    Sunflower: { N: 70, P: 40, K: 30 },
    Jute: { N: 60, P: 40, K: 30 },
  },
  Vegetables: {
    Potato: { N: 200, P: 100, K: 150 },
    Tomato: { N: 150, P: 75, K: 100 },
    Onion: { N: 150, P: 75, K: 75 },
    Garlic: { N: 120, P: 60, K: 60 },
    Carrot: { N: 100, P: 50, K: 80 },
    Cabbage: { N: 120, P: 60, K: 80 },
    Cauliflower: { N: 120, P: 60, K: 80 },
    Brinjal: { N: 100, P: 50, K: 80 },
    BellPepper: { N: 120, P: 60, K: 80 },
  },
  Fruits: {
    Mango: { N: 150, P: 50, K: 100 },
    Banana: { N: 200, P: 100, K: 250 },
    Papaya: { N: 180, P: 80, K: 150 },
    Orange: { N: 120, P: 60, K: 120 },
    Guava: { N: 100, P: 50, K: 100 },
    Apple: { N: 120, P: 60, K: 120 },
    Pomegranate: { N: 120, P: 50, K: 100 },
    Sapota: { N: 100, P: 50, K: 80 },
    Lemon: { N: 100, P: 50, K: 100 },
  },
  Legumes: {
    Chickpea: { N: 25, P: 50, K: 25 },
    Lentil: { N: 20, P: 40, K: 20 },
    PigeonPea: { N: 30, P: 50, K: 25 },
    GreenGram: { N: 20, P: 40, K: 20 },
    BlackGram: { N: 20, P: 40, K: 20 },
    CowPea: { N: 25, P: 50, K: 25 },
  },
  Spices: {
    Turmeric: { N: 100, P: 50, K: 75 },
    Ginger: { N: 120, P: 60, K: 100 },
    Chili: { N: 120, P: 60, K: 80 },
    Coriander: { N: 60, P: 30, K: 40 },
    Cumin: { N: 40, P: 20, K: 30 },
    BlackPepper: { N: 80, P: 40, K: 60 },
  },
  Medicinal: {
    AloeVera: { N: 80, P: 40, K: 50 },
    Ashwagandha: { N: 60, P: 30, K: 40 },
    Tulsi: { N: 50, P: 25, K: 30 },
    Neem: { N: 40, P: 20, K: 30 },
    Giloy: { N: 60, P: 30, K: 40 },
    Mint: { N: 70, P: 35, K: 50 },
    LemonGrass: { N: 80, P: 40, K: 60 },
    Stevia: { N: 70, P: 35, K: 50 },
  },
};

/* ---------------------------
   Helper (unchanged)
   --------------------------- */
function calculateFertilizers(requirement, fertilizers) {
  const dapNeeded = (requirement.P / fertilizers.DAP.P) * 100;
  const nFromDAP = (dapNeeded * fertilizers.DAP.N) / 100;
  const remainingN = Math.max(0, requirement.N - nFromDAP);
  const ureaNeeded = (remainingN / fertilizers.Urea.N) * 100;
  const mopNeeded = (requirement.K / fertilizers.MOP.K) * 100;

  return {
    Urea: parseFloat(ureaNeeded.toFixed(1)),
    DAP: parseFloat(dapNeeded.toFixed(1)),
    MOP: parseFloat(mopNeeded.toFixed(1)),
  };
}

/* ---------------------------
   Component
   --------------------------- */
export default function FertilizerCalculator() {
  // make initial crop stable for initial state
  const initialCrop = Object.keys(CROP_TYPES["Cereals"])[0];

  const [selectedType, setSelectedType] = useState("Cereals");
  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const [requirement, setRequirement] = useState(
    CROP_TYPES["Cereals"][initialCrop]
  );
  const [fieldSize, setFieldSize] = useState(1);
  const [unit, setUnit] = useState("ha");
  const [useCustom, setUseCustom] = useState(false);
  const [customFert, setCustomFert] = useState({
    Urea: { N: 0, P: 0, K: 0 },
    DAP: { N: 0, P: 0, K: 0 },
    MOP: { N: 0, P: 0, K: 0 },
  });
  const [fertilizerCost, setFertilizerCost] = useState({ ...DEFAULT_COST });
  const [farmCrops, setFarmCrops] = useState([]);
  const [result, setResult] = useState(null);

  // Handlers (kept same logic)
  const handleTypeChange = (e) => {
    const type = e.target.value;
    const firstCrop = Object.keys(CROP_TYPES[type])[0];
    setSelectedType(type);
    setSelectedCrop(firstCrop);
    setRequirement(CROP_TYPES[type][firstCrop]);
  };

  const handleCropChange = (e) => {
    const crop = e.target.value;
    setSelectedCrop(crop);
    setRequirement(CROP_TYPES[selectedType][crop]);
  };

  const handleInputChange = (nutrient, value) => {
    const numericValue = Math.max(0, Number(value));
    setRequirement((prev) => ({ ...prev, [nutrient]: numericValue }));
  };

  const handleCustomChange = (fert, nutrient, value) => {
    const numericValue = Math.max(0, Number(value));
    setCustomFert((prev) => ({
      ...prev,
      [fert]: { ...prev[fert], [nutrient]: numericValue },
    }));
  };

  const handleCostChange = (fert, value) => {
    const numericValue = Math.max(0, Number(value));
    setFertilizerCost((prev) => ({ ...prev, [fert]: numericValue }));
  };

  const addCropToFarm = () => {
    const updatedFerts = useCustom
      ? {
          Urea:
            customFert.Urea.N || customFert.Urea.P || customFert.Urea.K
              ? { ...customFert.Urea }
              : DEFAULT_FERTILIZERS.Urea,
          DAP:
            customFert.DAP.N || customFert.DAP.P || customFert.DAP.K
              ? { ...customFert.DAP }
              : DEFAULT_FERTILIZERS.DAP,
          MOP:
            customFert.MOP.N || customFert.MOP.P || customFert.MOP.K
              ? { ...customFert.MOP }
              : DEFAULT_FERTILIZERS.MOP,
        }
      : DEFAULT_FERTILIZERS;

    const fertAmounts = calculateFertilizers(requirement, updatedFerts);

    let multiplier = fieldSize;
    if (unit === "acre") multiplier = fieldSize * 0.4047;

    const scaledAmounts = Object.fromEntries(
      Object.entries(fertAmounts).map(([k, v]) => [
        k,
        parseFloat((v * multiplier).toFixed(1)),
      ])
    );

    const scaledCosts = Object.fromEntries(
      Object.entries(scaledAmounts).map(([k, v]) => [
        k,
        parseFloat((v * fertilizerCost[k]).toFixed(2)),
      ])
    );

    setFarmCrops((prev) => [
      ...prev,
      {
        type: selectedType,
        crop: selectedCrop,
        fieldSize,
        unit,
        amounts: scaledAmounts,
        costs: scaledCosts,
      },
    ]);
  };

  const calculateFarmTotals = () => {
    const totalAmounts = { Urea: 0, DAP: 0, MOP: 0 };
    const totalCosts = { Urea: 0, DAP: 0, MOP: 0 };

    farmCrops.forEach((c) => {
      Object.keys(totalAmounts).forEach((fert) => {
        totalAmounts[fert] += c.amounts[fert];
        totalCosts[fert] += c.costs[fert];
      });
    });

    setResult({ totalAmounts, totalCosts });
  };

  /* ---------------------------
     UI (restyled to match Home.jsx)
     --------------------------- */
  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <div className="p-6 rounded-2xl shadow-lg border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-800 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-7 h-7 text-green-600" />
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">
            Multi-Crop Fertilizer Planner
          </h2>
        </div>

        {/* Selection row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-green-900 dark:text-green-100">
              Crop Type
            </label>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full p-3 rounded-lg border border-green-300 dark:border-green-600 bg-green-100 dark:bg-green-900 dark:text-white"
            >
              {Object.keys(CROP_TYPES).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-green-900 dark:text-green-100">
              Crop
            </label>
            <select
              value={selectedCrop}
              onChange={handleCropChange}
              className="w-full p-3 rounded-lg border border-green-300 dark:border-green-600 bg-green-100 dark:bg-green-900 dark:text-white"
            >
              {Object.keys(CROP_TYPES[selectedType]).map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nutrients */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {["N", "P", "K"].map((nutrient) => (
            <div key={nutrient}>
              <label className="block text-sm font-medium mb-1 text-green-900 dark:text-green-100">
                {nutrient} (kg/ha)
              </label>
              <input
                type="number"
                min="0"
                value={requirement[nutrient]}
                onChange={(e) => handleInputChange(nutrient, e.target.value)}
                className="w-full p-3 rounded-lg border border-green-300 dark:border-green-600 bg-green-100 dark:bg-green-900 dark:text-white"
              />
            </div>
          ))}
        </div>

        {/* Field size */}
        <div className="mt-6 flex gap-3">
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={fieldSize}
            onChange={(e) => setFieldSize(Number(e.target.value))}
            className="flex-1 p-3 rounded-lg border border-green-300 dark:border-green-600 bg-green-100 dark:bg-green-900 dark:text-white"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="p-3 rounded-lg border border-green-300 dark:border-green-600 bg-green-100 dark:bg-green-900 dark:text-white"
          >
            <option value="ha">Hectares</option>
            <option value="acre">Acres</option>
          </select>
        </div>

        {/* Custom fertilizer */}
        <div className="mt-5">
          <label className="flex items-center gap-2 text-green-900 dark:text-green-100">
            <input
              type="checkbox"
              checked={useCustom}
              onChange={(e) => setUseCustom(e.target.checked)}
              className="w-4 h-4 accent-green-600"
            />
            <span className="font-medium">Use Custom Fertilizer (Urea, DAP, MOP)</span>
          </label>

          {useCustom && (
            <div className="mt-3 grid md:grid-cols-3 gap-3">
              {["Urea", "DAP", "MOP"].map((fert) => (
                <div key={fert} className="p-3 rounded-lg border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900">
                  <p className="font-semibold text-green-900 dark:text-green-100 mb-2">{fert} NPK</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["N", "P", "K"].map((nutr) => (
                      <input
                        key={nutr}
                        type="number"
                        min="0"
                        value={customFert[fert][nutr]}
                        onChange={(e) => handleCustomChange(fert, nutr, e.target.value)}
                        placeholder={nutr}
                        className="p-2 rounded-md border border-green-300 dark:border-green-600 bg-green-100 dark:bg-green-900 dark:text-white"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Costs */}
        <div className="mt-5 grid md:grid-cols-3 gap-3">
          {["Urea", "DAP", "MOP"].map((fert) => (
            <div key={fert}>
              <label className="block text-sm font-medium mb-1 text-green-900 dark:text-green-100">
                {fert} Cost (₹/kg)
              </label>
              <input
                type="number"
                min="0"
                value={fertilizerCost[fert]}
                onChange={(e) => handleCostChange(fert, e.target.value)}
                className="w-full p-3 rounded-lg border border-green-300 dark:border-green-600 bg-green-100 dark:bg-green-900 dark:text-white"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            onClick={addCropToFarm}
            className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow"
          >
            ➕ Add Crop to Farm
          </button>

          {farmCrops.length > 0 && (
            <div className="mt-3 p-4 rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-green-900 shadow">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">Crops in Farm</h3>
              <ul className="space-y-3">
                {farmCrops.map((c, i) => (
                  <li key={i} className="p-3 rounded-md border border-green-100 dark:border-green-800 bg-green-50 dark:bg-green-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">
                          {c.crop} ({c.fieldSize} {c.unit})
                        </p>
                      </div>
                    </div>
                    <ul className="mt-2 text-sm">
                      {Object.entries(c.amounts).map(([fert, amt]) => (
                        <li key={fert}>
                          {fert}: {amt} kg — ₹ {c.costs[fert]}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <button
                onClick={calculateFarmTotals}
                className="mt-4 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
              >
                📊 Calculate Total Fertilizer & Cost
              </button>
            </div>
          )}
        </div>

        {/* Totals */}
        {result && (
          <div className="mt-6 p-4 rounded-lg border border-green-200 dark:border-green-700 bg-green-100 dark:bg-green-900">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Total Fertilizer for Farm</h3>
            <ul className="text-sm space-y-1">
              {Object.entries(result.totalAmounts).map(([fert, amt]) => (
                <li key={fert}>
                  {fert}: {amt} kg — ₹ {result.totalCosts[fert].toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-bold text-green-900 dark:text-green-100">
              💰 Grand Total Cost: ₹{" "}
              {Object.values(result.totalCosts)
                .reduce((a, b) => a + b, 0)
                .toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
