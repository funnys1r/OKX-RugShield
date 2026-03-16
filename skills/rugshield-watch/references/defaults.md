# Defaults

## Default one-shot behavior

When the user does not specify detailed parameters:
- config: `./config/watch-wallets.example.json`
- mode: summary-only
- output: Chinese concise report
- execution posture: analysis only

## Default recurring-watch recommendation

If the user asks to “开监控 / 盯着 / 定时查” but no scheduler is available yet:
- frequency recommendation: every 30 minutes
- alert rules:
  - new high risk
  - risk upgraded
  - risk priority raised
  - new top exposure

## Safe ambiguity rule

If the user's wording is short and ambiguous, choose the least risky useful action:
- run one immediate watcher summary
- report what default assumptions were used
- ask only the minimum follow-up question if persistent scheduling is actually needed
