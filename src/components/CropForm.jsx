import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CropForm() {
  const [useGeo, setUseGeo] = useState(false);
  const [cropDB, setCropDB] = useState({});
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [VDLI, setVDLI] = useState(0.5);
  const [SMI, setSMI] = useState(0.5);
  const [MHI, setMHI] = useState(0.5);
  const [result, setResult] = useState(null);

  // ✅ Load crop database from backend
  useEffect(() => {
    axios.get("http://localhost:5000/crop-database").then((res) => {
      setCropDB(res.data);
      setState(Object.keys(res.data)[0]); // pick first state by default
    });
  }, []);

  // ✅ Update default district when state changes
  useEffect(() => {
    if (state && cropDB[state]) {
      setDistrict(Object.keys(cropDB[state])[0]);
    }
  }, [state, cropDB]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalState = state;
    let finalDistrict = district;

    if (useGeo && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        // For demo, map geolocation to Telangana/Medak
        finalState = "Telangana";
        finalDistrict = "Medak";
        fetchRecommendations(finalState, finalDistrict);
      });
    } else {
      fetchRecommendations(finalState, finalDistrict);
    }
  };

  const fetchRecommendations = async (state, district) => {
    try {
      const res = await axios.post("http://localhost:5000/recommend-crops", {
        state,
        district,
        VDLI: parseFloat(VDLI),
        SMI: parseFloat(SMI),
        MHI: parseFloat(MHI),
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">🌾 Crop Recommendation</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useGeo}
            onChange={() => setUseGeo(!useGeo)}
          />
          Use My Location
        </label>

        {!useGeo && (
          <>
            <div>
              <label>State:</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="ml-2 border rounded p-1"
              >
                {Object.keys(cropDB).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label>District:</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="ml-2 border rounded p-1"
              >
                {state &&
                  cropDB[state] &&
                  Object.keys(cropDB[state]).map((d) => (
                    <option key={d}>{d}</option>
                  ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label>VDLI (0-1): </label>
          <input
            type="number"
            step="0.1"
            value={VDLI}
            onChange={(e) => setVDLI(e.target.value)}
            className="ml-2 border rounded p-1 w-20"
          />
        </div>

        <div>
          <label>SMI (0-1): </label>
          <input
            type="number"
            step="0.1"
            value={SMI}
            onChange={(e) => setSMI(e.target.value)}
            className="ml-2 border rounded p-1 w-20"
          />
        </div>

        <div>
          <label>MHI (0-1): </label>
          <input
            type="number"
            step="0.1"
            value={MHI}
            onChange={(e) => setMHI(e.target.value)}
            className="ml-2 border rounded p-1 w-20"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Get Recommendations
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold">✅ Recommended Crops:</h3>
          <ul className="list-disc pl-5">
            {result.recommendations.map((crop, idx) => (
              <li key={idx}>{crop}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-gray-600">{result.notes}</p>
        </div>
      )}
    </div>
  );
}
