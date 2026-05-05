import { describe, expect, it } from "vitest";
import {
  buildDemoGridSignal,
  flexgridGridProviders,
  isFlexgridGridProvider,
  normalizeGridSignalInput
} from "@/src/lib/energy/grid-signal";

describe("FlexGrid public grid signal", () => {
  it("builds a deterministic 24-hour virtual grid profile", () => {
    const signal = buildDemoGridSignal({ provider: "demo", date: "2026-05-06" });

    expect(signal.points).toHaveLength(24);
    expect(signal.summary.peakLoadMw).toBeGreaterThan(30_000);
    expect(signal.summary.averagePriceTlMwh).toBeGreaterThan(1_000);
    expect(signal.summary.carbonIntensityGco2Kwh).toBeGreaterThan(250);
  });

  it("normalizes invalid provider and date input safely", () => {
    const input = normalizeGridSignalInput({ provider: "unknown", date: "not-a-date" });

    expect(input.provider).toBe("demo");
    expect(input.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("marks external providers as fallback until credentials are configured", () => {
    const signal = buildDemoGridSignal({ provider: "epias", date: "2026-05-06" });

    expect(signal.provider).toBe("epias");
    expect(signal.status).toBe("fallback");
    expect(signal.integrationNotes.join(" ")).toContain("sanal yedek");
  });

  it("keeps the provider allow-list explicit", () => {
    expect(flexgridGridProviders.map((provider) => provider.id)).toEqual([
      "demo",
      "epias",
      "entsoe",
      "electricity-maps",
      "ember"
    ]);
    expect(isFlexgridGridProvider("ember")).toBe(true);
    expect(isFlexgridGridProvider("invalid")).toBe(false);
  });
});
