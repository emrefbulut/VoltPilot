export const flexgridCopy = {
  brand: {
    name: "FlexGrid-TR",
    label: "Open-source energy flexibility MVP",
    title: "Energy flexibility cockpit for EV charging, flexible building loads, and demand-response analysis.",
    description:
      "FlexGrid-TR is a portfolio-grade engineering demonstrator for Turkish buildings and small facilities."
  },
  phases: [
    {
      week: "Phase 1",
      title: "Software simulator",
      description:
        "A complete software-first model with facility profiles, EV demand, tariff plans, storage support, and exportable scenario data."
    },
    {
      week: "Phase 2",
      title: "Decision layer",
      description:
        "Peak reduction, monthly savings, carbon impact, transformer stress, and strategy recommendations in one cockpit."
    },
    {
      week: "Phase 3",
      title: "Public package",
      description:
        "GitHub-ready README, architecture notes, roadmap, MIT license, and CI workflow for first public release."
    },
    {
      week: "Phase 4",
      title: "Hardware extension",
      description:
        "A clean path toward ESP32, smart-plug telemetry, MQTT or HTTP ingestion, and measured vs simulated comparison."
    }
  ],
  stack: [
    "Next.js App Router",
    "TypeScript",
    "Tailwind CSS",
    "Recharts",
    "Scenario simulation engine",
    "CSV and JSON exports",
    "Optional ESP32 / MQTT / smart-plug telemetry"
  ]
} as const;
