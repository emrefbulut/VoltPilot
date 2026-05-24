# Sample Engineering Report

VoltPilot can generate a scenario-specific Markdown engineering report from the cockpit or through `/api/report`.

Example endpoint:

```text
/api/report?siteType=workshop&strategy=optimizer&batteryMode=medium&tariffPlan=critical&evCount=8&analysisDays=7&gridProvider=epias&gridDate=2026-05-06
```

The report includes:

- selected facility, strategy, tariff, EV count, battery mode, and analysis horizon
- peak `kW`, peak `kVA`, transformer stress, current, power factor, and overload hours
- battery charge/discharge, SoC minimum/final, and efficiency-loss estimates
- telemetry confidence, MAE, MAPE, peak error, and energy delta
- optional grid signal source, status, peak load, price, carbon intensity, and dispatch advice
- prioritized engineering recommendations
- model boundaries and assumptions

This keeps the project useful in interviews: the dashboard is interactive, but the generated report is a portable engineering artifact.
