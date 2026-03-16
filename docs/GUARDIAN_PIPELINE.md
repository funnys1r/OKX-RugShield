# Guardian Pipeline

The Guardian pipeline is the wallet-defense path inside RugShield.

## Core idea

Scout answers:
- **Is this token / market situation dangerous?**

Guardian answers:
- **Am I exposed? How much? What should I do first?**

## Pipeline

```text
Threat Report
    -> wallet exposure check
    -> multi-wallet aggregation
    -> position filtering / ranking
    -> risk grouping
    -> staged defense plan
    -> route simulation (prototype / optional)
    -> confirmation or analysis-only output
```

## Stage details

### 1. Threat Report intake
Guardian accepts either:
- a structured Threat Report from Scout
- a manually specified risky token / chain context
- direct wallet monitoring input without a prior token scan

### 2. Wallet exposure check
Guardian inspects:
- whether the target wallet holds the risky asset
- whether the wallet has related exposure on target chains
- which positions are meaningful vs dust / scam clutter

### 3. Multi-wallet aggregation
For patrol / watcher use cases, Guardian can aggregate exposure across:
- primary wallet
- trading wallet
- meme bag wallet
- airdrop / dust wallet
- any additional configured watchlist wallet

### 4. Position filtering and ranking
Guardian should:
- filter zero-value positions
- filter low-value dust by threshold
- preserve explicitly risky tokens even when their current value is small
- sort meaningful positions by estimated value / urgency

### 5. Risk grouping
Guardian groups positions into:
- high risk
- medium risk
- low risk

This grouping is wallet-aware, not just token-aware.
A harmless token may still become important if it forms a large exposure in the wallet.

### 6. Staged defense plan
Guardian outputs a practical sequence such as:
1. inspect highest-value direct exposure first
2. avoid acting on dust before main positions are understood
3. simulate routes before execution
4. use staged exits when liquidity is uncertain
5. require confirmation when Safe Mode is active

### 7. Route simulation / execution bridge
In prototype mode, Guardian may bridge from exposure analysis to:
- route planning
- route simulation
- execution pre-checks

The prototype focus is still:
- planning first
- execution second
- human confirmation before action

## Monitoring use case

For scheduled monitoring, Guardian becomes the exposure engine used by the watcher layer:

```text
Watcher schedule
    -> Guardian wallet scans
    -> exposure diff
    -> alert if new / worsening risk appears
```

## Output goal

Guardian outputs should be readable by both:
- humans reviewing a defense report
- automation comparing current vs previous scan state
