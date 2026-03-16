# Threat Report Schema

Use this structure whenever possible.

```json
{
  "token": "OKB",
  "chain": "xlayer",
  "risk_level": "HIGH",
  "confidence": "medium",
  "key_signals": [
    "liquidity_drop",
    "smart_money_exit"
  ],
  "brief_reasoning": "Liquidity deteriorated while tracked wallets reduced exposure.",
  "affected_tokens": ["OKB"],
  "timestamp": "2026-03-16T12:00:00Z",
  "recommended_next_action": "Run rugshield-guardian against relevant wallets"
}
```

## Field notes

- `token`: primary asset or symbol under review
- `chain`: target chain or network context
- `risk_level`: `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`
- `confidence`: `low` | `medium` | `high`
- `key_signals`: compact identifiers, not essays
- `brief_reasoning`: one or two sentences
- `affected_tokens`: include related wrappers only when justified
- `timestamp`: UTC ISO-8601
- `recommended_next_action`: operational next step
