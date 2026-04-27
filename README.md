# FlexGrid-TR

Open-source energy flexibility cockpit for EV charging, flexible building loads, and demand-response analysis.

FlexGrid-TR is a portfolio-grade electrical and electronics engineering project. It models a small facility, simulates flexible load orchestration, compares control strategies, and exports the same scenario data used by the UI as JSON or CSV.

## What is finished in v1

- Dashboard-first operator cockpit
- Facility profiles for apartment blocks, workshops, cafes, and electronics labs
- EV concurrency, tariff plan, control strategy, and storage scenario controls
- Hourly load profile with uncontrolled baseline and transformer limit
- Peak demand, savings, carbon impact, transformer stress, EV energy, and flexible load KPIs
- Strategy comparison table for uncontrolled, tariff-aware, and orchestrated operation
- Recommendation engine for next operational actions
- CSV and JSON export route powered by the same simulation core
- Architecture and roadmap docs
- GitHub Actions CI for typecheck, lint, and build

## Why this project matters

Grid flexibility is becoming more important as EV charging, cooling demand, and distributed resources grow. Small facilities often do not have a practical way to understand how much flexible load they have, when the transformer is stressed, or which control strategy creates measurable value.

FlexGrid-TR fills that gap as a compact engineering demonstrator. It is software-first, but designed to grow into a low-cost hybrid prototype with ESP32 or smart-plug telemetry.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- Scenario simulation engine
- CSV and JSON exports

## Quick start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality commands

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm check
```

## Repository structure

- `app/page.tsx` - public app entry
- `app/api/scenario/route.ts` - scenario JSON and CSV export
- `components/energy` - cockpit UI
- `src/lib/energy/flexgrid.ts` - simulation engine
- `docs/FLEXGRID_TR_ARCHITECTURE.md` - architecture notes
- `docs/FLEXGRID_TR_ROADMAP.md` - project roadmap

## API example

```text
/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4
```

CSV export:

```text
/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4&format=csv
```

## Next hardware phase

The current release is complete as a software MVP. The next phase is to add one real telemetry channel:

- ESP32 or API-enabled smart plug
- HTTP or MQTT ingestion
- Measured vs simulated load comparison
- Event-based demand-response logs

## Suggested GitHub description

Open-source energy flexibility cockpit for EV charging, flexible building loads, and demand-response analytics.

## Suggested topics

`nextjs`, `typescript`, `energy`, `smart-grid`, `demand-response`, `ev-charging`, `power-systems`, `recharts`

## License

MIT
