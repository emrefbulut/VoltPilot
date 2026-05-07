import { describe, expect, it } from "vitest";
import { buildFlexgridScenario, defaultFlexgridScenario } from "@/src/lib/energy/flexgrid";
import {
  compareTelemetrySamples,
  generateMockTelemetrySamples,
  parseTelemetryCsv,
  parseTelemetryRequestBody,
  validateTelemetrySamples
} from "@/src/lib/energy/telemetry";

describe("FlexGrid telemetry comparison", () => {
  it("generates a full-day mock telemetry feed", () => {
    const samples = generateMockTelemetrySamples(defaultFlexgridScenario);

    expect(samples).toHaveLength(24);
    expect(samples.every((sample) => sample.measuredKw >= 0)).toBe(true);
  });

  it("compares measured and simulated energy profiles", () => {
    const scenario = buildFlexgridScenario(defaultFlexgridScenario);
    const comparison = compareTelemetrySamples(scenario, generateMockTelemetrySamples(defaultFlexgridScenario));

    expect(comparison.metrics.sampleCount).toBe(24);
    expect(comparison.metrics.maeKw).toBeGreaterThanOrEqual(0);
    expect(comparison.metrics.confidenceScore).toBeGreaterThan(70);
    expect(comparison.samples[0]).toHaveProperty("deltaKw");
  });

  it("rejects invalid telemetry samples", () => {
    const result = validateTelemetrySamples([{ hourIndex: 200, measuredKw: -2 }]);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join(" ")).toContain("hourIndex");
    }
  });

  it("parses mock mode without requiring explicit samples", () => {
    const result = parseTelemetryRequestBody({
      mode: "mock",
      scenario: defaultFlexgridScenario
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.samples).toHaveLength(24);
    }
  });

  it("parses measured telemetry from CSV text", () => {
    const result = parseTelemetryCsv("hourIndex,measuredKw,voltageV,currentA,powerFactor\n0,12.5,400,20,0.9\n1,13.2,400,21,0.9");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.samples).toHaveLength(2);
      expect(result.samples[0]?.measuredKw).toBe(12.5);
    }
  });

  it("supports weekly telemetry sample bounds", () => {
    const samples = generateMockTelemetrySamples({
      ...defaultFlexgridScenario,
      analysisDays: 7
    });

    expect(samples).toHaveLength(168);
    expect(validateTelemetrySamples(samples).ok).toBe(true);
  });
});
