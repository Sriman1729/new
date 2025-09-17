import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import CropRecommendation from "./components/CropRecommendation";
import Weather from "./components/Weather";
import PlantingCalendar from "./components/PlantingCalendar";
import Resources from "./components/Resources";
import Profile from "./components/Profile";
import MarketInsights from "./components/MarketInsights";
import FertilizerCalculator from "./components/FertilizerCalculator"; 
import PestAlerts from "./components/PestAlerts"; // 🐛 NEW
import { DarkModeProvider } from "./context/DarkModeContext";
import PageTransition from "./components/PageTransition"; 

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Oops! Page not found.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        Back to Home
      </a>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  // 🔹 Remove Google Translate junk
  useEffect(() => {
    const removeTranslateBar = () => {
      const bar = document.querySelector("body > .skiptranslate");
      if (bar) bar.remove();

      const gadget = document.querySelector(".goog-te-gadget");
      if (gadget) gadget.remove();

      const combo = document.querySelector(".goog-te-combo");
      if (combo) combo.remove();

      document.body.style.top = "0px";
    };

    let attempts = 0;
    const interval = setInterval(() => {
      removeTranslateBar();
      attempts++;
      if (attempts > 20) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <DarkModeProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition type="fade">
                    <Home />
                  </PageTransition>
                }
              />
              <Route
                path="/crop"
                element={
                  <PageTransition type="fade">
                    <CropRecommendation />
                  </PageTransition>
                }
              />
              <Route
                path="/weather"
                element={
                  <PageTransition type="fade">
                    <Weather />
                  </PageTransition>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PageTransition type="fade">
                    <PlantingCalendar />
                  </PageTransition>
                }
              />
              <Route
                path="/resources"
                element={
                  <PageTransition type="fade">
                    <Resources />
                  </PageTransition>
                }
              />
              <Route
                path="/profile"
                element={
                  <PageTransition type="fade">
                    <Profile />
                  </PageTransition>
                }
              />
              <Route
                path="/market"
                element={
                  <PageTransition type="fade">
                    <MarketInsights />
                  </PageTransition>
                }
              />
              <Route
                path="/fertilizer"
                element={
                  <PageTransition type="fade">
                    <FertilizerCalculator />
                  </PageTransition>
                }
              />
              <Route
                path="/alerts" // 🐛 NEW ROUTE
                element={
                  <PageTransition type="fade">
                    <PestAlerts />
                  </PageTransition>
                }
              />

              {/* 404 fallback */}
              <Route
                path="*"
                element={
                  <PageTransition type="fade">
                    <NotFound />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </DarkModeProvider>
  );
}
