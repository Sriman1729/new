import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function TrainingPrograms() {
  const programs = [
    {
      title: "Online Training: Impactful AI Tools in Agriculture",
      date: "Sep 15–19, 2025",
      link: "https://naarm.org.in/ongoing-training-programs/",
      provider: "NAARM (ICAR)",
      type: "Online",
    },
    {
      title: "Precision Agriculture Using Drones & Remote Sensing",
      date: "Dec 1–5, 2025",
      link: "https://naarm.org.in/ongoing-training-programs/",
      provider: "NAARM (ICAR)",
      type: "Online",
    },
    {
      title: "30-Day International Training on Natural Farming & AI",
      date: "Aug 16–Sep 16, 2025",
      link: "#",
      provider: "Gujarat Natural Farming Science University / ICAR",
      type: "Offline",
    },
    {
      title: "Organic Farming Certificate Course – 21 Days",
      date: "Ongoing",
      link: "https://nconf.dac.gov.in/21DaysCertificateCourse",
      provider: "NCOF",
      type: "Certification",
    },
    {
      title: "Short-duration Skill Programs via STRY / ATMA",
      date: "Ongoing",
      link: "#",
      provider: "KVKs / ATMA / STRY",
      type: "Skill Program",
    },
    {
      title: "Climate-Smart Agriculture & Water Management",
      date: "Feb 2026",
      link: "https://icar.org.in/",
      provider: "ICAR Institutes & State Agriculture Universities",
      type: "Offline",
    },
    {
      title: "Agri-Entrepreneurship & Rural Innovation Bootcamp",
      date: "Ongoing",
      link: "#",
      provider: "MANAGE (Hyderabad)",
      type: "Online",
    },
    {
      title: "Integrated Pest Management Workshop",
      date: "Nov 10–14, 2025",
      link: "#",
      provider: "State Agriculture Department",
      type: "Offline",
    },
    {
      title: "Digital Farming Tools & eNAM Training",
      date: "Oct 5–9, 2025",
      link: "#",
      provider: "MANAGE / eNAM",
      type: "Online",
    },
  ];

  // Map type to green-themed badge
  const getBadgeClasses = (type) => {
    switch (type.toLowerCase()) {
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "online":
        return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300";
      case "offline":
        return "bg-green-200 text-green-900 dark:bg-green-800/40 dark:text-green-200";
      case "certification":
        return "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300";
      case "skill program":
        return "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">
        🎓 Training Programs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program, idx) => (
          <Card
            key={idx}
            className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800
                       shadow-sm hover:shadow-lg hover:border-l-green-600
                       transition-transform duration-200 ease-in-out hover:scale-[1.02]
                       border-l-4 border-l-green-500"
          >
            <CardContent className="p-5 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  {program.title}
                </h3>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${getBadgeClasses(
                    program.type
                  )}`}
                >
                  {program.type.toLowerCase() === "ongoing" ? "Ongoing" : program.type}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">{program.provider}</p>

              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Calendar size={14} /> {program.date}
              </p>

              <a
                href={program.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline block mt-2"
              >
                Register / Learn More →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
