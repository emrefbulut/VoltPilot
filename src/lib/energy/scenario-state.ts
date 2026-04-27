import {
  clampFlexgridEvCount,
  defaultFlexgridScenario,
  isFlexgridBatteryMode,
  isFlexgridSiteType,
  isFlexgridStrategy,
  isFlexgridTariffPlan,
  type FlexgridScenarioInput
} from "@/src/lib/energy/flexgrid";

export const FLEXGRID_SCENARIO_STORAGE_KEY = "flexgrid-tr:v1:scenarios";

export type SavedFlexgridScenario = {
  id: string;
  label: string;
  createdAt: string;
  input: FlexgridScenarioInput;
};

export type FlexgridScenarioPreset = {
  id: string;
  label: string;
  description: string;
  input: FlexgridScenarioInput;
};

export const flexgridScenarioPresets: FlexgridScenarioPreset[] = [
  {
    id: "workshop-peak-shave",
    label: "Workshop peak shave",
    description: "Small industrial site with orchestrated EV and battery support.",
    input: {
      siteType: "workshop",
      strategy: "orchestrated",
      batteryMode: "medium",
      tariffPlan: "critical",
      evCount: 6
    }
  },
  {
    id: "cafe-tou",
    label: "Cafe TOU response",
    description: "Commercial evening peak with tariff-aware shifting.",
    input: {
      siteType: "cafe",
      strategy: "tou",
      batteryMode: "small",
      tariffPlan: "tou",
      evCount: 3
    }
  },
  {
    id: "lab-telemetry",
    label: "Electronics lab telemetry",
    description: "University lab profile prepared for measured vs simulated validation.",
    input: {
      siteType: "lab",
      strategy: "orchestrated",
      batteryMode: "small",
      tariffPlan: "tou",
      evCount: 4
    }
  }
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createScenarioSearchParams(input: FlexgridScenarioInput) {
  return new URLSearchParams({
    siteType: input.siteType,
    strategy: input.strategy,
    batteryMode: input.batteryMode,
    tariffPlan: input.tariffPlan,
    evCount: String(input.evCount)
  });
}

export function parseScenarioSearchParams(params: URLSearchParams): FlexgridScenarioInput {
  const siteTypeParam = params.get("siteType");
  const strategyParam = params.get("strategy");
  const batteryModeParam = params.get("batteryMode");
  const tariffPlanParam = params.get("tariffPlan");
  const evCountParam = Number(params.get("evCount"));

  return {
    siteType: isFlexgridSiteType(siteTypeParam) ? siteTypeParam : defaultFlexgridScenario.siteType,
    strategy: isFlexgridStrategy(strategyParam) ? strategyParam : defaultFlexgridScenario.strategy,
    batteryMode: isFlexgridBatteryMode(batteryModeParam) ? batteryModeParam : defaultFlexgridScenario.batteryMode,
    tariffPlan: isFlexgridTariffPlan(tariffPlanParam) ? tariffPlanParam : defaultFlexgridScenario.tariffPlan,
    evCount: clampFlexgridEvCount(evCountParam)
  };
}

export function parseScenarioInput(value: unknown):
  | { ok: true; input: FlexgridScenarioInput }
  | { ok: false; errors: string[] } {
  if (!isRecord(value)) {
    return { ok: false, errors: ["scenario must be an object"] };
  }

  const errors: string[] = [];
  const siteType = typeof value.siteType === "string" && isFlexgridSiteType(value.siteType) ? value.siteType : null;
  const strategy = typeof value.strategy === "string" && isFlexgridStrategy(value.strategy) ? value.strategy : null;
  const batteryMode =
    typeof value.batteryMode === "string" && isFlexgridBatteryMode(value.batteryMode) ? value.batteryMode : null;
  const tariffPlan =
    typeof value.tariffPlan === "string" && isFlexgridTariffPlan(value.tariffPlan) ? value.tariffPlan : null;
  const evCount = typeof value.evCount === "number" ? value.evCount : Number(value.evCount);

  if (!siteType) errors.push("scenario.siteType must be apartment, workshop, cafe, or lab");
  if (!strategy) errors.push("scenario.strategy must be baseline, tou, or orchestrated");
  if (!batteryMode) errors.push("scenario.batteryMode must be none, small, or medium");
  if (!tariffPlan) errors.push("scenario.tariffPlan must be flat, tou, or critical");
  if (!Number.isFinite(evCount) || evCount < 0 || evCount > 12) errors.push("scenario.evCount must be a number from 0 to 12");

  if (errors.length > 0 || !siteType || !strategy || !batteryMode || !tariffPlan) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    input: {
      siteType,
      strategy,
      batteryMode,
      tariffPlan,
      evCount: clampFlexgridEvCount(evCount)
    }
  };
}
