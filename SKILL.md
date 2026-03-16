# SKILL.md - OKX RugShield

OKX RugShield is an OpenClaw-based **onchain meme/rug defense system** built on top of official OKX / OnchainOS capabilities.

It is organized into three layers:

## 1. Scout Agent
`skills/rugshield-scout/`

Responsible for:
- scanning token-level risk signals
- detecting patterns such as dev dumping, smart-money exits, liquidity deterioration, and abnormal trading behavior
- producing structured `Threat Report` output
- generating mock threat events for demo scenarios
- supporting proactive patrol / alert entry points during the prototype stage

## 2. Guardian Agent
`skills/rugshield-guardian/`

Responsible for:
- checking whether user wallets hold assets related to a detected threat
- aggregating exposure across multiple wallets
- generating staged defensive exit plans
- simulating routes before any execution-oriented step
- deciding whether confirmation is required based on mode / safety policy
- bridging from `Threat Report` to wallet-aware defense planning
- generating defense reports from real wallet portfolio data during the prototype stage

## 3. Watcher / Patrol Layer
Repository runtime layer for scheduled monitoring.

Responsible for:
- scanning multiple wallets on a schedule
- invoking Guardian in batch
- comparing current results to previous scans
- surfacing only new or worsening risk
- acting as the proactive monitoring entry point for OpenClaw automation

## Integration Notes

- Use Demo Mode when official OKX dependencies are not yet installed.
- Use Live Mode only when upstream OKX / OnchainOS skills and credentials are present.
- Run `npm run preflight` before demos or judge walkthroughs.
- Use `npm run watch:wallets -- --config ./config/watch-wallets.example.json` for multi-wallet monitoring MVP.
