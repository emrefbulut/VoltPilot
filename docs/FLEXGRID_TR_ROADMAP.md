# FlexGrid-TR Roadmap

## Current release

The current release is complete as a hybrid-ready software project:

- interactive operator cockpit
- reusable simulation engine
- transformer kVA/current estimates
- battery SoC and efficiency assumptions
- local saved scenarios
- shareable scenario URLs
- mock telemetry overlay
- `POST /api/telemetry`
- JSON and CSV exports
- automated tests and CI

## v1.1 polish

- Add a README screenshot or short GIF
- Add richer bilingual presentation copy
- Add downloadable report text for one selected scenario
- Add optional telemetry sample import from CSV

## v2 physical telemetry

- Add ESP32 HTTP sample sender
- Add MQTT bridge example
- Store a small rolling telemetry history
- Compare measured and simulated profiles over multiple days
- Add alerting for transformer stress and critical tariff periods

## v3 optimization depth

- EV session prioritization by departure time
- Battery state-of-charge optimization over multiple days
- Scenario persistence with a lightweight database
- ENVER-style monthly report export
- Basic anomaly detection

## CV line

Built FlexGrid-TR, a hybrid-ready energy flexibility cockpit that combines EV charging scenarios, transformer loading estimates, battery SoC modeling, demand-response analytics, telemetry validation, API exports, and automated tests.
