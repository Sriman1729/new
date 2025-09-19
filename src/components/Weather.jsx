import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Thermometer,
  Wind,
  Droplet,
  Sunrise,
  Sunset,
  AlertTriangle,
  CloudRain,
  Sun,
  Leaf,
  Siren,
  Wheat,
  Cloud,
  Snowflake,
} from "lucide-react";
import indiaDistricts from "../data/indiaDistricts.json"; // adjust path

// --- Helper Functions ---
const getFarmingAdvice = (weather) => {
  if (!weather) return [];
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const condition = weather.weather[0].main.toLowerCase();
  const advice = [];

  if (temp >= 20 && temp <= 30 && humidity >= 50 && humidity <= 70)
    advice.push("Ideal for wheat sowing.");
  if (temp >= 25 && temp <= 35 && condition.includes("clear"))
    advice.push("Good for paddy transplanting.");
  if (condition.includes("rain")) advice.push("Rainy – reduce irrigation.");
  if (temp > 35) advice.push("High temp – provide shade & irrigation.");
  if (humidity > 80) advice.push("High humidity – monitor for fungal diseases.");
  if (temp < 15) advice.push("Cold wave – protect crops from frost.");
  if (advice.length === 0) advice.push("Normal conditions today.");

  return advice;
};

const generateFarmingAlerts = (current, forecast) => {
  const newAlerts = [];
  if (!current || !forecast) return [];

  const temp = current.main.temp;
  const humidity = current.main.humidity;
  const windSpeed = current.wind.speed;

  if (temp > 40)
    newAlerts.push({
      type: "warning",
      icon: <Thermometer />,
      title: "Extreme Heat",
      message: "Provide emergency irrigation.",
    });
  else if (temp < 5)
    newAlerts.push({
      type: "warning",
      icon: <Snowflake />,
      title: "Frost Alert",
      message: "Protect potato and citrus crops.",
    });
  if (humidity > 85)
    newAlerts.push({
      type: "warning",
      icon: <Droplet />,
      title: "Disease Risk",
      message: "High humidity favors fungal infections.",
    });
  if (windSpeed > 15)
    newAlerts.push({
      type: "warning",
      icon: <Wind />,
      title: "Strong Winds",
      message: "May cause lodging in wheat/paddy.",
    });

  const rainForecast = forecast.list
    .slice(0, 8)
    .some((item) => item.weather[0].main.toLowerCase().includes("rain"));
  if (rainForecast)
    newAlerts.push({
      type: "info",
      icon: <CloudRain />,
      title: "Rain Expected",
      message: "Good for kharif sowing. Delay harvesting.",
    });

  return newAlerts;
};

const weatherIcons = {
  Clear: <Sun className="text-yellow-500" />,
  Clouds: <Cloud className="text-gray-500" />,
  Rain: <CloudRain className="text-blue-500" />,
  Drizzle: <CloudRain className="text-blue-300" />,
  Thunderstorm: <CloudRain className="text-gray-700" />,
  Snow: <Snowflake className="text-blue-200" />,
  Mist: <Cloud className="text-gray-400" />,
  Fog: <Cloud className="text-gray-400" />,
};
const getWeatherIcon = (condition) =>
  weatherIcons[condition] || <Sun className="text-yellow-400" />;
const getDayName = (timestamp) =>
  new Date(timestamp * 1000).toLocaleDateString("en-US", { weekday: "short" });

// --- Main Component ---
export default function WeatherDashboard() {
  const [location, setLocation] = useState({
    state: "Telangana",
    city: "Hyderabad",
  });
  const [weatherData, setWeatherData] = useState({
    current: null,
    forecast: null,
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const farmingAlerts = useMemo(
    () =>
      weatherData.current
        ? generateFarmingAlerts(weatherData.current, weatherData.forecast)
        : [],
    [weatherData]
  );
  const farmingAdvice = useMemo(
    () => (weatherData.current ? getFarmingAdvice(weatherData.current) : []),
    [weatherData.current]
  );

  const fetchWeatherData = useCallback(async (cityName) => {
    if (!cityName) return;
    setError("");
    setStatus("loading");
    try {
      const apiKey = "f438baf46e45d28234c799897dc72268"; // replace with env
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName},IN&units=metric&appid=${apiKey}`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},IN&units=metric&appid=${apiKey}`
        ),
      ]);
      setWeatherData({
        current: currentResponse.data,
        forecast: forecastResponse.data,
      });
      setStatus("success");
    } catch (err) {
      setError("Unable to fetch weather data.");
      setWeatherData({ current: null, forecast: null });
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchWeatherData(location.city);
  }, [fetchWeatherData]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Weather Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Advanced Weather Insights for Smart Farming
        </p>
      </header>

      <LocationSelector
        location={location}
        setLocation={setLocation}
        onSubmit={() => fetchWeatherData(location.city)}
        isLoading={status === "loading"}
      />

      {status === "error" && (
        <div className="bg-red-100 dark:bg-red-900/40 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg my-6 flex items-center gap-3">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {status === "loading" && <WeatherSkeleton />}

      {status === "success" && weatherData.current && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fade-in">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <CurrentWeatherCard weather={weatherData.current} state={location.state} />
            {weatherData.forecast && <ForecastPanel forecast={weatherData.forecast} />}
          </div>
          <aside className="flex flex-col gap-6">
            {farmingAlerts.length > 0 && <AlertsPanel alerts={farmingAlerts} />}
            <FarmingTipsPanel tips={farmingAdvice} />
            <SoilMoistureBar /> {/* 🌱 moved here */}
          </aside>
        </div>
      )}
    </div>
  );
}

// --- Subcomponents ---
const LocationSelector = ({ location, setLocation, onSubmit, isLoading }) => {
  const states = Object.keys(indiaDistricts);
  const districts = indiaDistricts[location.state] || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col md:flex-row gap-4 items-center"
      >
        <select
          value={location.state}
          onChange={(e) =>
            setLocation({
              state: e.target.value,
              city: indiaDistricts[e.target.value]?.[0] || "",
            })
          }
          className="w-full md:w-1/3 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200"
        >
          {states.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
        <select
          value={location.city}
          onChange={(e) => setLocation((prev) => ({ ...prev, city: e.target.value }))}
          className="w-full md:w-1/3 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200"
        >
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Get Weather"}
        </button>
      </form>
    </div>
  );
};

const CurrentWeatherCard = ({ weather, state }) => {
  const icon = getWeatherIcon(weather.weather[0].main);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {weather.name}, {state}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
      <div className="flex items-end justify-between mt-4">
        <div>
          <div className="text-5xl font-bold text-gray-800 dark:text-gray-100">
            {Math.round(weather.main.temp)}°C
          </div>
          <div className="capitalize text-gray-600 dark:text-gray-300">
            {weather.weather[0].description}
          </div>
        </div>
        <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Thermometer size={16} /> Feels {Math.round(weather.main.feels_like)}°C
          </div>
          <div className="flex items-center gap-2">
            <Droplet size={16} /> Humidity {weather.main.humidity}%
          </div>
          <div className="flex items-center gap-2">
            <Wind size={16} /> Wind {weather.wind.speed.toFixed(1)} m/s
          </div>
        </div>
      </div>
      <div className="flex justify-between text-sm mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <Sunrise size={20} />{" "}
          {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div className="flex items-center gap-2">
          <Sunset size={20} />{" "}
          {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

const ForecastPanel = ({ forecast }) => {
  const dailyForecast = forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        📅 5-Day Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {dailyForecast.map((day, index) => {
          const tips = getFarmingAdvice({
            main: { temp: day.main.temp, humidity: day.main.humidity },
            weather: [{ main: day.weather[0].main }],
          });
          return (
            <div
              key={index}
              className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 flex flex-col items-center text-center"
            >
              <div className="font-semibold text-sm">
                {getDayName(day.dt)}
              </div>
              <div className="text-3xl my-2">
                {getWeatherIcon(day.weather[0].main)}
              </div>
              <div className="text-lg font-bold">
                {Math.round(day.main.temp)}°
              </div>
              <div className="text-xs capitalize text-gray-500 dark:text-gray-400">
                {day.weather[0].description}
              </div>
              {/* 🌱 One Tip */}
              <div className="mt-2 text-xs italic text-green-700 dark:text-green-300">
                {tips[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AlertsPanel = ({ alerts }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
      <Siren /> Farming Alerts
    </h3>
    <div className="space-y-3">
      {alerts.map((a, i) => (
        <div
          key={i}
          className={`p-3 rounded-lg border-l-4 ${
            a.type === "warning"
              ? "bg-yellow-50 dark:bg-yellow-900/40 border-yellow-400"
              : "bg-blue-50 dark:bg-blue-900/40 border-blue-400"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{a.icon}</span>
            <div>
              <div className="font-semibold text-sm">{a.title}</div>
              <div className="text-xs">{a.message}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FarmingTipsPanel = ({ tips }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
      <Leaf /> Farming Tips
    </h3>
    <ul>
      {tips.slice(0, 1).map((tip, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
        >
          <Wheat size={16} className="text-green-600 mt-1" />
          <span>{tip}</span>
        </li>
      ))}
    </ul>
  </div>
);

const SoilMoistureBar = () => {
  const [moisture, setMoisture] = useState(55);
  useEffect(() => {
    const id = setInterval(
      () => setMoisture((m) => Math.max(20, Math.min(90, m + (Math.random() * 10 - 5)))),
      5000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">🌱 Soil Moisture</h3>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all ${
            moisture > 70
              ? "bg-green-500"
              : moisture > 40
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${moisture}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm">Current soil moisture: <b>{moisture}%</b></p>
    </div>
  );
};

const WeatherSkeleton = () => (
  <div className="animate-pulse space-y-6 mt-6">
    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </div>
);
