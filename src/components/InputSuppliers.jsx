import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function InputSuppliers() {
  const suppliers = {
    seeds: [
      {
        name: "Green Seeds Pvt Ltd",
        type: "Hybrid & Organic Seeds",
        contact: "9123456780",
      },
      {
        name: "AgriSeed Distributors",
        type: "Vegetable & Field Crop Seeds",
        contact: "9876501234",
      },
      {
        name: "National Seed Corporation",
        type: "Certified Seeds (Govt. of India)",
        contact: "1800-180-1551",
      },
    ],
    fertilizer: [
      {
        name: "Agro Fertilizer Store",
        type: "Fertilizers & Pesticides",
        contact: "9876543210",
      },
      {
        name: "IFFCO Fertilizer Dealer",
        type: "Urea, DAP, Complex Fertilizers",
        contact: "1800-180-1551",
      },
      {
        name: "Krishi Chemicals",
        type: "Bio-Fertilizers & Plant Growth Regulators",
        contact: "9988665544",
      },
    ],
    machinery: [
      {
        name: "FarmTech Equipment",
        type: "Tractors & Farm Implements",
        contact: "9988776655",
      },
      {
        name: "Mahindra Agro Machinery",
        type: "Harvesters, Tillers & Sprayers",
        contact: "9876001122",
      },
      {
        name: "Tata Agrico",
        type: "Hand Tools & Power Tools",
        contact: "9123005678",
      },
    ],
  };

  const sectionTitles = {
    seeds: "🌱 Seeds Suppliers",
    fertilizer: "🌾 Fertilizers & Agro Chemicals",
    machinery: "🚜 Machinery & Equipment",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📚 Input Suppliers</h2>

      {Object.keys(suppliers).map((sectionKey) => (
        <div key={sectionKey} className="mb-10">
          <h3 className="text-xl font-semibold mb-4">{sectionTitles[sectionKey]}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers[sectionKey].map((item, idx) => (
              <Card
                key={idx}
                className="bg-white dark:bg-neutral-900 rounded-lg 
                           border border-neutral-200 dark:border-neutral-800 
                           shadow-sm hover:shadow-md 
                           border-l-4 border-l-orange-500 
                           transition"
              >
                <CardContent className="p-5 space-y-2">
                  <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.type}</p>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    📞{" "}
                    <a
                      href={`tel:${item.contact}`}
                      className="hover:underline underline-offset-4"
                    >
                      {item.contact}
                    </a>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
