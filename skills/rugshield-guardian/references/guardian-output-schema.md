# Guardian Output Schema

Use this structure whenever possible.

```json
{
  "threat_summary": "HIGH rug risk detected for OKB on xlayer.",
  "wallets_checked": ["0x123..."],
  "chains_checked": ["xlayer", "ethereum", "base"],
  "exposed_positions": [
    {
      "token": "OKB",
      "chain": "xlayer",
      "amount": 120.5,
      "usd_value": 842.3,
      "priority": 1
    }
  ],
  "risk_priority": "immediate",
  "staged_exit_plan": [
    "stage 1: reduce highest-risk direct exposure",
    "stage 2: reassess liquidity and related positions",
    "stage 3: keep residual position only if risk drops"
  ],
  "slippage_or_liquidity_notes": "Liquidity is thin; use smaller staged exits.",
  "execution_condition": "simulation only unless explicit execution support exists",
  "confirmation_requirement": "required in Safe Mode"
}
```

## Field notes

- `threat_summary`: concise operational summary
- `risk_priority`: `monitor` | `elevated` | `immediate`
- `staged_exit_plan`: ordered actions, not vague advice
- `execution_condition`: state limits clearly
