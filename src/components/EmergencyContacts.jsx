import React from "react";
import { Phone } from "lucide-react";

export default function EmergencyContacts() {
  const contacts = {
    agriculture: [
      {
        title: "Kisan Call Center (KCC)",
        number: "1800-180-1551",
        desc: "General agricultural advice & guidance for farmers across India.",
        availability: "6 AM – 10 PM",
      },
      {
        title: "Agriculture Helpline (Central)",
        number: "1800-180-1551",
        desc: "Crop-specific queries and technical help.",
        availability: "Office hours (regional timings may vary)",
      },
      {
        title: "PM-KISAN Helpline",
        number: "155261",
        desc: "Support for PM-KISAN scheme and farmer registration issues.",
        availability: "Office hours",
      },
    ],
    weather: [
      {
        title: "IMD Weather Alert",
        number: "1800-180-1717",
        desc: "Severe weather warnings & district-level forecasts.",
        availability: "Available 24/7",
      },
      {
        title: "Disaster Management Helpline (NDMA)",
        number: "1078",
        desc: "Emergency support during floods, droughts, and disasters.",
        availability: "Available 24/7",
      },
    ],
    livestock: [
      {
        title: "Animal Husbandry Helpline",
        number: "1800-180-7676",
        desc: "Veterinary emergencies & livestock-related support.",
        availability: "Timings may vary (regional)",
      },
      {
        title: "Veterinary Helpline",
        number: "1962",
        desc: "Immediate veterinary assistance for farmers.",
        availability: "Available 24/7",
      },
      {
        title: "Poultry & Dairy Support",
        number: "1800-180-1551",
        desc: "Specialized support for dairy & poultry farmers.",
        availability: "Office hours",
      },
    ],
  };

  const sectionTitles = {
    agriculture: "🌾 Agriculture",
    weather: "🌦️ Weather",
    livestock: "🐄 Livestock & Veterinary",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">🚨 Emergency Contacts</h2>

      {Object.keys(contacts).map((sectionKey) => (
        <div key={sectionKey} className="mb-10">
          <h3 className="text-xl font-semibold mb-4">{sectionTitles[sectionKey]}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts[sectionKey].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-neutral-900 rounded-lg p-5 
                           border border-neutral-200 dark:border-neutral-800 
                           shadow-sm hover:shadow-md 
                           border-l-4 border-l-red-500 transition"
              >
                <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  {item.desc}
                </p>

                <a
                  href={`tel:${item.number}`}
                  className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1 hover:underline"
                >
                  <Phone size={14} /> {item.number}
                </a>

                <p className="text-[11px] text-neutral-500 mt-1">
                  ⏰ {item.availability}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Note at the bottom */}
      <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">
        ⚠️ Note: Helpline availability and timings may vary by region. In case of
        emergencies, please contact your nearest local authority or district
        agriculture/veterinary office if these numbers are not reachable.
      </p>
    </div>
  );
}
