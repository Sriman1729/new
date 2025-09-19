import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Thermometer, Wind, Droplet, Sunrise, Sunset, AlertTriangle, CloudRain, Sun, Leaf, Siren, Wheat, Cloud, Snowflake, Bell } from "lucide-react";
import indiaDistricts from "../data/indiaDistricts.json"; // Adjust path as needed

// --- Helper File: services/weatherUtils.js ---

const getFarmingAdvice = (weather) => {
    if (!weather) return [];
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const condition = weather.weather[0].main.toLowerCase();
    const advice = [];

    if (temp >= 20 && temp <= 30 && humidity >= 50 && humidity <= 70) advice.push("Ideal conditions for wheat sowing. Plan for October-November planting.");
    if (temp >= 25 && temp <= 35 && condition.includes("clear")) advice.push("Good for paddy transplanting. Ensure adequate water supply.");
    if (condition.includes("rain")) {
        advice.push("Monsoon rains detected. Ideal for kharif sowing and land preparation.");
        advice.push("Reduce irrigation schedule. Monitor for water logging in paddy fields.");
    }
    if (temp > 35) {
        advice.push("High temperature alert. Provide shade to livestock and increase irrigation.");
        advice.push("Consider heat-resistant varieties for cotton and sugarcane crops.");
    }
    if (humidity > 80) {
        advice.push("High humidity may cause blast in paddy. Apply preventive fungicide spray.");
        advice.push("Monitor wheat crops for rust diseases during this weather.");
    }
    if (temp < 15) {
        advice.push("Cold wave conditions. Protect sugarcane and citrus crops from frost damage.");
    }
    if(advice.length === 0) advice.push("Conditions are normal. Continue with routine farm activities.");
    return advice;
};

const generateFarmingAlerts = (current, forecast) => {
    const newAlerts = [];
    if (!current || !forecast) return [];
    const temp = current.main.temp;
    const humidity = current.main.humidity;
    const windSpeed = current.wind.speed;

    if (temp > 40) newAlerts.push({ type: "warning", icon: <Thermometer/>, title: "Extreme Heat Alert", message: "Extreme heat may damage wheat in grain filling stage. Provide emergency irrigation." });
    else if (temp < 5) newAlerts.push({ type: "warning", icon: <Snowflake/>, title: "Frost Alert", message: "Frost warning. Protect potato, sugarcane and citrus crops immediately." });
    if (humidity > 85) newAlerts.push({ type: "warning", icon: <Droplet/>, title: "Disease Risk Alert", message: "High humidity increases blast risk in paddy and rust in wheat." });
    if (windSpeed > 15) newAlerts.push({ type: "warning", icon: <Wind/>, title: "Strong Wind Alert", message: "Strong winds may cause lodging in wheat and paddy crops." });

    const rainForecast = forecast.list.slice(0, 8).some((item) => item.weather[0].main.toLowerCase().includes("rain"));
    if (rainForecast) newAlerts.push({ type: "info", icon: <CloudRain/>, title: "Monsoon Update", message: "Rain expected in 24 hours. Good for kharif sowing. Postpone harvesting." });
    
    return newAlerts;
};

const weatherIcons = {
    Clear: <Sun className="text-yellow-500" />,
    Clouds: <Cloud className="text-gray-500" />,
    Rain: <CloudRain className="text-blue-500" />,
    Drizzle: <CloudRain className="text-blue-300" />,
    Thunderstorm: <CloudRain className="text-gray-700" />, // You might want a specific lightning icon
    Snow: <Snowflake className="text-blue-200" />,
    Mist: <Cloud className="text-gray-400" />,
    Fog: <Cloud className="text-gray-400" />,
};

const getWeatherIcon = (condition) => weatherIcons[condition] || <Sun className="text-yellow-400" />;
const getDayName = (timestamp) => new Date(timestamp * 1000).toLocaleDateString("en-US", { weekday: "short" });


// --- Main Component: WeatherDashboard.js ---

export default function WeatherDashboard() {
  const [location, setLocation] = useState({ state: "Telangana", city: "Hyderabad" });
  const [weatherData, setWeatherData] = useState({ current: null, forecast: null });
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [error, setError] = useState("");

  const farmingAlerts = useMemo(() => weatherData.current ? generateFarmingAlerts(weatherData.current, weatherData.forecast) : [], [weatherData]);
  const farmingAdvice = useMemo(() => weatherData.current ? getFarmingAdvice(weatherData.current) : [], [weatherData.current]);

  const fetchWeatherData = useCallback(async (cityName) => {
    if (!cityName) return;
    setError("");
    setStatus('loading');
    try {
      const apiKey = "f438baf46e45d28234c799897dc72268";
      if (!apiKey) {
          throw new Error("API key is missing. Please add it to your .env.local file.");
      }
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},IN&units=metric&appid=${apiKey}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName},IN&units=metric&appid=${apiKey}`)
      ]);
      setWeatherData({ current: currentResponse.data, forecast: forecastResponse.data });
      setStatus('success');
    } catch (err) {
      setError("Unable to fetch weather data. Please check the location or your API key.");
      setWeatherData({ current: null, forecast: null });
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchWeatherData(location.city);
  }, [fetchWeatherData]);

  const handleLocationSubmit = () => {
    fetchWeatherData(location.city);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Weather Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Advanced Weather Insights for Smart Farming</p>
      </header>

      <LocationSelector
        location={location}
        setLocation={setLocation}
        onSubmit={handleLocationSubmit}
        isLoading={status === 'loading'}
      />

      {status === 'error' && (
        <div className="bg-red-100 dark:bg-red-900/40 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg my-6 flex items-center gap-3">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {status === 'loading' && <WeatherSkeleton />}
      
      {status === 'success' && weatherData.current && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fade-in">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <CurrentWeatherCard weather={weatherData.current} state={location.state} />
            {weatherData.forecast && <ForecastPanel forecast={weatherData.forecast} />}
          </div>
          <aside className="flex flex-col gap-6">
            {farmingAlerts.length > 0 && <AlertsPanel alerts={farmingAlerts} />}
            <FarmingTipsPanel tips={farmingAdvice} />
          </aside>
        </div>
      )}
    </div>
  );
}


// --- Component: components/LocationSelector.js ---

const LocationSelector = ({ location, setLocation, onSubmit, isLoading }) => {
  const states = Object.keys(indiaDistricts);
  const districts = indiaDistricts[location.state] || [];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const firstCity = indiaDistricts[newState]?.[0];
    setLocation({ state: newState, city: firstCity || "" });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
        <select value={location.state} onChange={handleStateChange}
          className="w-full md:w-1/3 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition">
          {states.map((st) => <option key={st} value={st}>{st}</option>)}
        </select>
        <select value={location.city} onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
          className="w-full md:w-1/3 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition">
          {districts.map((district) => <option key={district} value={district}>{district}</option>)}
        </select>
        <button type="submit" disabled={isLoading}
          className="w-full md:w-auto flex-grow bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Loading..." : "Get Weather"}
        </button>
      </form>
    </div>
  );
};


// --- Component: components/CurrentWeatherCard.js ---

const CurrentWeatherCard = ({ weather, state }) => {
  const icon = getWeatherIcon(weather.weather[0].main);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{weather.name}, {state}</h2>
          <p className="text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
      <div className="flex items-end justify-between mt-4">
        <div>
          <div className="text-5xl font-bold text-gray-800 dark:text-gray-100">{Math.round(weather.main.temp)}°C</div>
          <div className="font-semibold capitalize text-gray-600 dark:text-gray-300">{weather.weather[0].description}</div>
        </div>
        <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2"><Thermometer size={16} /> Feels like {Math.round(weather.main.feels_like)}°C</div>
          <div className="flex items-center gap-2"><Droplet size={16} /> Humidity: {weather.main.humidity}%</div>
          <div className="flex items-center gap-2"><Wind size={16} /> Wind: {weather.wind.speed.toFixed(1)} m/s</div>
        </div>
      </div>
      <div className="flex justify-between text-sm mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2"><Sunrise size={20} /> Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="flex items-center gap-2"><Sunset size={20} /> Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    </div>
  );
};


// --- Component: components/ForecastPanel.js ---

const ForecastPanel = ({ forecast }) => {
    const dailyForecast = forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">📅 5-Day Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {dailyForecast.map((day, index) => (
                    <div key={index} className="text-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 flex flex-col items-center">
                        <div className="font-semibold text-sm text-gray-700 dark:text-gray-200">{getDayName(day.dt)}</div>
                        <div className="text-4xl my-2">{getWeatherIcon(day.weather[0].main)}</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-100">{Math.round(day.main.temp)}°</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{day.weather[0].description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Component: components/AlertsPanel.js ---

const AlertsPanel = ({ alerts }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2"><Siren/> Farming Alerts</h3>
        <div className="space-y-3">
            {alerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/40 border-yellow-400' : 'bg-blue-50 dark:bg-blue-900/40 border-blue-400'}`}>
                    <div className="flex items-start gap-3">
                        <span className="text-xl mt-1">{alert.icon}</span>
                        <div>
                            <div className="font-semibold text-sm text-gray-800 dark:text-gray-100">{alert.title}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">{alert.message}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


// --- Component: components/FarmingTipsPanel.js ---

const FarmingTipsPanel = ({ tips }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2"><Leaf/> Farming Tips</h3>
        <ul className="space-y-3">
            {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <Wheat size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    <span>{tip}</span>
                </li>
            ))}
        </ul>
    </div>
);


// --- Component: components/WeatherSkeleton.js ---

const WeatherSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Current Weather Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
                    </div>
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="flex items-end justify-between mt-4">
                    <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
            {/* Forecast Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="h-28 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-28 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-28 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-28 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-28 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                </div>
            </div>
        </div>
        <aside className="flex flex-col gap-6 animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-32"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-48"></div>
        </aside>
    </div>
);
