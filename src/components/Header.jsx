// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Sun, Moon, Menu, X, Globe, Sprout, Bell, Trash2 } from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";
import axios from "axios";

// Utility to load Google Translate script once
const loadGoogleTranslate = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.translate) {
      resolve();
      return;
    }

    const existingScript = document.getElementById("google-translate-script");
    if (existingScript) {
      existingScript.addEventListener("load", resolve);
      return;
    }

    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
};

export default function Header() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [searchLang, setSearchLang] = useState("");
  const [bannerActive, setBannerActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Crop Advisory", to: "/crop" },
    { name: "Weather", to: "/weather" },
    { name: "Calendar", to: "/calendar" },
    { name: "Resources", to: "/resources" },
    { name: "Market Insights", to: "/market" },
  ];

  const groupedLanguages = {
    English: [{ code: "en", label: "English" }],
    "North Indian": [
      { code: "hi", label: "हिंदी" },
      { code: "pa", label: "ਪੰਜਾਬੀ" },
      { code: "ur", label: "اردو" },
      { code: "ks", label: "कश्मीरी" },
      { code: "mai", label: "मैथिली" },
      { code: "bho", label: "भोजपुरी" },
      { code: "doi", label: "डोगरी" },
    ],
    "East Indian": [
      { code: "bn", label: "বাংলা" },
      { code: "or", label: "ଓଡ଼ିଆ" },
      { code: "as", label: "অসমীয়া" },
      { code: "mni", label: "মেইতেই লোন" },
      { code: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ" },
      { code: "ne", label: "नेपाली" },
    ],
    "West Indian": [
      { code: "gu", label: "ગુજરાતી" },
      { code: "mr", label: "मराठी" },
      { code: "kok", label: "कोंकणी" },
      { code: "sd", label: "سنڌي" },
    ],
    "South Indian": [
      { code: "te", label: "తెలుగు" },
      { code: "ta", label: "தமிழ்" },
      { code: "kn", label: "ಕನ್ನಡ" },
      { code: "ml", label: "മലയാളം" },
      { code: "tcy", label: "ತುಳು" },
      { code: "sa", label: "संस्कृत" },
    ],
  };

  // Load Google Translate once
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };

    loadGoogleTranslate().then(() => {
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();

        const savedLang = getCookie("googtrans")?.split("/").pop();
        if (savedLang && savedLang !== "en") {
          setTimeout(() => handleTranslate(savedLang), 600);
        }
      }
    });
  }, []);

  // Observe banner (to shift UI down)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const banner = document.querySelector(".goog-te-banner-frame");
      setBannerActive(!!banner);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Cookie helpers
  const setCookie = (name, value, days, domain) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    let cookie = name + "=" + (value || "") + expires + "; path=/";
    if (domain) cookie += "; domain=" + domain;
    document.cookie = cookie;
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const handleTranslate = (lang) => {
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
      setCookie("googtrans", `/en/${lang}`, 365);
      setShowLang(false);
      return;
    }
    setCookie("googtrans", `/en/${lang}`, 365);
    setTimeout(() => window.location.reload(), 200);
  };

  // --- Notifications SSE setup ---
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await axios.get("https://new-gsp1.onrender.com/notifications");
        setNotifications(Array.isArray(res.data) ? res.data.slice().reverse() : []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchInitial();

    const eventSource = new EventSource("https://new-gsp1.onrender.com/stream");
    eventSource.onmessage = (e) => {
      const notif = JSON.parse(e.data);
      setNotifications((prev) => [notif, ...prev]);
    };
    return () => eventSource.close();
  }, []);

  const handleDeleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    const prev = [...notifications];
    setNotifications(prev.filter((n) => n.id !== id));
    try {
      await axios.delete(`https://new-gsp1.onrender.com/notifications/${id}`);
    } catch (err) {
      console.error(err);
      setNotifications(prev);
      alert("Failed to delete notification on server.");
    }
  };

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />

      <div
        style={{ paddingTop: bannerActive ? "40px" : "0px" }}
        className="transition-all duration-500 ease-in-out"
      >
        <header className="sticky top-0 z-50 backdrop-blur-sm bg-gray-50/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-500">
          <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2 group">
              <Leaf className="w-7 h-7 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-extrabold tracking-tight">RaituMitra</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-2 py-1 rounded-md transition-colors duration-300
                      ${
                        isActive
                          ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 font-semibold"
                          : "hover:text-green-600 dark:hover:text-green-400"
                      }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute inset-0 rounded-md ring-2 ring-green-500/40 pointer-events-none" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Language */}
              <div className="relative">
                <button
                  onClick={() => setShowLang((s) => !s)}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Choose language"
                >
                  <Globe className="w-5 h-5 text-green-600" />
                </button>

                {showLang && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto"
                  >
                    {/* Search Bar */}
                    <div className="p-2 sticky top-0 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                      <input
                        type="text"
                        placeholder="Search language…"
                        value={searchLang}
                        onChange={(e) => setSearchLang(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {Object.entries(groupedLanguages).map(([group, langs]) => {
                      const q = searchLang.trim().toLowerCase();
                      const filtered = q
                        ? langs.filter(
                            (lang) =>
                              lang.label.toLowerCase().includes(q) ||
                              lang.code.toLowerCase().includes(q)
                          )
                        : langs;

                      if (filtered.length === 0) return null;

                      return (
                        <div key={group}>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                            {group}
                          </div>
                          {filtered.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => handleTranslate(lang.code)}
                              title={`Code: ${lang.code}`}
                              className="w-full px-4 py-2 text-left hover:bg-green-200 dark:hover:bg-green-700 transition"
                            >
                              {lang.label}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotif((s) => !s)}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-green-600" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
                    {notifications.length === 0 && (
                      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    )}
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex justify-between items-start px-4 py-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <div className="text-sm">{notif.message}</div>
                        <button
                          onClick={() => handleDeleteNotification(notif.id)}
                          className="ml-2 text-red-500 hover:text-red-700 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition ring-1 ring-gray-300/50 hover:ring-gray-500/60"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-green-600" />
                )}
              </button>

              {/* Profile */}
              <Link
                to="/profile"
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition
                  ${
                    location.pathname === "/profile"
                      ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 ring-2 ring-green-500/40"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                <Sprout className="w-4 h-4 text-green-600" />
                <span>Profile</span>
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenu((s) => !s)}
                className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                aria-label="Toggle menu"
              >
                {mobileMenu ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileMenu && (
            <div className="md:hidden bg-gray-50 dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenu(false)}
                    className={`block py-2 px-3 rounded-md text-sm transition
                      ${
                        isActive
                          ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 font-semibold"
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}
        </header>
      </div>
    </>
  );
}
