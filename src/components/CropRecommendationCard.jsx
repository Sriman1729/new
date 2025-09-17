import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CropRecommendationCard({ crop }) {
  const [expanded, setExpanded] = useState(false);

  const total = crop.investmentPerAcre + crop.avgProfitPerAcre;
  const investPercent = total ? (crop.investmentPerAcre / total) * 100 : 50;
  const profitPercent = total ? (crop.avgProfitPerAcre / total) * 100 : 50;

  return (
    <Card className="shadow-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
      <CardContent className="p-4 transition-colors duration-300">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 transition-colors duration-300">
              {crop.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize transition-colors duration-300">
              {crop.category}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* Basic Info */}
        <div className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
          <p>
            <strong>Soil:</strong> {crop.soil.join(", ")}
          </p>
          <p>
            <strong>Water Requirement:</strong> {crop.water}
          </p>
          <p>
            <strong>Duration:</strong> {crop.growingDuration} months
          </p>
          <p>
            <strong>Seasons:</strong> {crop.seasons.join(", ")}
          </p>
          <p>
            <strong>Yield:</strong> {crop.avgYieldKgPerAcre} kg/acre
          </p>
          <p>
            <strong>Outcome:</strong> Good market potential
          </p>
          <p>
            <strong>Investment:</strong> ₹
            {crop.investmentPerAcre.toLocaleString()} /acre
          </p>
          <p>
            <strong>Profit:</strong> ₹{crop.avgProfitPerAcre.toLocaleString()}{" "}
            /acre
          </p>

          {/* Investment vs Profit Bar */}
          <div className="mt-2">
            <div className="text-[10px] text-gray-600 dark:text-gray-400 mb-1 flex justify-between w-3/4 transition-colors duration-300">
              <span>Investment</span>
              <span>Profit</span>
            </div>
            <div className="h-2 rounded overflow-hidden flex w-3/4">
              <div
                className="bg-red-500 h-2 transition-all duration-500"
                style={{ width: `${investPercent}%` }}
              />
              <div
                className="bg-green-500 h-2 transition-all duration-500"
                style={{ width: `${profitPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Expandable Section with animation */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="expand"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4 space-y-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors duration-300 overflow-hidden"
            >
              {/* Varieties */}
              {crop.recommendedVarieties?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400 transition-colors duration-300">
                    🌱 Recommended Varieties
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    {crop.recommendedVarieties.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pests */}
              {crop.commonPests?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400 transition-colors duration-300">
                    🐛 Common Pests
                  </h4>
                  {crop.commonPests.map((pest, i) => (
                    <div
                      key={i}
                      className="mb-2 border-l-2 border-red-300 dark:border-red-600 pl-2 transition-colors duration-300"
                    >
                      <p className="font-medium">{pest.name}</p>
                      <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        {pest.impact}
                      </p>
                      <p className="font-semibold mt-1">Control:</p>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {pest.control.map((c, j) => (
                          <li key={j}>{c}</li>
                        ))}
                      </ul>
                      {pest.recommendedPesticides?.length > 0 && (
                        <p className="mt-1">
                          <strong>Pesticides:</strong>{" "}
                          {pest.recommendedPesticides.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Fertilizers */}
              {crop.fertilizers && (
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400 transition-colors duration-300">
                    🧪 Fertilizer Schedule
                  </h4>
                  <p className="font-medium">Basal:</p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    {crop.fertilizers.basal.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <p className="font-medium mt-1">Top Dressing:</p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    {crop.fertilizers.topDressing.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tips */}
              {crop.tips?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400 transition-colors duration-300">
                    💡 Cultivation Tips
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    {crop.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
