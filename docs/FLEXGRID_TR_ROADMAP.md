# FlexGrid-TR Roadmap

## Current release

The current release is complete as a software-first, hybrid-ready project:

- English interactive operator cockpit
- Reusable simulation engine
- Transformer kVA and current estimates
- Battery SoC and round-trip efficiency assumptions
- Browser-local saved scenarios
- Shareable scenario URLs
- Mock telemetry overlay
- `/api/grid-signal` virtual and official-data-ready grid signal
- Provider model for EPİAŞ, ENTSO-E, Electricity Maps, and Ember
- `/api/telemetry` measured-vs-simulated comparison
- JSON and CSV exports
- Automated tests and CI

## v1.1 software proof

- Add a README screenshot or short GIF
- Add downloadable engineering report text for a selected scenario
- Add optional telemetry sample import from CSV
- Fill `/api/grid-signal` provider adapters with live API credentials
- Connect the grid signal more deeply to cost and carbon optimization

## v2 live data and optional hardware

- Live EPİAŞ data adapter
- Electricity Maps carbon-intensity adapter
- ESP32 HTTP sample sender
- MQTT bridge example
- Multi-day measured-vs-simulated profile comparison
- Alerts for transformer stress and critical tariff periods

## v3 optimization depth

- EV session prioritization by departure time
- Multi-day battery SoC optimization
- Lightweight database for scenario and telemetry history
- Monthly engineering report export
- Basic anomaly detection

## CV line

Built FlexGrid-TR, a hybrid-ready energy flexibility cockpit that combines EV charging scenarios, transformer loading estimates, battery SoC modeling, virtual grid signals, demand-response analytics, telemetry validation, API exports, and automated tests in one Next.js/TypeScript project.
