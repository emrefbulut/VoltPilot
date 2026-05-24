# Validation Notes

VoltPilot is validated with automated tests and deterministic simulation outputs. The project does not claim to be a grid power-flow solver; it is a transparent engineering demonstrator for scenario analysis and telemetry readiness.

## Automated checks

Run the full gate:

```bash
pnpm check
```

This runs:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

## Test coverage

The test suite covers:

- EV session clamping
- tariff window behavior
- transformer loading calculation
- battery state-of-charge bounds
- scenario engineering metrics
- Readiness Passport max-safe EV envelope
- high-concurrency upgrade decision behavior
- telemetry sample validation
- measured-vs-simulated comparison
- virtual grid signal generation
- grid provider validation
- CSV escaping
- scenario, grid signal, and telemetry API routes

## Engineering assumptions

- Site service is modeled as nominal 400 V three-phase unless profile data says otherwise.
- Apparent power is estimated as `kVA = kW / powerFactor`.
- Current is estimated with the three-phase current equation.
- Battery behavior is a transparent dispatch heuristic, not an optimizer.
- The Max Safe EV Solver uses the same scenario model and treats transformer overload hours plus a managed stress threshold as the pre-hardware safety boundary.
- Telemetry confidence is a model-fit indicator, not a certified measurement score.

## Acceptance criteria

A release is considered healthy when:

- all tests pass
- TypeScript has no errors
- ESLint has no errors
- production build completes
- `/api/scenario` returns JSON and CSV
- `/api/scenario` includes a Readiness Passport in JSON and CSV output
- `/api/grid-signal` returns 24 hourly points and rejects invalid providers
- `/api/telemetry` returns 200 for valid payloads and 400 for invalid payloads
