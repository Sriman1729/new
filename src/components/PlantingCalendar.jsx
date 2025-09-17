import React, { useState, useRef } from "react";
import farmingCalendars from "../data/plantingcalendardata/farmingData";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function Calendar() {
  const [selectedRegion, setSelectedRegion] = useState("North");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [search, setSearch] = useState("");
  const [compareRegion, setCompareRegion] = useState(null);

  const pdfRef = useRef(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = farmingCalendars[selectedRegion][selectedMonth];
  const compareMonth = compareRegion
    ? farmingCalendars[compareRegion][selectedMonth]
    : null;

  const getSeasonProgress = (month, overview) => {
    const monthMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    const parseSeason = (range) => {
      const [start, end] = range.split("-");
      return [monthMap[start.slice(0, 3)], monthMap[end.slice(0, 3)]];
    };

    const progress = { Kharif: 0, Rabi: 0, Zaid: 0 };

    Object.keys(overview).forEach(season => {
      const [start, end] = parseSeason(overview[season]);
      if (start <= end) {
        if (month >= start && month <= end) {
          const total = end - start + 1;
          const idx = month - start;
          progress[season] = ((idx + 1) / total) * 100;
        }
      } else {
        // Wrap-around for seasons crossing year boundary
        if (month >= start || month <= end) {
          const total = (end + 12) - start + 1;
          const idx = month >= start ? month - start + 1 : month + 12 - start + 1;
          progress[season] = (idx / total) * 100;
        }
      }
    });

    return progress;
  };

  const exportStyledPDF = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);

    if (pdfHeight > pdf.internal.pageSize.getHeight()) {
      let heightLeft = pdfHeight;
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
    }

    pdf.save(`farming-${selectedRegion}-${months[selectedMonth]}.pdf`);
  };

  const filterData = (data) => {
    if (!search) return data;
    return {
      ...data,
      activities: data.activities.filter((a) =>
        a.toLowerCase().includes(search.toLowerCase())
      ),
      crops: data.crops.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
      ),
    };
  };

  const filteredCurrent = filterData(currentMonth);
  const filteredCompare = compareMonth ? filterData(compareMonth) : null;

  const renderRegionCard = (region, monthData) => (
    <div className="bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold">{months[selectedMonth]}</h2>
        <span className="bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 px-3 py-1 rounded-full text-sm font-medium">
          {monthData.season}
        </span>
      </div>

      {/* Activities */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">🚜 Key Activities</h3>
        <div className="space-y-2">
          {monthData.activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
              <div className="text-sm">{activity}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Crops */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">🌾 Recommended Crops</h3>
        <div className="flex flex-wrap gap-2">
          {monthData.crops.map((crop, index) => (
            <span
              key={index}
              className="bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 px-3 py-1 rounded-full text-sm"
            >
              {crop}
            </span>
          ))}
        </div>
      </div>

      {/* Weather */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">🌤️ Weather Conditions</h3>
        <p className="bg-green-50 dark:bg-green-900 text-green-900 dark:text-green-100 p-3 rounded-lg">
          {monthData.weather}
        </p>
      </div>

      {/* Fertilizer */}
      <div>
        <h3 className="text-lg font-semibold mb-3">🌿 Fertilizer Application</h3>
        <ul className="list-disc pl-6 text-sm space-y-1">
          {monthData.fertilizer.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div ref={pdfRef} className="max-w-6xl mx-auto p-6 bg-background text-foreground">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          🗓️ Farming Calendar - {selectedRegion} India
        </h1>
        <p className="text-lg text-muted-foreground">
          Your complete guide to seasonal farming activities
        </p>
      </div>

      {/* PDF Export Button */}
      <div className="flex mb-6 justify-center">
        <button
          onClick={exportStyledPDF}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:opacity-90"
        >
          📄 Export PDF
        </button>
      </div>

      {/* Region Selector */}
      <div className="bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-lg shadow-lg p-4 mb-6 flex justify-center gap-4 flex-wrap">
        {["North", "South", "East", "West"].map((region) => (
          <button
            key={region}
            onClick={() => {
              setSelectedRegion(region);
              setCompareRegion(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedRegion === region
                ? "bg-green-600 text-white"
                : "bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 hover:bg-green-500"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Month Selection */}
      <div className="bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {months.map((month, index) => (
            <button
              key={index}
              onClick={() => setSelectedMonth(index)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                selectedMonth === index
                  ? "bg-green-600 text-white"
                  : "bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 hover:bg-green-500"
              }`}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search crops or activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border rounded-lg"
        />
      </div>

      {/* Comparison Toggle */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["North", "South", "East", "West"].filter(r => r !== selectedRegion).map(r => (
          <button
            key={r}
            onClick={() => setCompareRegion(compareRegion === r ? null : r)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              compareRegion === r
                ? "bg-green-600 text-white"
                : "bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 hover:bg-green-500"
            }`}
          >
            Compare with {r}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className={`grid gap-6 ${compareRegion ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
        <div className={compareRegion ? "col-span-1" : "lg:col-span-2"}>
          {renderRegionCard(selectedRegion, filteredCurrent)}
        </div>

        {compareRegion && <div>{renderRegionCard(compareRegion, filteredCompare)}</div>}

        {/* Sidebar (only when not comparing) */}
        {!compareRegion && (
          <div>
            {/* Monthly Tips */}
            <div className="bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">💡 Monthly Tips</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg border-l-4 border-green-400 dark:border-green-600">
                  <div className="text-sm font-medium">Soil Care</div>
                  <div className="text-xs text-green-800 dark:text-green-100">
                    {selectedMonth < 3 || selectedMonth > 9
                      ? "Apply organic manure and compost"
                      : "Focus on drainage and weed control"}
                  </div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg border-l-4 border-green-500 dark:border-green-700">
                  <div className="text-sm font-medium">Water Management</div>
                  <div className="text-xs text-green-800 dark:text-green-100">
                    {selectedMonth >= 6 && selectedMonth <= 8
                      ? "Ensure proper drainage during monsoon"
                      : "Plan irrigation schedule carefully"}
                  </div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg border-l-4 border-green-600 dark:border-green-500">
                  <div className="text-sm font-medium">Pest Control</div>
                  <div className="text-xs text-green-800 dark:text-green-100">
                    {selectedMonth >= 6 && selectedMonth <= 9
                      ? "High pest activity, monitor closely"
                      : "Preventive measures recommended"}
                  </div>
                </div>
              </div>
            </div>

            {/* Seasonal Overview */}
            <div className="bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">📊 Seasonal Overview</h3>
              {(() => {
                const progress = getSeasonProgress(selectedMonth, currentMonth.seasonalOverview);
                return (
                  <div className="space-y-4">
                    {Object.entries(progress).map(([season, value]) => {
                      const color =
                        season === "Kharif" ? "bg-green-500" :
                        season === "Rabi"   ? "bg-green-600" :
                                              "bg-green-400";
                      return (
                        <div key={season}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{season} Season</span>
                            <span className="text-green-800 dark:text-green-100">
                              {currentMonth.seasonalOverview[season]}
                            </span>
                          </div>
                          <div className="w-full bg-green-200 dark:bg-green-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${color}`}
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Pest Management */}
            <div className="bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">🐛 Pest Management</h3>
              <ul className="list-disc pl-6 text-sm space-y-1">
                {currentMonth.pest.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
