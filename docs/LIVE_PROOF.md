# OKX RugShield 🛡️ | Live Proof

## Purpose

This page records the current proof set showing that OKX RugShield is no longer a mock-only repository.

It distinguishes:
- mock proof
- prototype proof
- live data proof
- not-yet-proven execution capabilities

## Current Live Proofs

### 1. Live Market / Token Data Prototype

- Command:
  ```bash
  npm run live:signal -- 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee xlayer
  ```
- Proof level: `local-live-proof`
- What it proves:
  - The repository can call real OKX OnchainOS token / market data
  - Live token data can be converted into a Guardian-style strategy output
- What it does not prove:
  - Real trade execution
  - Real-time mempool defense

### 2. Live Portfolio Guardian Prototype

- Command:
  ```bash
  npm run live:portfolio -- 0x58e79a0c44e9bf71152bd2e51fea4c88b8a05097 xlayer,ethereum,base,arbitrum,bsc 1
  ```
- Proof level: `local-live-proof`
- What it proves:
  - The repository can load real multi-chain wallet portfolio data through OKX OnchainOS
  - The repository can filter noisy holdings and generate a Guardian-oriented defense report
- What it does not prove:
  - Real onchain exit execution
  - Full portfolio risk scoring based on live pool depth for every asset

## Prototype Proofs

### 3. Guardian Pipeline Simulation

- Command:
  ```bash
  npm run simulate:guardian
  ```
- Proof level: `prototype-proof`
- What it proves:
  - Threat Report → strategy → route plan can be represented as a bridge-layer pipeline

### 4. Proactive Patrol Prototype

- Command:
  ```bash
  npm run patrol:mock
  ```
- Proof level: `prototype-proof`
- What it proves:
  - Scout can be demonstrated in a proactive monitoring posture
  - Guardian can respond without waiting for a user to initiate a trade first

## Mock Proofs

### 5. Demo / Replay

- Commands:
  ```bash
  npm run demo
  npm run replay:mock
  ```
- Proof level: `mock-proof`
- What they prove:
  - The project ships reproducible mock inputs and deterministic demo flows

## What This Repository Does Not Yet Claim

- It does not yet claim stable real-money autonomous execution.
- It does not yet claim mempool / pending transaction front-run defense.
- It does not yet claim AA-wallet-native blocking or account-layer intervention.
- It does not yet claim complete live risk scoring across all supported chains.
