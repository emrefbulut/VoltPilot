export const flexgridCopy = {
  brand: {
    name: "FlexGrid-TR",
    label: "Open-source energy flexibility MVP",
    title: "A simulation-first platform for EV charging, flexible building loads, and demand-response analytics.",
    description:
      "FlexGrid-TR is a portfolio-grade engineering demonstrator built for Turkish buildings and small facilities, combining power-systems thinking, smart-charging scenarios, and decision-support analytics."
  },
  marketSignals: [
    {
      title: "Grid flexibility is no longer optional",
      description:
        "EV adoption, cooling demand, and distributed resources are increasing the need for flexible load coordination and clearer visibility on the demand side."
    },
    {
      title: "There is still a tooling gap",
      description:
        "Small facilities and student teams need practical tools that connect flexible-load logic, reporting, and operations without requiring full utility-scale infrastructure."
    },
    {
      title: "Hardware can come later",
      description:
        "The first release works with realistic simulated profiles, while leaving a clean path toward ESP32 telemetry, smart plugs, and hybrid hardware prototyping."
    }
  ],
  paths: [
    {
      id: "software",
      eyebrow: "Path 01",
      title: "Software-first MVP",
      subtitle: "Fastest route to a strong GitHub showcase",
      description:
        "Start with realistic simulated building profiles, smart-charging scenarios, cost estimates, and a decision-support dashboard. The result is still engineering-focused, not a mock marketing page.",
      budget: "0-1500 TL",
      duration: "2-4 weeks",
      hardware: "Not required",
      output: [
        "Next.js-based public demo surface",
        "Peak reduction and flexible-load simulator",
        "Scenario-ready data model for reporting",
        "README, architecture notes, and demo narrative"
      ]
    },
    {
      id: "hybrid",
      eyebrow: "Path 02",
      title: "Low-cost hybrid prototype",
      subtitle: "More impressive field-facing demonstration",
      description:
        "Build on top of the software MVP with a single real telemetry source. An ESP32 node or API-enabled smart plug can provide live input while the rest of the system stays simulation-driven.",
      budget: "1500-4500 TL",
      duration: "4-8 weeks",
      hardware: "ESP32 + isolated measurement path or smart plug",
      output: [
        "Live telemetry ingestion",
        "Measured vs simulated profile comparison",
        "Peak alerting and orchestration hooks",
        "A demo that visibly connects software to hardware"
      ]
    }
  ],
  phases: [
    {
      week: "Week 1",
      title: "Core model and product framing",
      description:
        "Define building archetypes, flexible-load assumptions, 24-hour demand profiles, KPI structure, and repository layout."
    },
    {
      week: "Week 2",
      title: "Simulator and decision panel",
      description:
        "Add strategy switching, peak-demand analytics, cost estimates, and demand-response readiness scoring."
    },
    {
      week: "Week 3",
      title: "Public documentation layer",
      description:
        "Prepare the README, architecture narrative, interview-ready explanations, and a cleaner public project story."
    },
    {
      week: "Week 4",
      title: "Hybrid extension path",
      description:
        "Optionally add ESP32 telemetry, MQTT or HTTP ingestion, and a first measured-vs-simulated comparison loop."
    }
  ],
  stack: [
    "Next.js App Router",
    "TypeScript",
    "Tailwind CSS",
    "Recharts",
    "Scenario-based simulation engine",
    "Optional ESP32 / MQTT / smart-plug telemetry"
  ],
  repoLayout: [
    "app/page.tsx",
    "components/energy",
    "src/content/flexgrid-copy.ts",
    "app/api/scenario/route.ts"
  ]
} as const;

export type FlexgridPathId = (typeof flexgridCopy.paths)[number]["id"];
