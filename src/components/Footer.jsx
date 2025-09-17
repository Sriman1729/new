import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Sprout,
  CloudSun,
  CalendarDays,
  BookOpen,
  User,
  Zap,
  Leaf,
  ChevronDown,
} from "lucide-react";

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-gray-900 text-gray-200 mt-10 relative">
      {/* Gradient border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-lime-400 to-green-600"></div>

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Services */}
        <div>
          <button
            className="flex justify-between items-center w-full sm:cursor-default sm:pointer-events-none text-left font-semibold text-lg border-b border-gray-700 pb-2 mb-4 text-green-400"
            onClick={() => toggleSection("services")}
          >
            Services
            <ChevronDown
              className={`w-4 h-4 sm:hidden transition-transform ${
                openSection === "services" ? "rotate-180" : ""
              }`}
            />
          </button>
          <ul
            className={`space-y-2 text-sm transition-all overflow-hidden ${
              openSection === "services" || window.innerWidth >= 640
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {[
              { to: "/", icon: Home, label: "Home" },
              { to: "/crop", icon: Sprout, label: "Crop Recommendation" },
              { to: "/fertilizer", icon: Leaf, label: "Fertilizer Calculator" },
              { to: "/alerts", icon: Zap, label: "Pest Alerts" },
              { to: "/weather", icon: CloudSun, label: "Weather" },
              { to: "/calendar", icon: CalendarDays, label: "Planting Calendar" },
              { to: "/resources", icon: BookOpen, label: "Resources" },
              { to: "/profile", icon: User, label: "Profile" },
            ].map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="flex items-center gap-2 hover:text-green-400 hover:translate-x-1 transition-all duration-200"
                >
                  <Icon size={16} /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <button
            className="flex justify-between items-center w-full sm:cursor-default sm:pointer-events-none text-left font-semibold text-lg border-b border-gray-700 pb-2 mb-4 text-green-400"
            onClick={() => toggleSection("contact")}
          >
            Contact
            <ChevronDown
              className={`w-4 h-4 sm:hidden transition-transform ${
                openSection === "contact" ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`space-y-3 text-sm text-gray-400 transition-all overflow-hidden ${
              openSection === "contact" || window.innerWidth >= 640
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <p>
              📧 Email:{" "}
              <span className="text-gray-300">farmer.assist@example.com</span>
            </p>
            <p>
              📞 Helpline:{" "}
              <a
                href="tel:1800-XXXXX"
                className="text-gray-300 hover:text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              >
                1800-XXXXX
              </a>
            </p>
          </div>
        </div>

        {/* Government Helplines */}
        <div>
          <button
            className="flex justify-between items-center w-full sm:cursor-default sm:pointer-events-none text-left font-semibold text-lg border-b border-gray-700 pb-2 mb-4 text-green-400"
            onClick={() => toggleSection("gov")}
          >
            Government Helplines
            <ChevronDown
              className={`w-4 h-4 sm:hidden transition-transform ${
                openSection === "gov" ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`space-y-4 text-sm text-gray-400 transition-all overflow-hidden ${
              openSection === "gov" || window.innerWidth >= 640
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <p>
              Kisan Call Center:{" "}
              <a
                href="tel:011-23382292"
                className="text-gray-300 hover:text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              >
                011-23382292
              </a>
              <span className="block text-xs text-gray-500 mt-1">
                ⏰ 6AM - 10PM
              </span>
            </p>
            <p>
              Weather Alert:{" "}
              <a
                href="tel:1800-180-1717"
                className="text-gray-300 hover:text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              >
                1800-180-1717
              </a>
              <span className="block text-xs text-gray-500 mt-1">⏰ 24/7</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center text-xs text-gray-500 border-t border-gray-800 py-5">
        © 2025{" "}
        <span className="text-green-400 font-semibold">Farmer Assistant</span> | Empowering Farmers 🌱
      </div>
    </footer>
  );
}
