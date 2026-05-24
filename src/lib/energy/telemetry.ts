import {
  buildFlexgridScenario,
  calculateFlexgridCurrentA,
  calculateFlexgridKva,
  type FlexgridRecommendation,
  type FlexgridScenario,
  type FlexgridScenarioInput
} from "@/src/lib/energy/flexgrid";
import { parseScenarioInput } from "@/src/lib/energy/scenario-state";

export type FlexgridTelemetryMode = "mock" | "measured";

export type FlexgridTelemetrySample = {
  hourIndex: number;
  measuredKw: number;
  voltageV?: number;
  currentA?: number;
  powerFactor?: number;
};

export type FlexgridTelemetryComparisonPoint = {
  hour: string;
  hourIndex: number;
  simulatedKw: number;
  measuredKw: number;
  deltaKw: number;
  simulatedCurrentA: number;
  measuredCurrentA: number | null;
};

export type FlexgridTelemetryMetrics = {
  sampleCount: number;
  maeKw: number;
  mapePct: number;
  peakErrorKw: number;
  energyDeltaKwh: number;
  confidenceScore: number;
  status: "excellent" | "watch" | "action";
};

export type FlexgridTelemetryComparison = {
  scenario: FlexgridScenario;
  samples: FlexgridTelemetryComparisonPoint[];
  metrics: FlexgridTelemetryMetrics;
  recommendations: FlexgridRecommendation[];
};

export type FlexgridTelemetryRequest = {
  mode?: FlexgridTelemetryMode;
  scenario?: unknown;
  samples?: unknown;
};

export type FlexgridTelemetryCsvParseResult =
  | { ok: true; samples: FlexgridTelemetrySample[]; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

function round(value: number, precision = 1) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeSample(value: unknown, index: number):
  | { ok: true; sample: FlexgridTelemetrySample }
  | { ok: false; error: string } {
  if (!isRecord(value)) {
    return { ok: false, error: `samples[${index}] must be an object` };
  }

  const hourIndex = Number(value.hourIndex);
  const measuredKw = Number(value.measuredKw);
  const voltageV = value.voltageV === undefined ? undefined : Number(value.voltageV);
  const currentA = value.currentA === undefined ? undefined : Number(value.currentA);
  const powerFactor = value.powerFactor === undefined ? undefined : Number(value.powerFactor);

  if (!Number.isInteger(hourIndex) || hourIndex < 0 || hourIndex > 167) {
    return { ok: false, error: `samples[${index}].hourIndex must be an integer from 0 to 167` };
  }

  if (!Number.isFinite(measuredKw) || measuredKw < 0) {
    return { ok: false, error: `samples[${index}].measuredKw must be a non-negative number` };
  }

  if (voltageV !== undefined && (!Number.isFinite(voltageV) || voltageV < 180 || voltageV > 480)) {
    return { ok: false, error: `samples[${index}].voltageV must be between 180 and 480 when provided` };
  }

  if (currentA !== undefined && (!Number.isFinite(currentA) || currentA < 0)) {
    return { ok: false, error: `samples[${index}].currentA must be a non-negative number when provided` };
  }

  if (powerFactor !== undefined && (!Number.isFinite(powerFactor) || powerFactor < 0.5 || powerFactor > 1)) {
    return { ok: false, error: `samples[${index}].powerFactor must be between 0.5 and 1 when provided` };
  }

  return {
    ok: true,
    sample: {
      hourIndex,
      measuredKw,
      voltageV,
      currentA,
      powerFactor
    }
  };
}

export function generateMockTelemetrySamples(input: FlexgridScenarioInput): FlexgridTelemetrySample[] {
  const scenario = buildFlexgridScenario(input);

  return scenario.chart.map((point) => {
    const morningDrift = point.hourIndex >= 7 && point.hourIndex <= 10 ? 0.035 : 0;
    const eveningDrift = point.hourIndex >= 17 && point.hourIndex <= 21 ? -0.025 : 0;
    const sensorRipple = Math.sin(point.hourIndex * 1.7) * 0.018;
    const measuredKw = Math.max(0, point.totalLoadKw * (1 + morningDrift + eveningDrift + sensorRipple));
    const measuredKva = calculateFlexgridKva(measuredKw, scenario.site.powerFactor);

    return {
      hourIndex: point.hourIndex,
      measuredKw: round(measuredKw),
      voltageV: scenario.site.nominalVoltageV,
      currentA: Math.round(calculateFlexgridCurrentA(measuredKva, scenario.site.nominalVoltageV, scenario.site.phaseCount)),
      powerFactor: scenario.site.powerFactor
    };
  });
}

export function validateTelemetrySamples(value: unknown):
  | { ok: true; samples: FlexgridTelemetrySample[] }
  | { ok: false; errors: string[] } {
  if (!Array.isArray(value)) {
    return { ok: false, errors: ["samples must be an array"] };
  }

  if (value.length === 0) {
    return { ok: false, errors: ["samples must contain at least one telemetry sample"] };
  }

  if (value.length > 168) {
    return { ok: false, errors: ["samples cannot contain more than 168 points"] };
  }

  const errors: string[] = [];
  const samples: FlexgridTelemetrySample[] = [];

  value.forEach((item, index) => {
    const result = normalizeSample(item, index);
    if (result.ok) {
      samples.push(result.sample);
    } else {
      errors.push(result.error);
    }
  });

  return errors.length > 0 ? { ok: false, errors } : { ok: true, samples };
}

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === "\"" && quoted && next === "\"") {
      current += "\"";
      index += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current.trim());

  return cells;
}

function normalizeTelemetryHeader(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function parseTelemetryCsv(text: string): FlexgridTelemetryCsvParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return {
      ok: false,
      errors: ["CSV must include a header row and at least one telemetry row"],
      warnings: []
    };
  }

  const headers = splitCsvLine(lines[0]!).map(normalizeTelemetryHeader);
  const hourIndexColumn = headers.findIndex((header) => header === "hourindex" || header === "hour" || header === "index");
  const measuredKwColumn = headers.findIndex((header) => header === "measuredkw" || header === "kw" || header === "loadkw");
  const voltageColumn = headers.findIndex((header) => header === "voltagev" || header === "voltage");
  const currentColumn = headers.findIndex((header) => header === "currenta" || header === "current");
  const powerFactorColumn = headers.findIndex((header) => header === "powerfactor" || header === "pf");

  if (hourIndexColumn === -1 || measuredKwColumn === -1) {
    return {
      ok: false,
      errors: ["CSV headers must include hourIndex and measuredKw columns"],
      warnings: []
    };
  }

  const rawSamples = lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const sample: FlexgridTelemetrySample = {
      hourIndex: Number(cells[hourIndexColumn]),
      measuredKw: Number(cells[measuredKwColumn])
    };

    if (voltageColumn !== -1 && cells[voltageColumn]) {
      sample.voltageV = Number(cells[voltageColumn]);
    }

    if (currentColumn !== -1 && cells[currentColumn]) {
      sample.currentA = Number(cells[currentColumn]);
    }

    if (powerFactorColumn !== -1 && cells[powerFactorColumn]) {
      sample.powerFactor = Number(cells[powerFactorColumn]);
    }

    return sample;
  });
  const validation = validateTelemetrySamples(rawSamples);

  if (!validation.ok) {
    return {
      ok: false,
      errors: validation.errors,
      warnings: []
    };
  }

  const seen = new Set<number>();
  const deduplicated: FlexgridTelemetrySample[] = [];
  const warnings: string[] = [];

  validation.samples.forEach((sample) => {
    if (seen.has(sample.hourIndex)) {
      warnings.push(`Duplicate hourIndex ${sample.hourIndex} was ignored`);
      return;
    }

    seen.add(sample.hourIndex);
    deduplicated.push(sample);
  });

  return {
    ok: true,
    samples: deduplicated.sort((a, b) => a.hourIndex - b.hourIndex),
    warnings
  };
}

function buildTelemetryRecommendations(metrics: FlexgridTelemetryMetrics): FlexgridRecommendation[] {
  const recommendations: FlexgridRecommendation[] = [];

  if (metrics.status === "action") {
    recommendations.push({
      priority: "high",
      title: "Inspect the measured peak deviation",
      detail: "Measured load diverges clearly from the model. Check EV session assumptions and transformer current readings before using the dispatch decision."
    });
  }

  if (metrics.energyDeltaKwh > 8) {
    recommendations.push({
      priority: "medium",
      title: "Calibrate the daily energy baseline",
      detail: "Measured energy is higher than the model. Update the facility base-load profile or add a measured channel for thermal loads."
    });
  }

  if (metrics.status === "excellent") {
    recommendations.push({
      priority: "low",
      title: "Scenario is telemetry-ready",
      detail: "Demo telemetry closely follows the model profile. Use CSV comparison to track measured-versus-modeled channel fit in the report."
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "low",
      title: "Keep collecting samples",
      detail: "The model is usable. More measurement points improve the confidence score and reduce dispatch risk."
    });
  }

  return recommendations.slice(0, 3);
}

export function compareTelemetrySamples(
  scenario: FlexgridScenario,
  telemetrySamples: FlexgridTelemetrySample[]
): FlexgridTelemetryComparison {
  const byHour = new Map(scenario.chart.map((point) => [point.hourIndex, point]));
  const samples = telemetrySamples
    .filter((sample) => byHour.has(sample.hourIndex))
    .map((sample) => {
      const simulated = byHour.get(sample.hourIndex)!;
      const measuredCurrentA =
        sample.currentA ??
        (sample.voltageV && sample.powerFactor
          ? calculateFlexgridCurrentA(calculateFlexgridKva(sample.measuredKw, sample.powerFactor), sample.voltageV, scenario.site.phaseCount)
          : null);

      return {
        hour: simulated.hour,
        hourIndex: sample.hourIndex,
        simulatedKw: simulated.totalLoadKw,
        measuredKw: round(sample.measuredKw),
        deltaKw: round(sample.measuredKw - simulated.totalLoadKw),
        simulatedCurrentA: simulated.estimatedCurrentA,
        measuredCurrentA: measuredCurrentA === null ? null : Math.round(measuredCurrentA)
      };
    });
  const absoluteErrors = samples.map((sample) => Math.abs(sample.deltaKw));
  const maeKw = absoluteErrors.length > 0 ? round(absoluteErrors.reduce((total, value) => total + value, 0) / absoluteErrors.length) : 0;
  const mapePct =
    samples.length > 0
      ? round(
          (samples.reduce((total, sample) => total + Math.abs(sample.deltaKw) / Math.max(sample.simulatedKw, 1), 0) /
            samples.length) *
            100,
          1
        )
      : 0;
  const peakErrorKw =
    samples.length > 0
      ? round(
          Math.max(...samples.map((sample) => sample.measuredKw)) -
            Math.max(...samples.map((sample) => sample.simulatedKw))
        )
      : 0;
  const energyDeltaKwh = round(samples.reduce((total, sample) => total + sample.deltaKw, 0));
  const confidenceScore = Math.min(
    99,
    Math.max(20, Math.round(100 - maeKw * 3.4 - Math.abs(peakErrorKw) * 1.7 - Math.abs(energyDeltaKwh) * 0.45))
  );
  const status = confidenceScore >= 86 ? "excellent" : confidenceScore >= 70 ? "watch" : "action";
  const metrics: FlexgridTelemetryMetrics = {
    sampleCount: samples.length,
    maeKw,
    mapePct,
    peakErrorKw,
    energyDeltaKwh,
    confidenceScore,
    status
  };

  return {
    scenario,
    samples,
    metrics,
    recommendations: buildTelemetryRecommendations(metrics)
  };
}

export function parseTelemetryRequestBody(body: unknown):
  | { ok: true; scenarioInput: FlexgridScenarioInput; samples: FlexgridTelemetrySample[]; mode: FlexgridTelemetryMode }
  | { ok: false; errors: string[] } {
  if (!isRecord(body)) {
    return { ok: false, errors: ["request body must be a JSON object"] };
  }

  const mode = body.mode === undefined ? "measured" : body.mode;
  if (mode !== "mock" && mode !== "measured") {
    return { ok: false, errors: ["mode must be mock or measured"] };
  }

  const scenarioResult = parseScenarioInput(body.scenario);
  if (!scenarioResult.ok) {
    return { ok: false, errors: scenarioResult.errors };
  }

  if (mode === "mock" && body.samples === undefined) {
    return {
      ok: true,
      scenarioInput: scenarioResult.input,
      samples: generateMockTelemetrySamples(scenarioResult.input),
      mode
    };
  }

  const samplesResult = validateTelemetrySamples(body.samples);
  if (!samplesResult.ok) {
    return { ok: false, errors: samplesResult.errors };
  }

  return {
    ok: true,
    scenarioInput: scenarioResult.input,
    samples: samplesResult.samples,
    mode
  };
}
