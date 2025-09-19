import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { KeyRound, Shield } from 'lucide-react';

const ADMIN_PASSCODE = "8786";

export default function LoginPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === ADMIN_PASSCODE) {
      // Use sessionStorage to ensure it's compatible with the Dashboard's logout function
      sessionStorage.setItem("isAdminAuthenticated", "true"); 
      navigate("/admin");
    } else {
      setError("Incorrect passcode. Please try again.");
      setInput(""); // Clear input on error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="text-3xl font-bold mt-4 text-gray-900 dark:text-gray-100">
            Admin Access Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the password to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200"
            />
          </div>

          {error && (
            <p className="text-sm text-center text-red-500 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 text-white font-semibold bg-green-600 rounded-lg shadow transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

