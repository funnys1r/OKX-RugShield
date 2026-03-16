# Architecture

OKX RugShield is an onchain **meme / rug defense workflow** built on OpenClaw and official OKX / OnchainOS skills.

The project is intentionally split into three layers:

## 1. Primitive capability layer
Provided by upstream OKX / OnchainOS skills when available:

- token lookup
- market / signal lookup
- wallet portfolio lookup
- route simulation or execution-adjacent primitives
- other read-only onchain building blocks

RugShield does **not** try to replace these primitives.
It composes them into a higher-level defensive system.

## 2. Agent layer
Provided by RugShield itself.

### Scout Agent (`rugshield-scout`)
Primary job:
- discover token-level risk

Typical inputs:
- token
- chain
- market context
- signal context
- mock replay input

Typical outputs:
- structured `Threat Report`
- risk level
- confidence
- detected signals
- recommended next action

Typical signals:
- dev dumping
- smart-money exits
- liquidity deterioration
- suspicious tags / honeypot-like warnings
- abnormal price / volume behavior

### Guardian Agent (`rugshield-guardian`)
Primary job:
- map threat context to wallet exposure and generate a defensive response

Typical inputs:
- `Threat Report`
- wallet address or portfolio context
- target chains
- mode / safety constraints

Typical outputs:
- exposure summary
- multi-wallet exposure aggregation
- staged defensive plan
- route-simulation-oriented planning
- execution conditions
- confirmation requirements

## 3. Watcher / Patrol layer
This is the monitoring and orchestration layer.

Primary job:
- continuously monitor multiple wallets and surface only actionable changes

Responsibilities:
- scheduled scans
- batch invocation of Guardian flows
- diffing current scan vs previous scan
- alerting only on new / worsening risk
- serving as the proactive OpenClaw monitoring entry point
- receiving casual user intent like “马上检查一次 / 按默认方案开 / 帮我盯着这个钱包” and mapping it to safe watcher defaults

## Main flow

### Threat-driven path
```text
Signals / Token Risk
    -> Scout
    -> Threat Report
    -> Guardian
    -> Exposure Mapping
    -> Staged Defense Plan
```

### Monitoring path
```text
Wallet List / Schedule
    -> Watcher
    -> Guardian Batch Scan
    -> Diff vs Previous State
    -> Alert / Report
```

## Runtime modes

### Demo Mode
Use when:
- official OKX dependencies are missing
- credentials are missing
- judges or reviewers need a fast walkthrough

Supports:
- mock replay
- mock patrol
- guardian simulation
- benchmark scenarios

### Live Mode
Use when:
- official OKX / OnchainOS skills are installed
- credentials are configured
- local environment is ready

Supports:
- live signal prototype path
- live wallet portfolio prototype path
- multi-wallet monitoring MVP

## Design choices

### Graceful downgrade
If live dependencies are unavailable, RugShield should:
- warn clearly
- degrade to demo / analysis mode when possible
- never overclaim live capability

### Auditability
Outputs should remain explainable:
- why something is risky
- which wallets are exposed
- what got filtered
- what should be handled first
- whether execution is allowed or only simulated

### Safety posture
The project is defense-first:
- prioritize alerts and planning over autonomous execution
- keep human confirmation in the loop
- optimize for meme / rug avoidance, not trade automation
