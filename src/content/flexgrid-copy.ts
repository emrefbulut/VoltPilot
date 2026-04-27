export const flexgridCopy = {
  brand: {
    name: "FlexGrid-TR",
    label: "Hybrid-ready energy flexibility cockpit",
    title: "Hybrid-ready energy flexibility cockpit for EV charging, transformer loading, and telemetry validation.",
    description:
      "FlexGrid-TR is a portfolio-grade engineering demonstrator for Turkish buildings and small facilities."
  },
  phases: [
    {
      week: "Phase 1",
      title: "Simulation engine",
      description:
        "Facility profiles, EV demand, tariff plans, battery SoC, kVA loading, current estimates, and exportable scenario data."
    },
    {
      week: "Phase 2",
      title: "Decision cockpit",
      description:
        "Peak reduction, monthly savings, carbon impact, transformer stress, engineering confidence, and strategy recommendations."
    },
    {
      week: "Phase 3",
      title: "Telemetry validation",
      description:
        "Mock or measured samples are compared against the simulated profile through a stateless POST API."
    },
    {
      week: "Phase 4",
      title: "Public package",
      description:
        "README, architecture, telemetry, validation notes, API examples, MIT license, tests, and CI workflow."
    }
  ],
  stack: [
    "Next.js App Router",
    "TypeScript",
    "Tailwind CSS",
    "Recharts",
    "Vitest",
    "Scenario simulation engine",
    "Telemetry comparison API",
    "CSV and JSON exports",
    "Optional ESP32 / MQTT / smart-plug telemetry"
  ]
} as const;
