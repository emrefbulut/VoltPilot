import { describe, expect, it } from "vitest";
import { GET as getScenario } from "@/app/api/scenario/route";
import { POST as postTelemetry } from "@/app/api/telemetry/route";
import { defaultFlexgridScenario } from "@/src/lib/energy/flexgrid";
import { generateMockTelemetrySamples } from "@/src/lib/energy/telemetry";

describe("FlexGrid API routes", () => {
  it("returns scenario JSON with engineering metrics", async () => {
    const response = await getScenario(
      new Request("http://localhost/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.metrics.peakKva).toBeGreaterThan(0);
    expect(body.metrics.engineeringConfidence).toBeGreaterThan(0);
  });

  it("returns scenario CSV export", async () => {
    const response = await getScenario(new Request("http://localhost/api/scenario?format=csv"));
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/csv");
    expect(text).toContain("engineeringConfidence");
  });

  it("accepts valid telemetry payloads", async () => {
    const response = await postTelemetry(
      new Request("http://localhost/api/telemetry", {
        method: "POST",
        body: JSON.stringify({
          scenario: defaultFlexgridScenario,
          samples: generateMockTelemetrySamples(defaultFlexgridScenario)
        })
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.metrics.sampleCount).toBe(24);
    expect(body.samples).toHaveLength(24);
  });

  it("rejects invalid telemetry payloads with 400", async () => {
    const response = await postTelemetry(
      new Request("http://localhost/api/telemetry", {
        method: "POST",
        body: JSON.stringify({
          scenario: { ...defaultFlexgridScenario, evCount: 99 },
          samples: [{ hourIndex: 40, measuredKw: -1 }]
        })
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid telemetry payload");
    expect(body.errors.length).toBeGreaterThan(0);
  });
});
