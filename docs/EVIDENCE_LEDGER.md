# OKX RugShield 🛡️ | Evidence Ledger

This page is the human-readable ledger for the current repository proof set.

## Verification Levels

### `mock-proof`
- Deterministic local proof based on repository mock inputs.

### `prototype-proof`
- Programmatic prototype showing pipeline structure, but not full live execution.

### `local-live-proof`
- Verified against live OKX OnchainOS data on the current machine during local testing.

## Current Entries

### 1. Demo Flow
- Level: `mock-proof`
- Command: `npm run demo`
- Purpose: basic Scout → Guardian mock walkthrough

### 2. Mock Replay
- Level: `mock-proof`
- Command: `npm run replay:mock`
- Purpose: replay `mock/mock-rug-event.json` and produce deterministic strategy output

### 3. Proactive Patrol Mock
- Level: `prototype-proof`
- Command: `npm run patrol:mock`
- Purpose: demonstrate proactive Scout → Guardian alerting flow

### 4. Guardian Pipeline Simulation
- Level: `prototype-proof`
- Command: `npm run simulate:guardian`
- Purpose: demonstrate Threat Report → exposure → strategy → route planning bridge

### 5. Live Signal Prototype
- Level: `local-live-proof`
- Command: `npm run live:signal -- 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee xlayer`
- Observed proof:
  - real token / market data returned from OKX OnchainOS
  - Guardian-style strategy output generated from live input

### 6. Live Portfolio Guardian Prototype
- Level: `local-live-proof`
- Command: `npm run live:portfolio -- 0x58e79a0c44e9bf71152bd2e51fea4c88b8a05097 xlayer,ethereum,base,arbitrum,bsc 1`
- Observed proof:
  - real multi-chain holdings loaded
  - noisy assets filtered
  - focus assets extracted into defense-oriented report
