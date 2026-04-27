# API Examples

## Scenario JSON

```bash
curl "http://localhost:3000/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4"
```

## Scenario CSV

```bash
curl "http://localhost:3000/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4&format=csv"
```

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
