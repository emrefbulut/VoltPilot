import { describe, expect, it } from "vitest";
import { buildCsv } from "@/src/lib/utils/csv";

describe("CSV utility", () => {
  it("escapes commas, quotes, and newlines", () => {
    const csv = buildCsv(["metric", "value"], [["summary", "Peak, \"critical\"\nwindow"]]);

    expect(csv).toContain('"Peak, ""critical""\nwindow"');
  });
});
