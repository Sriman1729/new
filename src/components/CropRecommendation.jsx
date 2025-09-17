import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Leaf, MapPin, Droplets, Sun, Calendar, Wheat, BarChart, Info, Wind, Thermometer,
  TrendingUp, Shield, RefreshCcw, ChevronsRight, Zap, Eye, TestTube2, AlertTriangle, X, Sprout, Bug
} from 'lucide-react';
import DISTRICTS from "../data/indiaDistricts";
import { CROPS } from "../data/cropMaster"; // adjust path
import districtCrops from "../data/districtCrops.json";

const SOIL_TYPES = ["Alluvial", "Loamy", "Sandy", "Clayey", "Saline", "Red Soil", "Black Cotton", "Mixed"];

// --- ENHANCED HELPER FUNCTIONS ---
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return "Kharif";
  if (month >= 11 || month <= 4) return "Rabi";
  return "Zaid";
};

const getSeasonalWeatherPrediction = (months) => {
  const patterns = {
    1: {t:"10-22",r:"VL",h:"65-75"},
    2: {t:"13-26",r:"L",h:"60-70"},
    3: {t:"18-30",r:"L",h:"55-65"},
    4: {t:"24-37",r:"L",h:"45-55"},
    5: {t:"28-42",r:"L",h:"40-50"},
    6: {t:"29-39",r:"M",h:"60-70"},
    7: {t:"27-35",r:"H",h:"75-85"},
    8: {t:"26-34",r:"H",h:"80-90"},
    9: {t:"25-34",r:"M",h:"70-80"},
    10: {t:"20-32",r:"L",h:"60-70"},
    11: {t:"14-28",r:"VL",h:"55-65"},
    12: {t:"8-20",r:"VL",h:"65-75"}
  };
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  
  if (!months || months.length === 0) return { avg: "N/A", details: [] };
  
  let aT = 0, aH = 0;
  const d = months.map(m => {
    const p = patterns[m];
    aT += parseInt(p.t.split('-')[1]);
    aH += parseInt(p.h.split('-')[1]);
    return {
      month: names[m-1],
      temp: p.t + "°C",
      rainfall: p.r,
      humidity: p.h + "%"
    };
  });
  
  return {
    avg: `~${Math.round(aT/months.length)}°C | ${Math.round(aH/months.length)}% Hum`,
    details: d
  };
};

// --- ENHANCED RECOMMENDATION ALGORITHM ---
const calculateEnhancedSmartScore = (crop, filters, currentSeason, weather) => {
  // Base profit calculation
  const price = parseInt((crop.marketPrice || "0").toString().replace(/[^0-9]/g, ''), 10) || 0;
  const profit = (crop.avgYield * price) - (crop.investment || 0);
  const profitRatio = (crop.investment > 0) ? profit / crop.investment : profit > 0 ? 1 : 0;
  
  // Market demand scoring
  const demandScore = {
    'Very High': 1.4,
    'High': 1.3,
    'Medium': 1.0,
    'Low': 0.7
  }[crop.marketDemand] || 1.0;
  
  // Risk assessment scoring (inverted - lower risk = higher score)
  const riskScore = {
    'Low': 1.3,
    'Medium': 1.0,
    'High': 0.7
  }[crop.riskFactor] || 1.0;
  
  // Water efficiency scoring
  const waterScore = {
    'Very High': 1.4,
    'High': 1.2,
    'Medium': 1.0,
    'Low': 0.8
  }[crop.waterEfficiency] || 1.0;
  
  // Seasonal appropriateness
  const seasonScore = crop.seasons.includes(currentSeason) || 
                     crop.seasons.includes("Annual") || 
                     crop.seasons.includes("Perennial") ? 1.2 : 0.8;
  
  // Crop rotation benefits
  const previousCropFamily = filters.previousCrop ? 
    CROPS.find(c => c.name === filters.previousCrop)?.cropFamily : null;
  const rotationScore = (previousCropFamily && crop.cropFamily === previousCropFamily) ? 0.85 : 1.0;
  
  // Export potential scoring
  const exportScore = {
    'Very High': 1.3,
    'High': 1.2,
    'Medium': 1.0,
    'Low': 0.9
  }[crop.exportPotential] || 1.0;
  
  // Mechanization score (higher mechanization = lower labor cost)
  const mechanizationScore = {
    'High': 1.2,
    'Medium': 1.0,
    'Low': 0.9
  }[crop.mechanization] || 1.0;
  
  // Weather compatibility (if weather data available)
  let weatherScore = 1.0;
  if (weather && crop.plantingMonths) {
    const currentMonth = new Date().getMonth() + 1;
    const isPlantingTime = crop.plantingMonths.includes(currentMonth);
    weatherScore = isPlantingTime ? 1.15 : 0.95;
  }
  
  // Duration preference matching
  let durationScore = 1.0;
  try {
    const [minDur, maxDur] = (filters.growingDuration || "1-999").toString().split('-').map(Number);
    durationScore = (crop.growingDuration >= (minDur || 1) && crop.growingDuration <= (maxDur || 999)) ? 1.1 : 0.9;
  } catch(e) { durationScore = 1.0 }
  
  // Storage life consideration (longer storage = better)
  const storageScore = crop.storageLife > 6 ? 1.1 : crop.storageLife > 3 ? 1.0 : 0.9;
  
  // Calculate weighted smart score
  const smartScore = (
    (profitRatio * 0.25) +           // Profitability: 25%
    (demandScore * 0.15) +           // Market demand: 15%
    (riskScore * 0.15) +             // Risk factor: 15%
    (waterScore * 0.10) +            // Water efficiency: 10%
    (seasonScore * 0.10) +           // Seasonal fit: 10%
    (exportScore * 0.08) +           // Export potential: 8%
    (mechanizationScore * 0.05) +    // Mechanization: 5%
    (rotationScore * 0.05) +         // Crop rotation: 5%
    (weatherScore * 0.04) +          // Weather fit: 4%
    (durationScore * 0.02) +         // Duration fit: 2%
    (storageScore * 0.01)            // Storage life: 1%
  ) * 100; // Scale to 0-100
  
  return Math.max(0, Math.round(smartScore * 100) / 100);
};

// --- UI COMPONENTS ---
const FilterSelect = ({ name, label, value, onChange, options, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select 
      id={name} 
      name={name} 
      value={value} 
      onChange={onChange} 
      className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
  </div>
);

const WaterSourceCheckboxes = ({ selected, onChange }) => {
  const sources = ["Rainwater", "Borewell/Tubewell", "Canal Irrigation", "Pond/Well"];
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Available Water Sources</label>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-x-4 gap-y-2">
        {sources.map(s => (
          <label key={s} className="flex items-center space-x-2 text-sm text-gray-600">
            <input 
              type="checkbox" 
              name="waterSources" 
              value={s} 
              checked={selected.includes(s)} 
              onChange={onChange} 
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span>{s}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const WeatherInfoPanel = ({ weather, error, season }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 h-full">
    <h3 className="font-semibold text-blue-800 mb-2">Intelligence Panel</h3>
    <div className="space-y-2">
      <div className="flex items-center text-sm text-blue-700">
        <Calendar className="w-4 h-4 mr-2"/> Current Season: <strong className="ml-1">{season}</strong>
      </div>
      <div className="flex items-center text-sm text-blue-700">
        <Zap className="w-4 h-4 mr-2"/> Enhanced AI with 105+ crops data.
      </div>
      <div className="pt-2 border-t border-blue-200 mt-2">
        {weather ? (
          <>
            <div className="flex items-center text-sm font-semibold text-blue-800">
              <MapPin className="w-4 h-4 mr-2"/>Live Weather: {weather.name}
            </div>
            <div className="flex items-center text-sm text-blue-700">
              <Thermometer className="w-4 h-4 mr-2"/>{Math.round(weather.main.temp)}°C, feels like {Math.round(weather.main.feels_like)}°C
            </div>
            <div className="flex items-center text-sm text-blue-700">
              <Droplets className="w-4 h-4 mr-2"/>Humidity: {weather.main.humidity}%
            </div>
            <div className="flex items-center text-sm text-blue-700">
              <Wind className="w-4 h-4 mr-2"/>Wind: {weather.wind.speed} m/s
            </div>
          </>
        ) : (
          <div className="text-sm text-blue-600">{error || "Select a district for live weather."}</div>
        )}
      </div>
    </div>
  </div>
);

const AIInsightPanel = ({ filters, resultsCount, season }) => (
  <div className="bg-green-50 border-2 border-dashed border-green-200 rounded-lg p-5 mb-8 text-center">
    <p className="text-green-800">
      Based on your selections for a farm in <strong className="font-semibold">{filters.district}</strong> with <strong className="font-semibold">{filters.soilType.toLowerCase()} soil</strong> and a <strong className="font-semibold">{filters.investmentBudget > 50000 ? 'high' : 'medium'} budget</strong>, our Enhanced AI has identified <strong className="font-semibold">{resultsCount} suitable crops</strong> for the current <strong className="font-semibold">{season} season</strong>. The recommendations are ranked by an Advanced Smart Score considering profitability, market demand, risk, sustainability, and export potential.
    </p>
  </div>
);

const CropDetailModal = ({ crop, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{crop.icon}</span>
          <div>
            <h2 className="text-2xl font-bold">{crop.name}</h2>
            <p className="text-sm text-gray-500">{crop.type} ({crop.cropFamily})</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <X size={24}/>
        </button>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Calendar/> Farming Timeline
              </h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Planting:</strong> {crop.plantingMonths.map(m => new Date(0, m - 1).toLocaleString('default', { month: 'long' })).join(', ')}</li>
                <li><strong>Growing Duration:</strong> {crop.growingDuration} months</li>
                <li><strong>Harvesting:</strong> {crop.harvestMonths.map(m => new Date(0, m - 1).toLocaleString('default', { month: 'long' })).join(', ')}</li>
                <li><strong>Storage Life:</strong> {crop.storageLife} months</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <TrendingUp/> Market & Economics
              </h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Investment:</strong> ₹{crop.investment.toLocaleString()}/acre</li>
                <li><strong>Expected Yield:</strong> {crop.avgYield} quintals/acre</li>
                <li><strong>Market Price:</strong> {crop.marketPrice}</li>
                <li><strong>Export Potential:</strong> {crop.exportPotential}</li>
                <li><strong>Mechanization Level:</strong> {crop.mechanization}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <TestTube2/> Varieties & Nutrition
              </h3>
              <p className="text-sm text-gray-600 mb-2"><strong>Recommended Varieties:</strong> {crop.varieties.join(', ')}</p>
              <p className="text-sm text-gray-600"><strong>Nutritional Value:</strong> {crop.nutritionalValue}</p>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Sun/> Seasonal Weather Forecast
              </h3>
              <div className="text-sm space-y-2">
                <div>
                  <strong>Planting Period:</strong>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {crop.plantingWeather.details.slice(0, 3).map(d => 
                      <div key={d.month} className="bg-gray-100 p-2 rounded text-center">
                        <div className="font-bold">{d.month}</div>
                        <div>{d.temp}</div>
                        <div className="text-xs">{d.rainfall} Rain</div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <strong>Harvesting Period:</strong>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {crop.harvestWeather.details.slice(0, 3).map(d => 
                      <div key={d.month} className="bg-gray-100 p-2 rounded text-center">
                        <div className="font-bold">{d.month}</div>
                        <div>{d.temp}</div>
                        <div className="text-xs">{d.rainfall} Rain</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Bug/> Risk Management
              </h3>
              <p className="text-sm text-gray-600 mb-2"><strong>Common Risks:</strong> {crop.commonRisks.join(', ')}</p>
              <p className="text-sm text-gray-600 mb-2"><strong>Risk Level:</strong> {crop.riskFactor}</p>
              <p className="text-sm text-gray-600">Regular monitoring and IPM practices recommended. Use resistant varieties and bio-pesticides when possible.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Sprout/> Soil & Water Requirements
              </h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Suitable Soils:</strong> {crop.soil.join(', ')}</li>
                <li><strong>Soil pH:</strong> {crop.soilPH[0]} - {crop.soilPH[1]}</li>
                <li><strong>Water Requirement:</strong> {crop.water}</li>
                <li><strong>Water Efficiency:</strong> {crop.waterEfficiency}</li>
                <li><strong>Compatible Intercrops:</strong> {crop.interCropping.length > 0 ? crop.interCropping.join(', ') : "Generally grown as monocrop"}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Special Notes</h3>
          <p className="text-sm text-gray-600">{crop.specialNotes}</p>
        </div>
      </div>
    </div>
  </div>
);

const ProfitBar = ({ investment, profit }) => {
  const total = (investment || 0) + Math.max(0, profit || 0);
  const investmentPercent = total > 0 ? (investment / total) * 100 : 0;
  const isProfit = profit > 0;
  
  return (
    <div>
      <div className="relative w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${isProfit ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `100%` }}></div>
        <div className="absolute top-0 left-0 bg-orange-500 h-2.5 rounded-l-full" style={{ width: `${investmentPercent}%` }}></div>
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span className="font-semibold text-orange-600">Invest: ₹{(investment || 0).toLocaleString()}</span>
        <span className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
          {isProfit ? 'Profit' : 'Loss'}: ₹{Math.abs(profit || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const CropRecommendationCard = ({ crop, rank, onViewDetails }) => {
  const calculateProfit = (c) => {
    try {
      const price = parseInt((c.marketPrice || "0").toString().replace(/[^0-9]/g,''), 10) || 0;
      return (c.avgYield * price) - (c.investment || 0);
    } catch {
      return 0;
    }
  };
  
  const profit = calculateProfit(crop);
  const demandColor = crop.marketDemand === 'Very High' ? 'text-purple-600 bg-purple-100' :
                     crop.marketDemand === 'High' ? 'text-green-600 bg-green-100' : 
                     crop.marketDemand === 'Medium' ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100';
  const riskColor = crop.riskFactor === 'High' ? 'text-red-600 bg-red-100' : 
                   crop.riskFactor === 'Medium' ? 'text-yellow-600 bg-yellow-100' : 'text-green-600 bg-green-100';
  const waterColor = crop.waterEfficiency && crop.waterEfficiency.includes('Very High') ? 'text-blue-700 bg-blue-100' :
                    crop.waterEfficiency && crop.waterEfficiency.includes('High') ? 'text-blue-600 bg-blue-100' : 'text-orange-600 bg-orange-100';
  const exportColor = crop.exportPotential === 'Very High' ? 'text-purple-600 bg-purple-100' :
                     crop.exportPotential === 'High' ? 'text-indigo-600 bg-indigo-100' : 'text-gray-600 bg-gray-100';
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col relative">
      <div className="p-5 flex-grow">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl">{crop.icon}</span>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{crop.name}</h3>
            <p className="text-sm text-gray-500">{crop.type} • {crop.growingDuration} months</p>
            <p className="text-xs text-gray-400">Smart Score: {crop.smartScore}/100</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${demandColor}`}>
            <TrendingUp size={12} className="mr-1"/>Market: {crop.marketDemand}
          </div>
          <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${riskColor}`}>
            <Shield size={12} className="mr-1"/>Risk: {crop.riskFactor}
          </div>
          <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${waterColor}`}>
            <Droplets size={12} className="mr-1"/>{crop.waterEfficiency} Water
          </div>
          <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${exportColor}`}>
            <TrendingUp size={12} className="mr-1"/>Export: {crop.exportPotential}
          </div>
        </div>
        
        <div className="space-y-3 text-sm mb-4">
          <ProfitBar investment={crop.investment} profit={profit}/>
          <div className="text-xs text-gray-600">
            <div>Expected Yield: {crop.avgYield} quintals/acre</div>
            <div>Market Price: {crop.marketPrice}</div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <h4 className="font-semibold text-sm mb-2 text-gray-700">Weather Forecast</h4>
          <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
            <strong>Planting:</strong>
            <span>{crop.plantingWeather.avg}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-600">
            <strong>Harvest:</strong>
            <span>{crop.harvestWeather.avg}</span>
          </div>
        </div>
      </div>
      
      <div className="p-5 pt-0">
        <button 
          onClick={() => onViewDetails(crop)} 
          className="w-full text-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          View Details <Eye size={16}/>
        </button>
      </div>
      
      {rank <= 3 && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2.5 py-1 rounded-full font-bold z-10 shadow-lg">
          TOP #{rank}
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function EnhancedCropRecommendations() {
  const initialFilters = { 
    state: "",
    district: "", 
    soilType: "", 
    previousCrop: "", 
    waterSources: [], 
    investmentBudget: "", 
    growingDuration: "" 
  };
  
  const [filters, setFilters] = useState(initialFilters);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [season] = useState(getCurrentSeason());
  
  const totalFilters = Object.keys(initialFilters).length;
  const filledFilters = useMemo(() => 
    Object.values(filters).filter(v => 
      Array.isArray(v) ? v.length > 0 : v !== ""
    ).length, [filters]
  );
  const isFormComplete = filledFilters === totalFilters;

  // ✅ NEW: extra filter + sort states
  const [riskFilter, setRiskFilter] = useState("");
  const [waterFilter, setWaterFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  // --- Weather API call ---
  useEffect(() => {
    if (!filters.district) {
      setWeather(null);
      setWeatherError("");
      return;
    }
    
    const fetchWeather = async () => {
      try {
        const apiKey = "5e04c9e9f749a242973926ba146c8772";
        // <-- updated to include state for better geocoding resolution
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${filters.district},${filters.state},IN&units=metric&appid=${apiKey}`;
        const response = await axios.get(url);
        setWeather(response.data);
        setWeatherError("");
      } catch (err) {
        setWeather(null);
        setWeatherError("Could not fetch live weather data.");
      }
    };
    
    fetchWeather();
  }, [filters.district, filters.state]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleWaterSourceChange = (e) => {
    const { value, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      waterSources: checked 
        ? [...prev.waterSources, value]
        : prev.waterSources.filter(s => s !== value)
    }));
  };

  const handleGetRecommendations = () => {
    // Enhanced filtering logic
    let filtered = CROPS.filter(crop => 
      // <-- updated: districtCrops contains crop NAMES, not ids
      districtCrops[filters.district]?.includes(crop.name)
    );
    
    // Season filtering
    filtered = filtered.filter(crop => 
      crop.seasons.includes(season) || 
      ["Annual", "Perennial"].includes(crop.seasons[0])
    );
    
    // Soil type filtering
    filtered = filtered.filter(crop => crop.soil.includes(filters.soilType));
    
    // Duration filtering
    const [minDur, maxDur] = (filters.growingDuration || "1-999").toString().split('-').map(Number);
    filtered = filtered.filter(c => 
      c.growingDuration >= (minDur || 1) && c.growingDuration <= (maxDur || 999)
    );
    
    // Investment filtering
    filtered = filtered.filter(c => c.investment <= Number(filters.investmentBudget));
    
    // Water source compatibility
    const waterLevels = new Set((filters.waterSources || []).map(s => ({
      "Rainwater": "low",
      "Pond/Well": "low", 
      "Borewell/Tubewell": "medium",
      "Canal Irrigation": "high"
    }[s])));
    
    const userHas = {
      high: waterLevels.has('high'),
      medium: waterLevels.has('medium'),
      low: waterLevels.has('low')
    };
    
    filtered = filtered.filter(c => 
      (c.water === 'high' && userHas.high) ||
      (c.water === 'medium' && (userHas.high || userHas.medium)) ||
      (c.water === 'low' && (userHas.high || userHas.medium || userHas.low))
    );

    // Enhanced processing with smart scoring
    const processed = filtered.map(crop => ({
      ...crop,
      plantingWeather: getSeasonalWeatherPrediction(crop.plantingMonths),
      harvestWeather: getSeasonalWeatherPrediction(crop.harvestMonths),
      smartScore: calculateEnhancedSmartScore(crop, filters, season, weather)
    }));

    // Sort by enhanced smart score by default
    processed.sort((a, b) => b.smartScore - a.smartScore);
    
    setRecommendations(processed);
    setHasSearched(true);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setRecommendations([]);
    setHasSearched(false);
    setWeather(null);
    // also reset new filters
    setRiskFilter("");
    setWaterFilter("");
    setSortBy("");
  };

  // ✅ NEW: filter + sort logic for displayed recommendations (memoized)
  const displayed = useMemo(() => {
    let d = [...recommendations];
    if (riskFilter) {
      d = d.filter(c => c.riskFactor === riskFilter);
    }
    if (waterFilter) {
      d = d.filter(c => (c.waterEfficiency || '').toString().includes(waterFilter));
    }
    if (sortBy) {
      const valueMap = { "Low": 1, "Medium": 2, "High": 3, "Very High": 4 };
      d.sort((a, b) => {
        if (sortBy === "profit") {
          const profitA = (a.avgYield * (parseInt((a.marketPrice || "0").toString().replace(/[^0-9]/g,''), 10) || 0)) - (a.investment || 0);
          const profitB = (b.avgYield * (parseInt((b.marketPrice || "0").toString().replace(/[^0-9]/g,''), 10) || 0)) - (b.investment || 0);
          return profitB - profitA; // high to low
        }
        if (sortBy === "smartScore") {
          return (b.smartScore || 0) - (a.smartScore || 0);
        }
        if (sortBy === "risk") {
          const ra = valueMap[a.riskFactor] || 99;
          const rb = valueMap[b.riskFactor] || 99;
          return ra - rb; // Low -> High
        }
        if (sortBy === "water") {
          const wa = valueMap[(a.waterEfficiency || '').toString().split(' ')[0]] || 99;
          const wb = valueMap[(b.waterEfficiency || '').toString().split(' ')[0]] || 99;
          return wa - wb; // Low -> High
        }
        return 0;
      });
    }
    return d;
  }, [recommendations, riskFilter, waterFilter, sortBy]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {selectedCrop && <CropDetailModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />}
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 flex items-center.justify-center gap-3">
            <Leaf className="text-green-600 w-12 h-12"/> Enhanced Crop Advisory
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered crop advisor with 105+ crops data across 700+ districts. Get personalized recommendations based on comprehensive analysis.
          </p>
        </header>
        
       <main>
  <div className="bg-white dark:bg-green-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* State Dropdown */}
        <FilterSelect 
          name="state" 
          label="State" 
          value={filters.state} 
          onChange={(e) => {
            const newState = e.target.value;
            setFilters(prev => ({ ...prev, state: newState, district: "" }));
          }} 
          options={Object.keys(DISTRICTS)} 
          placeholder="Select State"
        />

        {/* District Dropdown */}
        <FilterSelect 
          name="district" 
          label="District" 
          value={filters.district} 
          onChange={handleFilterChange} 
          options={filters.state ? DISTRICTS[filters.state] : []} 
          placeholder={filters.state ? "Select District" : "Select State first"} 
        />
        
        <FilterSelect 
          name="soilType" 
          label="Soil Type" 
          value={filters.soilType} 
          onChange={handleFilterChange} 
          options={SOIL_TYPES} 
          placeholder="Select Soil Type"
        />
        
        <FilterSelect 
          name="previousCrop" 
          label="Previous Crop" 
          value={filters.previousCrop} 
          onChange={handleFilterChange} 
          options={CROPS.map(c => c.name)} 
          placeholder="None / Fallow Land"
        />
        
        <FilterSelect 
          name="growingDuration" 
          label="Preferred Growing Duration" 
          value={filters.growingDuration} 
          onChange={handleFilterChange} 
          options={[
            {label: "Short (1-3 months)", value: "1-3"},
            {label: "Medium (4-6 months)", value: "4-6"},
            {label: "Long (6+ months)", value: "7-99"}
          ]} 
          placeholder="Select Duration"
        />

        {/* ✅ Correct investmentBudget filter (kept only once) */}
        <div className="sm:col-span-2">
          <FilterSelect 
            name="investmentBudget" 
            label="Investment Budget (per acre)" 
            value={filters.investmentBudget} 
            onChange={handleFilterChange} 
            options={[
              {label: "Low (Up to ₹25,000)", value: 25000},
              {label: "Medium (Up to ₹50,000)", value: 50000},
              {label: "High (Up to ₹75,000)", value: 75000},
              {label: "Very High (Above ₹75,000)", value: 200000}
            ]} 
            placeholder="Select Budget Range"
          />
        </div>

        <div className="sm:col-span-2">
          <WaterSourceCheckboxes 
            selected={filters.waterSources} 
            onChange={handleWaterSourceChange}
          />
        </div>
      </div>
      
      <div className="md:col-span-2 lg:col-span-1">
        <WeatherInfoPanel 
          weather={weather} 
          error={weatherError} 
          season={season}
        />
      </div>
    </div>

    {/* Progress + buttons */}
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommendation Progress</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(filledFilters/totalFilters)*100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isFormComplete ? 'Ready for Enhanced AI Analysis!' : `${filledFilters} of ${totalFilters} parameters selected.`}
          </p>
        </div>
        
        <div className="flex-grow flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleGetRecommendations} 
            disabled={!isFormComplete} 
            className="w-full text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center justify-center gap-2"
          >
            <ChevronsRight size={20}/> Get Enhanced AI Recommendations
          </button>
          
          <button 
            onClick={handleClearFilters} 
            className="p-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCcw size={20}/>
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Results section */}
  <div className="mt-12">
    {hasSearched && <AIInsightPanel filters={filters} resultsCount={recommendations.length} season={season} />}
    
    <div className="flex items-center gap-3 mb-6">
      <BarChart className="w-8 h-8 text-green-600"/>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Enhanced AI Results</h2>
    </div>
    
    {/* ✅ NEW Filter controls above results (styled to match FilterSelect) */}
    {hasSearched && recommendations.length > 0 && (
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-white dark:bg-green-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Sort By</option>
          <option value="risk">Risk (Low → High)</option>
          <option value="water">Water (Low → High)</option>
          <option value="profit">Profit (High → Low)</option>
          <option value="smartScore">Smart Score (High → Low)</option>
        </select>

        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="bg-white dark:bg-green-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">All Risk Levels</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select value={waterFilter} onChange={e => setWaterFilter(e.target.value)} className="bg-white dark:bg-green-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">All Water Efficiency</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Very High">Very High</option>
        </select>

        <button onClick={() => { setRiskFilter(""); setWaterFilter(""); setSortBy(""); }} className="ml-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Reset Filters</button>
      </div>
    )}

    {!hasSearched ? (
      <div className="text-center py-16 px-6 bg-white dark:bg-green-900 rounded-lg shadow-md border-2 border-dashed border-gray-200 dark:border-gray-700">
        <Info className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-300"/>
        <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Your Enhanced Recommendations Await</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Complete all parameters above for comprehensive AI-powered crop analysis with 105+ crop database.</p>
      </div>
    ) : displayed.length > 0 ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayed.map((crop, index) => 
          <CropRecommendationCard 
            key={crop.id} 
            crop={crop} 
            rank={index + 1} 
            onViewDetails={setSelectedCrop} 
          />
        )}
      </div>
    ) : (
      <div className="text-center py-16 px-6 bg-white dark:bg-green-900 rounded-lg shadow-md border-2 border-dashed border-gray-200 dark:border-gray-700">
        <AlertTriangle className="w-12 h-12 mx-auto text-yellow-500"/>
        <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">No Suitable Crops Found</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Based on your specific criteria, no ideal crops were identified. Try adjusting your parameters for broader recommendations.</p>
      </div>
    )}
  </div>
</main>
</div>
    </div>
  );
}
