import React, { useState } from "react";
import {
  User,
  Edit,
  Save,
  Settings,
  Bell,
  Bookmark,
  BookOpen,
  MapPin,
  Droplets,
  TestTube2,
  AlertCircle,
} from "lucide-react";
import indiaDistricts from "../data/indiaDistricts.json"; // adjust path

export default function Profile() {
  // Load profile
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem("profileData");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Sri",
          state: "Telangana",
          district: "Sangareddy",
          farmSize: "12",
        };
  });

  // Load preferences
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("preferences");
    return saved
      ? JSON.parse(saved)
      : {
          soilType: "Loamy",
          waterSources: ["Borewell/Tubewell", "Canal Irrigation"],
        };
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPrefs, setIsEditingPrefs] = useState(false);
  const [tempProfile, setTempProfile] = useState(profileData);
  const [tempPrefs, setTempPrefs] = useState(preferences);

  const states = Object.keys(indiaDistricts);
  const districts = indiaDistricts[tempProfile.state] || [];

  // --- Dynamic Notifications ---
  const generateNotifications = (profile) => {
    const { state, district } = profile;

    const weatherAdvisories = [
      `🌧️ Rain expected in ${district}, ${state} over the next 48 hours.`,
      `☀️ Heatwave alert in ${district}, ${state}. Ensure irrigation.`,
      `❄️ Cold wave conditions likely in ${district}, ${state}.`,
      `⚠️ Flood alert issued near ${district}, ${state}.`,
    ];

    const seasonalReminders = [
      `🌱 Ideal sowing window for Rabi crops in ${district}.`,
      `🌾 Time to prepare fields for Kharif season in ${state}.`,
      `🐛 Pest alert: Monitor for stem borer in ${district}.`,
    ];

    const govtUpdates = [
      `✅ New subsidy for solar water pumps in ${state}.`,
      `📢 MSP revision announced for wheat in ${district}.`,
      `💡 Training camp on organic farming in ${district}, ${state}.`,
    ];

    return [
      {
        type: "warning",
        text: weatherAdvisories[Math.floor(Math.random() * weatherAdvisories.length)],
      },
      {
        type: "info",
        text: seasonalReminders[Math.floor(Math.random() * seasonalReminders.length)],
      },
      {
        type: "success",
        text: govtUpdates[Math.floor(Math.random() * govtUpdates.length)],
      },
    ];
  };

  const [notifications, setNotifications] = useState(generateNotifications(profileData));

  // Save profile
  const saveProfile = () => {
    setProfileData(tempProfile);
    localStorage.setItem("profileData", JSON.stringify(tempProfile));
    setIsEditingProfile(false);
    setNotifications(generateNotifications(tempProfile)); // refresh alerts
  };

  // Save preferences
  const savePrefs = () => {
    setPreferences(tempPrefs);
    localStorage.setItem("preferences", JSON.stringify(tempPrefs));
    setIsEditingPrefs(false);
  };

  // Mock saved data
  const savedCrops = [
    { id: "wheat", name: "Wheat", icon: "🌾" },
    { id: "potato", name: "Potatoes", icon: "🥔" },
    { id: "kinnow", name: "Kinnow", icon: "🍊" },
  ];
  const savedResources = [
    { title: "Punjab State Subsidy on Agricultural Machinery" },
    { title: "Krishi Vigyan Kendra (KVK) Locations" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 dark:text-green-400 flex items-center justify-center gap-3">
            <User className="text-green-600 w-8 h-8" /> My Profile Dashboard
          </h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
            Manage your farm’s details to receive tailored recommendations.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Details */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-green-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <User /> User Profile
                </h2>
                {!isEditingProfile ? (
                  <button
                    onClick={() => {
                      setTempProfile(profileData);
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                  >
                    <Edit size={16} /> Edit
                  </button>
                ) : (
                  <button
                    onClick={saveProfile}
                    className="flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
                  >
                    <Save size={16} /> Save
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <div className="space-y-3">
                  {/* Name */}
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Full Name"
                  />

                  {/* State + District */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600">State</label>
                      <select
                        value={tempProfile.state}
                        onChange={(e) =>
                          setTempProfile({ ...tempProfile, state: e.target.value, district: "" })
                        }
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        {states.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">District</label>
                      <select
                        value={tempProfile.district}
                        onChange={(e) => setTempProfile({ ...tempProfile, district: e.target.value })}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        {districts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Farm Size */}
                  <input
                    type="number"
                    value={tempProfile.farmSize}
                    onChange={(e) => setTempProfile({ ...tempProfile, farmSize: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Farm Size"
                  />
                </div>
              ) : (
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>Name:</strong> {profileData.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" /> {profileData.district},{" "}
                    {profileData.state}
                  </p>
                  <p>
                    <strong>Farm Size:</strong> {profileData.farmSize} acres
                  </p>
                </div>
              )}
            </div>

            {/* Farm Preferences */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-blue-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Settings /> My Farm Preferences
                </h2>
                {!isEditingPrefs ? (
                  <button
                    onClick={() => {
                      setTempPrefs(preferences);
                      setIsEditingPrefs(true);
                    }}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                  >
                    <Edit size={16} /> Edit
                  </button>
                ) : (
                  <button
                    onClick={savePrefs}
                    className="flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
                  >
                    <Save size={16} /> Save
                  </button>
                )}
              </div>

              {isEditingPrefs ? (
                <div className="space-y-4">
                  {/* Soil Type */}
                  <div>
                    <label className="text-sm text-gray-600">Soil Type</label>
                    <select
                      value={tempPrefs.soilType}
                      onChange={(e) => setTempPrefs({ ...tempPrefs, soilType: e.target.value })}
                      className="w-full p-2 border rounded-md mt-1"
                    >
                      <option>Alluvial</option>
                      <option>Loamy</option>
                      <option>Sandy</option>
                      <option>Clayey</option>
                    </select>
                  </div>

                  {/* Water Sources */}
                  <div>
                    <label className="text-sm text-gray-600">Water Sources</label>
                    <div className="mt-2 space-y-1">
                      {["Borewell/Tubewell", "Canal Irrigation", "Rainwater Harvesting", "Tank/Pond"].map(
                        (source) => (
                          <label key={source} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={tempPrefs.waterSources.includes(source)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setTempPrefs({
                                    ...tempPrefs,
                                    waterSources: [...tempPrefs.waterSources, source],
                                  });
                                } else {
                                  setTempPrefs({
                                    ...tempPrefs,
                                    waterSources: tempPrefs.waterSources.filter((s) => s !== source),
                                  });
                                }
                              }}
                            />
                            {source}
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p className="flex items-center gap-2">
                    <TestTube2 size={16} className="text-gray-500" /> {preferences.soilType}
                  </p>
                  <p className="flex items-center gap-2">
                    <Droplets size={16} className="text-gray-500" />{" "}
                    {preferences.waterSources.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Dynamic Notifications */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-orange-500">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <Bell /> Alerts & Notifications
              </h2>
              <div className="space-y-3">
                {notifications.map((note, index) => (
                  <div
                    key={index}
                    className={`text-sm p-3 bg-gray-50 dark:bg-neutral-800 border-l-4 rounded-r-md flex items-start gap-2 ${
                      note.type === "warning"
                        ? "border-yellow-500"
                        : note.type === "success"
                        ? "border-green-500"
                        : "border-blue-500"
                    }`}
                  >
                    <AlertCircle
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        note.type === "warning"
                          ? "text-yellow-500"
                          : note.type === "success"
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                    />
                    <span>{note.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Items */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-purple-500">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <Bookmark /> My Saved Items
              </h2>
              <div>
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                  Saved Crops
                </h3>
                <ul className="space-y-1">
                  {savedCrops.map((crop) => (
                    <li key={crop.id} className="text-sm flex items-center gap-2">
                      {crop.icon} {crop.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">
                  Saved Resources
                </h3>
                <ul className="space-y-1">
                  {savedResources.map((res) => (
                    <li
                      key={res.title}
                      className="text-sm flex items-center gap-2 text-gray-600 dark:text-gray-300"
                    >
                      <BookOpen size={14} /> {res.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
