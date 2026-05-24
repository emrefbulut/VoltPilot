import { describe, expect, it } from "vitest";
import {
  buildFlexgridScenario,
  calculateTransformerLoadingPct,
  clampFlexgridEvCount,
  defaultFlexgridScenario,
  flexgridSiteProfiles,
  getFlexgridTariffForHour
} from "@/src/lib/energy/flexgrid";

describe("VoltPilot simulation engine", () => {
  it("clamps EV sessions to the supported simulator range", () => {
    expect(clampFlexgridEvCount(-4)).toBe(0);
    expect(clampFlexgridEvCount(4.7)).toBe(5);
    expect(clampFlexgridEvCount(99)).toBe(12);
  });

  it("applies tariff windows consistently", () => {
    const peakHours = flexgridSiteProfiles.workshop.peakHours;

    expect(getFlexgridTariffForHour(20, "tou", peakHours)).toBe(8.1);
    expect(getFlexgridTariffForHour(2, "tou", peakHours)).toBe(4.2);
    expect(getFlexgridTariffForHour(10, "critical", peakHours)).toBe(9.8);
    expect(getFlexgridTariffForHour(10, "flat", peakHours)).toBe(5.9);
  });

  it("calculates transformer loading from kVA limit", () => {
    expect(Math.round(calculateTransformerLoadingPct(35, 70))).toBe(50);
    expect(Math.round(calculateTransformerLoadingPct(77, 70))).toBe(110);
  });

  it("keeps battery state of charge within physical bounds", () => {
    const scenario = buildFlexgridScenario({
      ...defaultFlexgridScenario,
      batteryMode: "medium",
      strategy: "orchestrated"
    });

    expect(scenario.chart.every((point) => point.batterySocPct >= 0 && point.batterySocPct <= 100)).toBe(true);
    expect(scenario.metrics.batterySocMinPct).toBeGreaterThanOrEqual(0);
    expect(scenario.metrics.batterySocFinalPct).toBeLessThanOrEqual(100);
  });

  it("adds engineering metrics without losing the original scenario contract", () => {
    const scenario = buildFlexgridScenario(defaultFlexgridScenario);

    expect(scenario.metrics.peakKw).toBeGreaterThan(0);
    expect(scenario.metrics.peakKva).toBeGreaterThan(scenario.metrics.peakKw);
    expect(scenario.metrics.maxCurrentA).toBeGreaterThan(0);
    expect(scenario.metrics.engineeringConfidence).toBeGreaterThanOrEqual(35);
    expect(scenario.chart).toHaveLength(24);
  });

  it("builds a continuous 7-day analysis horizon", () => {
    const scenario = buildFlexgridScenario({
      ...defaultFlexgridScenario,
      analysisDays: 7
    });

    expect(scenario.chart).toHaveLength(168);
    expect(scenario.metrics.analysisDays).toBe(7);
    expect(scenario.metrics.analysisEnergyKwh).toBeGreaterThan(scenario.metrics.dailyEnergyKwh);
    expect(scenario.chart.at(-1)?.hourIndex).toBe(167);
  });

  it("lets the optimizer reduce peak load compared with uncontrolled operation", () => {
    const uncontrolled = buildFlexgridScenario({
      ...defaultFlexgridScenario,
      strategy: "baseline",
      batteryMode: "medium",
      evCount: 8
    });
    const optimized = buildFlexgridScenario({
      ...defaultFlexgridScenario,
      strategy: "optimizer",
      batteryMode: "medium",
      evCount: 8
    });

    expect(optimized.metrics.peakKw).toBeLessThan(uncontrolled.metrics.peakKw);
    expect(optimized.metrics.engineeringConfidence).toBeGreaterThanOrEqual(uncontrolled.metrics.engineeringConfidence);
  });
});
