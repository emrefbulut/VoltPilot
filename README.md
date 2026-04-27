# FlexGrid-TR

Open-source energy flexibility MVP for Turkish buildings, small facilities, and student-led power systems experimentation.

FlexGrid-TR demonstrates how EV charging, HVAC-style flexible loads, and building consumption can be orchestrated in a single decision surface. The current MVP focuses on demand-response readiness, peak reduction visibility, and exportable scenario analysis without requiring hardware on day one.

## Why this project matters

- Grid flexibility is becoming a first-order problem as EV adoption, cooling demand, and distributed energy resources increase.
- Small buildings and facilities still lack practical tools that explain demand-response value in an understandable way.
- Engineering students often build either pure dashboards or pure hardware demos. This project deliberately sits in the middle: power systems logic, product thinking, and extensible telemetry.

## Current MVP

- Interactive simulation for building type, EV concurrency, control strategy, and battery support
- Scenario-based KPIs including peak demand, peak reduction, monthly cost estimate, shifted energy share, and demand-response readiness
- CSV export route powered by the same simulation core used by the UI
- Architecture and roadmap documentation designed for GitHub presentation, CV use, and technical interviews

## Product angle

FlexGrid-TR is designed as a portfolio-grade engineering demonstrator:

- Software-only MVP first
- Low-cost hybrid hardware path second
- Turkish market framing with globally understandable architecture

This makes it strong for GitHub, internship applications, project showcases, and future expansion into real telemetry.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- Simple scenario engine for flexible-load and EV-charging analysis

## Quick start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Available scripts

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`

## Repository structure

- `app/page.tsx` - public project landing page
- `app/api/scenario/route.ts` - JSON and CSV scenario export
- `components/energy` - product surface and interactive simulator
- `src/lib/energy/flexgrid.ts` - simulation core and scenario model
- `docs/FLEXGRID_TR_ARCHITECTURE.md` - architecture notes
- `docs/FLEXGRID_TR_ROADMAP.md` - delivery roadmap

## Roadmap

### Phase 1

- Software-only simulator
- Decision-support KPIs
- GitHub-ready documentation

### Phase 2

- ESP32 or smart-plug telemetry ingestion
- Real vs simulated profile comparison
- Event-based demand-response logic

### Phase 3

- ENVER-style reporting outputs
- Device-level orchestration logic
- Time-series persistence and anomaly detection

## Suggested GitHub description

Open-source energy flexibility MVP for EV charging, flexible building loads, and demand-response analytics.

## Suggested GitHub topics

`nextjs`, `typescript`, `energy`, `smart-grid`, `demand-response`, `ev-charging`, `power-systems`, `recharts`

## License

MIT
