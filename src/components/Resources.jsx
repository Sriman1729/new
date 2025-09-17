import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sprout,
  Wrench,
  BookOpen,
  GraduationCap,
  Phone,
} from "lucide-react";

// Import subcomponents
import GovernmentSchemes from "./GovernmentSchemes";
import TechnicalSupport from "./TechnicalSupport";
import InputSuppliers from "./InputSuppliers";
import TrainingPrograms from "./TrainingPrograms";
import EmergencyContacts from "./EmergencyContacts";

export default function Resources() {
  const tabs = [
    { value: "schemes", label: "Schemes", icon: Sprout },
    { value: "support", label: "Support", icon: Wrench },
    { value: "suppliers", label: "Suppliers", icon: BookOpen },
    { value: "training", label: "Training", icon: GraduationCap },
    { value: "contacts", label: "Contacts", icon: Phone },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 dark:text-green-400">
          🌿 Farming Resources Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
          One-stop guide to agricultural resources — explore schemes,
          training, support programs, and emergency help.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="schemes" className="w-full">
        {/* Tabs List */}
        <TabsList className="flex flex-wrap gap-2 justify-center bg-transparent">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="
                flex items-center gap-1.5 px-4 py-2 rounded-full
                text-sm font-medium text-green-700 dark:text-green-400
                bg-transparent dark:bg-transparent
                hover:bg-green-100 dark:hover:bg-green-800
                hover:scale-105 transition-transform
                data-[state=active]:bg-green-600 data-[state=active]:text-white
                data-[state=active]:shadow-md
              "
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        <div className="mt-6">
          <TabsContent value="schemes">
            <GovernmentSchemes />
          </TabsContent>

          <TabsContent value="support">
            <TechnicalSupport />
          </TabsContent>

          <TabsContent value="suppliers">
            <InputSuppliers />
          </TabsContent>

          <TabsContent value="training">
            <TrainingPrograms />
          </TabsContent>

          <TabsContent value="contacts">
            <EmergencyContacts />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
