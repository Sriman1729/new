// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  X,
  Leaf,
  Volume2,
  CloudSun,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Calculator,
  Bug,
  BarChart2,
  Cloud,
  Calendar,
  Users,
  Activity,
  Settings,
  FileText,
} from "lucide-react";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";

const KEY = "f6cea0ca596890d54ef2cf3dde89c6e7";

// 🔊 Speak helper
function speak(text, lang = "en-IN") {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  }
}

export default function Home() {
  // state
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tip, setTip] = useState("");
  const [highlight, setHighlight] = useState("");
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState(new Date());
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      text: "🌧 Heavy rainfall expected — ensure proper drainage.",
      color: "bg-green-200 dark:bg-green-700/60",
    },
    {
      id: 2,
      text: "💧 Govt subsidy announced for drip irrigation.",
      color: "bg-green-100 dark:bg-green-800/60",
    },
  ]);

  const farmerNames = [
    "Annadaata",
    "Kshetrapalaka",
    "Bhoomiputra",
    "Krishika",
    "Jeevanadaata",
  ];

  const tips = [
    "Rotate crops to maintain soil fertility.",
    "Use drip irrigation to save water.",
    "Add compost and manure for healthier soil.",
    "Watch for pests early to avoid crop loss.",
    "Sow seeds in morning/evening to protect from heat.",
  ];

  const highlights = [
    "Paddy demand rising in mandis",
    "Maize prices stable this week",
    "Tomato prices up sharply",
    "Potato supply high — prices falling",
  ];

  // initialize AOS
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  // 🌟 Greeting
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let prefix;
      if (hour < 12) prefix = "🌅 Suprabhaat,";
      else if (hour < 18) prefix = "🌞 Namaskar,";
      else prefix = "🌙 Shubh Sandhya,";

      const randomName =
        farmerNames[Math.floor(Math.random() * farmerNames.length)];

      setGreeting(`${prefix} ${randomName}`);
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ⏰ Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🌦 Weather
  useEffect(() => {
    const fetchWeather = (lat, lon) => {
      setLoading(true);
      setError(false);
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.cod === 200) {
            const w = {
              city: data.name,
              temp: Math.round(data.main.temp),
              condition: data.weather[0].description,
            };
            setWeather(w);

            if (voiceEnabled) {
              speak(
                `Weather update for ${w.city}. Temperature ${w.temp} degrees. Condition: ${w.condition}`
              );
            }
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(17.385, 78.4867) // fallback Hyderabad
      );
    } else {
      fetchWeather(17.385, 78.4867);
    }
  }, [voiceEnabled]);

  // 🌱 Tip + Highlight
  useEffect(() => {
    const updateTipAndHighlight = () => {
      const t = tips[Math.floor(Math.random() * tips.length)];
      const h = highlights[Math.floor(Math.random() * highlights.length)];
      setTip(t);
      setHighlight(h);

      if (voiceEnabled) {
        speak(`Tip of the day: ${t}`);
        speak(`Market highlight: ${h}`);
      }
    };

    updateTipAndHighlight();
    const interval = setInterval(updateTipAndHighlight, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [voiceEnabled]);

  // ⏰ Alerts auto-expire
  useEffect(() => {
    if (alerts.length > 0) {
      const timers = alerts.map((a) => {
        if (voiceEnabled) speak(`Alert: ${a.text}`);
        return setTimeout(() => handleFadeOut(a.id), 10000);
      });
      return () => timers.forEach((t) => clearTimeout(t));
    }
  }, [alerts, voiceEnabled]);

  const handleFadeOut = (id) => {
    const el = document.getElementById(`alert-${id}`);
    if (el) {
      el.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }, 300);
    } else {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <main className="font-sans bg-gray-50 text-green-900 dark:bg-gray-900 dark:text-green-200 transition-colors duration-500">
      <Helmet>
        <title>RaituMitra</title>
        <meta
          name="description"
          content="RaituMitra provides crop recommendations, fertilizer calculations, pest alerts, and market insights for Indian farmers."
        />
      </Helmet>

      {/* Hero */}
      <section
        className="py-20 text-white"
        style={{
          background:
            "linear-gradient(135deg,#4ade80 0%,#16a34a 35%, #0ea5e9 100%)",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-aos="fade-up"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Leaf className="w-8 h-8 text-white" />
            <h1 className="text-3xl md:text-4xl font-extrabold">RaituMitra</h1>
          </div>

          <p className="text-lg md:text-2xl max-w-3xl mx-auto mb-8">
            Smart Crop Advisory System — empowering farmers with AI-driven
            insights for better crop decisions, weather forecasts, and market
            analysis.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/crop"
              className="bg-white text-green-700 dark:bg-gray-800 dark:text-green-200 px-6 py-3 rounded-lg font-semibold shadow hover:shadow-lg transition"
            >
              Crop Advisory
            </Link>
            <Link
              to="/admin"
              className="bg-green-800/90 text-white dark:bg-green-700 dark:hover:bg-green-800 px-6 py-3 rounded-lg font-semibold shadow transition"
            >
              Admin Login
            </Link>
          </div>

          {/* greeting + time card */}
          <div className="mt-8 max-w-3xl mx-auto p-6 bg-white/10 dark:bg-black/30 backdrop-blur rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <div className="text-sm opacity-90">{greeting}</div>
              <div className="text-2xl font-semibold mt-1">
                Your smart farming assistant 🍑
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-sm opacity-80">Local time</div>
              <div className="text-xl font-semibold">
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Portal */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Farmer Portal
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Access crop recommendations, weather updates, and market insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow card-hover transition-all" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BarChart2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Crop Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                AI-powered suggestions for the best crops to plant based on soil and weather.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow card-hover transition-all" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Cloud className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Weather Forecasts</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Accurate 5-day predictions tailored to your location.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow card-hover transition-all" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-yellow-100 dark:bg-yellow-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Market Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Real-time mandi prices and demand forecasts to maximize profit.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow card-hover transition-all" data-aos="fade-up" data-aos-delay="400">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Planting Calendar</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                For Key Activities and Montly Tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Snapshot */}
      <section className="py-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weather */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-600" data-aos="fade-up">
              <div className="flex items-center gap-3 mb-3">
                <CloudSun className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-lg">Weather</h3>
              </div>
              {loading ? (
                <p className="animate-pulse text-gray-500">Loading...</p>
              ) : error ? (
                <p className="text-red-500">Weather unavailable</p>
              ) : weather ? (
                <>
                  <p className="font-semibold">{weather.city}</p>
                  <p className="text-2xl font-bold">{weather.temp}°C</p>
                  <p className="text-gray-600 dark:text-gray-300 capitalize">
                    {weather.condition}
                  </p>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No weather data</p>
              )}
            </div>

            {/* Tip */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-600" data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-lg">Tip of the Day</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{tip}</p>
            </div>

            {/* Highlight */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-600" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-lg">Market Highlight</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{highlight}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alerts */}
      {alerts.length > 0 && (
        <section className="py-6 bg-white dark:bg-gray-800" data-aos="fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-green-50 dark:bg-green-900/50 p-6 rounded-xl shadow border border-green-100 dark:border-green-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-green-600" /> Alerts
                </h3>
              </div>
              <ul className="space-y-3">
                {alerts.map((a) => (
                  <li
                    key={a.id}
                    id={`alert-${a.id}`}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${a.color}`}
                  >
                    <span>{a.text}</span>
                    <button
                      onClick={() => handleFadeOut(a.id)}
                      className="ml-3 text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/crop" className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow flex flex-col items-center gap-3 hover:shadow-lg transition">
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="font-semibold">Crop Recommendations</span>
            </Link>
            <Link to="/market" className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow flex flex-col items-center gap-3 hover:shadow-lg transition">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="font-semibold">Market Prices</span>
            </Link>
            <Link to="/fertilizer" className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow flex flex-col items-center gap-3 hover:shadow-lg transition">
              <Calculator className="w-8 h-8 text-green-600" />
              <span className="font-semibold">Fertilizer Calculator</span>
            </Link>
            <Link to="/alerts" className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow flex flex-col items-center gap-3 hover:shadow-lg transition">
              <Bug className="w-8 h-8 text-green-600" />
              <span className="font-semibold">Pest Alerts</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Portal */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Admin Portal
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage system data, users and content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-red-100 dark:bg-red-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">User Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Manage farmer accounts, permissions and access levels.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-indigo-100 dark:bg-indigo-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">Data Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Dashboards and reports on agricultural trends and usage.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-pink-100 dark:bg-pink-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">System Configuration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Configure algorithms and integrations.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow" data-aos="fade-up" data-aos-delay="400">
              <div className="bg-cyan-100 dark:bg-cyan-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold mb-2">Content Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Update advisories and educational content.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
