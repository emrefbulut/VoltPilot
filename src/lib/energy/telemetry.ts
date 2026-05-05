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
    return { ok: false, error: `samples[${index}] bir nesne olmalı` };
  }

  const hourIndex = Number(value.hourIndex);
  const measuredKw = Number(value.measuredKw);
  const voltageV = value.voltageV === undefined ? undefined : Number(value.voltageV);
  const currentA = value.currentA === undefined ? undefined : Number(value.currentA);
  const powerFactor = value.powerFactor === undefined ? undefined : Number(value.powerFactor);

  if (!Number.isInteger(hourIndex) || hourIndex < 0 || hourIndex > 23) {
    return { ok: false, error: `samples[${index}].hourIndex 0 ile 23 arasında tam sayı olmalı` };
  }

  if (!Number.isFinite(measuredKw) || measuredKw < 0) {
    return { ok: false, error: `samples[${index}].measuredKw negatif olmayan sayı olmalı` };
  }

  if (voltageV !== undefined && (!Number.isFinite(voltageV) || voltageV < 180 || voltageV > 480)) {
    return { ok: false, error: `samples[${index}].voltageV girildiyse 180 ile 480 arasında olmalı` };
  }

  if (currentA !== undefined && (!Number.isFinite(currentA) || currentA < 0)) {
    return { ok: false, error: `samples[${index}].currentA girildiyse negatif olmayan sayı olmalı` };
  }

  if (powerFactor !== undefined && (!Number.isFinite(powerFactor) || powerFactor < 0.5 || powerFactor > 1)) {
    return { ok: false, error: `samples[${index}].powerFactor girildiyse 0.5 ile 1 arasında olmalı` };
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
    return { ok: false, errors: ["samples bir dizi olmalı"] };
  }

  if (value.length === 0) {
    return { ok: false, errors: ["samples en az bir telemetri örneği içermeli"] };
  }

  if (value.length > 96) {
    return { ok: false, errors: ["samples 96 noktadan fazla olamaz"] };
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

function buildTelemetryRecommendations(metrics: FlexgridTelemetryMetrics): FlexgridRecommendation[] {
  const recommendations: FlexgridRecommendation[] = [];

  if (metrics.status === "action") {
    recommendations.push({
      priority: "high",
      title: "Ölçülen pik farkını incele",
      detail: "Ölçülen yük simülasyondan belirgin sapıyor. Dağıtım kararlarına güvenmeden önce EV oturum varsayımlarını ve trafo akım okumalarını yeniden kontrol et."
    });
  }

  if (metrics.energyDeltaKwh > 8) {
    recommendations.push({
      priority: "medium",
      title: "Günlük enerji bazını kalibre et",
      detail: "Ölçülen enerji simüle edilenden yüksek. Tesis baz yük profilini güncelle veya termal yükler için ölçülen kanal ekle."
    });
  }

  if (metrics.status === "excellent") {
    recommendations.push({
      priority: "low",
      title: "Senaryo telemetriye hazır",
      detail: "Mock telemetri simüle edilen profili yeterince yakından izliyor; ileride bir kanal ESP32 veya smart-plug ölçümüyle değiştirilebilir."
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "low",
      title: "Örnek toplamaya devam et",
      detail: "Model kullanılabilir durumda; daha fazla ölçüm noktası güveni artırır ve dağıtım riskini azaltır."
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
    return { ok: false, errors: ["request body JSON nesnesi olmalı"] };
  }

  const mode = body.mode === undefined ? "measured" : body.mode;
  if (mode !== "mock" && mode !== "measured") {
    return { ok: false, errors: ["mode mock veya measured olmalı"] };
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
