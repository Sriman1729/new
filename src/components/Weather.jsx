import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import indiaDistricts from "../data/indiaDistricts.json"; // adjust path if needed

export default function Weather() {
  const [state, setState] = useState("Punjab");
  const [city, setCity] = useState("Ludhiana");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const states = Object.keys(indiaDistricts);
  const districts = indiaDistricts[state] || [];

  // Farming advice
  const farmingAdvice = useMemo(() => {
    if (!weather) return [];
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const condition = weather.weather[0].main.toLowerCase();

    const advice = [];
    if (temp >= 20 && temp <= 30 && humidity >= 50 && humidity <= 70) {
      advice.push("🌾 Perfect conditions for wheat sowing. Plan for October-November planting.");
    }
    if (temp >= 25 && temp <= 35 && condition.includes("clear")) {
      advice.push("🌾 Good for paddy transplanting. Ensure adequate water supply.");
    }
    if (condition.includes("rain")) {
      advice.push("🌧️ Monsoon rains detected. Ideal for kharif sowing and land preparation.");
      advice.push("💧 Reduce irrigation schedule. Monitor for water logging in paddy fields.");
    }
    if (temp > 35) {
      advice.push("🌡️ High temperature alert. Provide shade to livestock and increase irrigation.");
      advice.push("💦 Consider heat-resistant varieties for cotton and sugarcane crops.");
    }
    if (humidity > 80) {
      advice.push("🍄 High humidity may cause blast in paddy. Apply preventive fungicide spray.");
      advice.push("🌿 Monitor wheat crops for rust diseases during this weather.");
    }
    if (temp < 15) {
      advice.push("❄️ Cold wave conditions. Protect sugarcane and citrus crops from frost damage.");
      advice.push("🔥 Light up smudge pots in citrus orchards during night hours.");
    }
    return advice;
  }, [weather]);

  // Farming alerts
  const generateFarmingAlerts = useCallback((current, forecast) => {
    const newAlerts = [];
    const temp = current.main.temp;
    const humidity = current.main.humidity;
    const windSpeed = current.wind.speed;

    if (temp > 40) {
      newAlerts.push({ type: "warning", icon: "🌡️", title: "Extreme Heat Alert", message: "Extreme heat may damage wheat in grain filling stage. Provide emergency irrigation." });
    } else if (temp < 5) {
      newAlerts.push({ type: "warning", icon: "❄️", title: "Frost Alert", message: "Frost warning. Protect potato, sugarcane and citrus crops immediately." });
    }

    if (humidity > 85) {
      newAlerts.push({ type: "warning", icon: "💧", title: "Disease Risk Alert", message: "High humidity increases blast risk in paddy and rust in wheat. Apply fungicides." });
    }

    if (windSpeed > 15) {
      newAlerts.push({ type: "warning", icon: "💨", title: "Strong Wind Alert", message: "Strong winds may cause lodging in wheat and paddy. Harvest mature crops immediately." });
    }

    const rainForecast = forecast.list.slice(0, 8).some((item) => item.weather[0].main.toLowerCase().includes("rain"));
    if (rainForecast) {
      newAlerts.push({ type: "success", icon: "🌧️", title: "Monsoon Update", message: "Rain expected in 24 hours. Good for kharif sowing. Postpone harvesting." });
    }

    setAlerts(newAlerts);
  }, []);

  // Fetch weather + forecast
  const fetchWeatherData = useCallback(async (cityName) => {
    setError("");
    setLoading(true);
    try {
      const apiKey = "f438baf46e45d28234c799897dc72268";
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},IN&units=metric&appid=${apiKey}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName},IN&units=metric&appid=${apiKey}`)
      ]);
      setWeather(currentResponse.data);
      setForecast(forecastResponse.data);
      generateFarmingAlerts(currentResponse.data, forecastResponse.data);
    } catch (err) {
      setError("Unable to fetch weather data. Please try again.");
      setWeather(null);
      setForecast(null);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [generateFarmingAlerts]);

  useEffect(() => { fetchWeatherData(city); }, []); 

  const getWeatherIcon = useCallback((condition) => {
    const iconMap = { clear: "☀️", clouds: "☁️", rain: "🌧️", drizzle: "🌦️", thunderstorm: "⛈️", snow: "❄️", mist: "🌫️", fog: "🌫️" };
    return iconMap[condition.toLowerCase()] || "🌤️";
  }, []);

  const getDayName = useCallback((timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", { weekday: "short" });
  }, []);

  const getForecastTip = useCallback((day) => {
    const temp = day.main.temp;
    const condition = day.weather[0].main.toLowerCase();
    if (temp < 10) return "❄️ Frost risk. Protect crops from cold.";
    else if (temp > 38) return "🔥 Heatwave alert. Increase irrigation.";
    else if (condition.includes("rain")) return "🌧️ Rain expected. Avoid fertilizer spraying.";
    else if (condition.includes("cloud")) return "☁️ Cloudy. Monitor for fungal diseases.";
    else return "✅ Safe conditions. Good for routine farming.";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  if (loading && !weather) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-4 text-lg dark:text-gray-200">Loading weather data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">🌤️ Weather Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Advanced weather insights for smart farming across Indian states</p>
      </div>

      {/* State + District Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <select value={state} onChange={(e) => { setState(e.target.value); setCity(indiaDistricts[e.target.value][0]); }}
            className="flex-1 border rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200">
            {states.map((st) => <option key={st} value={st}>{st}</option>)}
          </select>

          <select value={city} onChange={(e) => setCity(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200">
            {districts.map((district) => <option key={district} value={district}>{district}</option>)}
          </select>

          <button type="submit" disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </form>
      </div>

      {error && <div className="bg-red-100 dark:bg-red-800 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">{error}</div>}

      {weather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Weather */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 text-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{weather.name}, {state}</h2>
                  <p className="text-green-100">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <div className="text-6xl">{getWeatherIcon(weather.weather[0].main)}</div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</div>
                  <div className="text-green-100 capitalize">{weather.weather[0].description}</div>
                </div>
                <div className="text-right text-sm text-green-100">
                  <div>Feels like {Math.round(weather.main.feels_like)}°C</div>
                  <div>Humidity: {weather.main.humidity}%</div>
                  <div>Wind: {weather.wind.speed} m/s</div>
                </div>
              </div>
            </div>

            {/* Forecast */}
            {forecast && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-gray-100">📅 5-Day Weather Forecast</h3>
                <div className="grid grid-cols-5 gap-4">
                  {forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5).map((day, index) => (
                    <div key={index} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-col justify-between">
                      <div>
                        <div className="font-semibold text-sm dark:text-gray-200">{getDayName(day.dt)}</div>
                        <div className="text-2xl my-2">{getWeatherIcon(day.weather[0].main)}</div>
                        <div className="text-sm font-bold dark:text-gray-100">{Math.round(day.main.temp)}°</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{day.weather[0].description}</div>
                      </div>
                      <div className="mt-2 text-xs text-left p-2 bg-green-50 dark:bg-green-900 rounded border-l-2 border-green-400 dark:border-green-600">
                        {getForecastTip(day)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {alerts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-4 dark:text-gray-100">🚨 Farming Alerts</h3>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div key={index}
                      className={`p-3 rounded-lg border-l-4 ${alert.type === "warning" ? "bg-yellow-50 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600" : "bg-green-50 dark:bg-green-900 border-green-400 dark:border-green-600"}`}>
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{alert.icon}</span>
                        <div>
                          <div className="font-semibold text-sm dark:text-gray-100">{alert.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">{alert.message}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 dark:text-gray-100">💡 Farming Tips</h3>
              <div className="space-y-2">
                {farmingAdvice.map((tip, index) => (
                  <div key={index} className="text-sm p-2 bg-green-50 dark:bg-green-900 rounded border-l-2 border-green-400 dark:border-green-600">
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
