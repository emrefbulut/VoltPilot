# API Examples

## Scenario JSON

```bash
curl "http://localhost:3000/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4"
```

## Scenario CSV

```bash
curl "http://localhost:3000/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4&format=csv"
```

## Scenario JSON with virtual grid signal

```bash
curl "http://localhost:3000/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4&gridProvider=epias&gridDate=2026-05-06"
```

## Virtual grid signal

```bash
curl "http://localhost:3000/api/grid-signal?provider=demo&date=2026-05-06"
```

Accepted providers: `demo`, `epias`, `entsoe`, `electricity-maps`, `ember`.

## Telemetry mock comparison

```bash
curl -X POST "http://localhost:3000/api/telemetry" \
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

## Telemetry measured comparison

```bash
curl -X POST "http://localhost:3000/api/telemetry" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "measured",
    "scenario": {
      "siteType": "workshop",
      "strategy": "orchestrated",
      "batteryMode": "small",
      "tariffPlan": "tou",
      "evCount": 4
    },
    "samples": [
      { "hourIndex": 17, "measuredKw": 26.4, "voltageV": 400, "currentA": 42, "powerFactor": 0.9 },
      { "hourIndex": 18, "measuredKw": 28.1, "voltageV": 400, "currentA": 45, "powerFactor": 0.9 }
    ]
  }'
```

## Invalid telemetry payload

```bash
curl -X POST "http://localhost:3000/api/telemetry" \
  -H "Content-Type: application/json" \
  -d '{ "scenario": {}, "samples": [] }'
```

The endpoint returns `400` with an `errors` array.
