# Telemetry Guide

FlexGrid-TR is hybrid-ready: the project works without hardware, but its telemetry API is designed so a future ESP32, MQTT bridge, or smart plug can send measured samples.

## Endpoint

```text
POST /api/telemetry
```

## Mock mode

Mock mode generates deterministic telemetry samples from the scenario. Use this for demos and tests.

```json
{
  "mode": "mock",
  "scenario": {
    "siteType": "workshop",
    "strategy": "orchestrated",
    "batteryMode": "small",
    "tariffPlan": "tou",
    "evCount": 4
  }
}
```

## Measured mode

Measured mode accepts one or more samples.

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

## Response metrics

- `maeKw` - mean absolute error between measured and simulated kW
- `mapePct` - percentage error against simulated kW
- `peakErrorKw` - measured peak minus simulated peak
- `energyDeltaKwh` - total measured energy delta across provided samples
- `confidenceScore` - 0-100 confidence score for using the scenario
- `status` - `excellent`, `watch`, or `action`

## Hardware path

The simplest hardware extension is an ESP32 or smart plug that posts hourly or sub-hourly samples to the same endpoint. The API is stateless, so a future database can be added without changing the comparison model.
