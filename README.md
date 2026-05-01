# FlexGrid-TR

Hybrid-ready energy flexibility cockpit for EV charging, flexible building loads, and demand-response validation.

FlexGrid-TR is an electrical and electronics engineering portfolio project. It models a small facility, simulates flexible load orchestration, estimates transformer loading, compares control strategies, and validates simulated dispatch against mock or measured telemetry samples.

## What is finished

- Dashboard-first operator cockpit
- Facility profiles for apartment blocks, workshops, cafes, and electronics labs
- EV concurrency, tariff plan, control strategy, storage, and scenario preset controls
- URL-shareable scenarios and local saved scenarios
- Hourly load profile with uncontrolled baseline, telemetry overlay, and transformer limit
- kW, kVA, current, power factor, overload-hour, battery SoC, cost, carbon, and confidence KPIs
- Strategy comparison for uncontrolled, tariff-aware, and orchestrated operation
- JSON and CSV scenario export
- `POST /api/telemetry` measured-vs-simulated comparison API
- Vitest coverage for model, telemetry, CSV, and API behavior
- GitHub Actions CI for test, typecheck, lint, and build

## Why this project matters

EV charging, cooling demand, and small distributed resources make local grid flexibility more valuable. Many small facilities do not have a practical way to estimate transformer stress, flexible load potential, or whether a control strategy will create measurable value.

FlexGrid-TR demonstrates that workflow without requiring physical hardware. It stays software-first for easy GitHub review, but its telemetry contract can be replaced by ESP32, MQTT, or smart-plug data later.

## Turkish summary

FlexGrid-TR; elektrikli araç şarjı, esnek bina yükleri, trafo yüklenmesi ve talep tarafı yönetimi için geliştirilmiş hibrit-hazır bir enerji esnekliği kokpitidir. Fiziksel donanım gerektirmeden çalışır; ancak ileride ESP32 veya akıllı priz verisiyle ölçülen-simüle karşılaştırması yapılabilecek şekilde tasarlanmıştır.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- Vitest
- Scenario simulation engine
- Stateless telemetry comparison API
- CSV and JSON exports

## Quick start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality commands

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm check
```

## API examples

Scenario JSON:

```text
/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4
```

Scenario CSV:

```text
/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4&format=csv
```

Telemetry comparison:

```bash
curl -X POST http://localhost:3000/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "mock",
    "scenario": {
      "siteType": "workshop",
      "strategy": "orchestrated",
      "batteryMode": "small",
      "tariffPlan": "tou",
      "evCount": 4
    }
  }'
```

## Repository structure

- `app/api/scenario/route.ts` - scenario JSON and CSV export
- `app/api/telemetry/route.ts` - telemetry validation and comparison
- `components/energy` - cockpit UI and dashboard panels
- `src/lib/energy/flexgrid.ts` - simulation engine
- `src/lib/energy/telemetry.ts` - measured-vs-simulated comparison core
- `tests` - model, telemetry, CSV, and API tests
- `docs` - architecture, telemetry, validation, API, and roadmap notes
- `docs/PROJECT_BRIEF_TR.md` - Turkish presentation and CV brief
- `docs/HARDWARE_EXTENSION.md` - ESP32/smart-plug extension path

## Suggested GitHub description

Hybrid-ready energy flexibility cockpit for EV charging, transformer loading, demand response, and telemetry validation.

## Suggested topics

`nextjs`, `typescript`, `energy`, `smart-grid`, `demand-response`, `ev-charging`, `power-systems`, `telemetry`, `recharts`

## License

MIT. Copyright (c) 2026 Emre Bulut.
