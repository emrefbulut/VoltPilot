# FlexGrid-TR Project Brief

## Short Description

FlexGrid-TR is a hybrid-ready energy flexibility cockpit that analyzes EV charging, flexible building loads, battery support, virtual grid signals, and transformer loading in one workflow.

The project runs without physical hardware. It still includes an EPİAŞ/ENTSO-E/Electricity Maps/Ember-ready virtual data layer and a `POST /api/telemetry` endpoint for measured-vs-simulated comparison. Future ESP32, MQTT bridge, or smart-plug data can be connected to the same contract.

## Problem

Small businesses, labs, and apartment blocks often cannot quickly answer:

- When is the transformer under stress?
- How much does EV charging increase peak load?
- How much can storage or load shifting reduce monthly cost?
- Which official or institutional grid-data signal increases risk by hour?
- How closely does the simulation match measured data?

## Solution

FlexGrid-TR answers those questions in one cockpit:

- Builds a 24-hour load profile.
- Compares uncontrolled, tariff-aware, and orchestrated strategies.
- Reports `kW`, `kVA`, estimated current, power factor, battery SoC, and overload hours.
- Produces virtual or official-data-ready grid signals through `/api/grid-signal`.
- Compares mock or measured telemetry data against the simulation.
- Exports JSON and CSV outputs.

## CV Line

Built FlexGrid-TR, a hybrid-ready energy flexibility cockpit that combines EV charging scenarios, transformer loading, battery SoC modeling, virtual grid signals, demand-response analytics, telemetry validation, API exports, and automated tests in one Next.js/TypeScript project.

## Presentation Highlights

- Uses electrical and electronics engineering metrics directly: `kW`, `kVA`, current, power factor, and transformer loading.
- It is not only a visual dashboard; it has a tested simulation core and API layer.
- Demonstrates an EPİAŞ/ENTSO-E/Electricity Maps/Ember-compatible data architecture without physical hardware.
- Can be shown without buying hardware, while the future hardware boundary is already designed.
- Works as a readable, runnable, and extendable GitHub portfolio project.
