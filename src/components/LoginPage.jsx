// src/components/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
  const navigate = useNavigate();
  const CORRECT_PASS = "8786"; // your admin passcode

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === CORRECT_PASS) {
      localStorage.setItem("isAdmin", "true"); // ✅ store admin flag
      navigate("/admin", { replace: true }); // redirect
    } else {
      alert("Incorrect passcode");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow"
      >
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter passcode"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
