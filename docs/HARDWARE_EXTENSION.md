# Hardware Extension Path

VoltPilot does not require physical hardware in the current release. The project is intentionally hybrid-ready: a measured channel can replace mock telemetry without rewriting the simulation model or cockpit.

## Recommended first hardware path

Use one low-cost measured load channel:

- ESP32 or ESP8266
- current sensor or API-enabled smart plug
- HTTP POST to `/api/telemetry`
- one sample per hour for the first demo

## Payload contract

```json
{
  "mode": "measured",
  "scenario": {
    "siteType": "workshop",
    "strategy": "orchestrated",
    "batteryMode": "small",
    "tariffPlan": "tou",
    "evCount": 4
  },
  "samples": [
    {
      "hourIndex": 18,
      "measuredKw": 28.4,
      "voltageV": 400,
      "currentA": 46,
      "powerFactor": 0.9
    }
  ]
}
```

## ESP32 pseudocode

```cpp
// Pseudocode only. Replace measuredKw/currentA with sensor readings.
POST /api/telemetry
Content-Type: application/json

{
  "mode": "measured",
  "scenario": selectedScenario,
  "samples": [
    {
      "hourIndex": currentHour,
      "measuredKw": measuredKw,
      "voltageV": 400,
      "currentA": measuredCurrent,
      "powerFactor": estimatedPowerFactor
    }
  ]
}
```

## Validation flow

1. Run the software simulator with mock telemetry.
2. Pick one facility preset and keep it fixed.
3. Replace one mock sample with measured sensor data.
4. Compare `maeKw`, `peakErrorKw`, `energyDeltaKwh`, and `confidenceScore`.
5. Only after confidence is stable, collect more frequent samples.

## Why this stays out of v1

Physical hardware introduces calibration, safety, and measurement-quality concerns. The current release focuses on a reliable software contract first, which keeps the GitHub project easy to run while preserving a credible hardware path.
