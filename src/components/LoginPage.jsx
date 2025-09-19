// src/components/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
  const navigate = useNavigate();
  const CORRECT_PASS = "8786"; // your admin passcode

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === CORRECT_PASS) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin", { replace: true });
    } else {
      alert("Incorrect passcode");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20 flex flex-col items-center gap-6"
      >
        <Lock className="w-12 h-12 text-green-600 mb-4 animate-bounce" />
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Admin Login
        </h2>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter passcode"
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Login
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
          Enter your secure passcode to access the admin portal
        </p>
      </form>
    </div>
  );
}
