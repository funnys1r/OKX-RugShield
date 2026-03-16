# OKX RugShield 🛡️

[简体中文](./README.md)

[![Node >= 18](https://img.shields.io/badge/node-%3E%3D18-0f766e)](./package.json)
[![OpenClaw Dual Skill](https://img.shields.io/badge/OpenClaw-dual%20skill-1d4ed8)](./SKILL.md)
[![OKX Skills Based](https://img.shields.io/badge/OKX%20Skills-based-f59e0b)](./docs/AI_SETUP.md)
[![Defense Workflow](https://img.shields.io/badge/focus-defense%20workflow-7c3aed)](./docs/GUARDIAN_PIPELINE.md)
[![Demo + Live](https://img.shields.io/badge/mode-demo%20%7C%20live-2563eb)](./scripts/preflight.sh)

Built on OKX Skills, packaged as an onchain **defense workflow**.

Quick links:

- [Skill Layer](./SKILL.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Guardian Pipeline](./docs/GUARDIAN_PIPELINE.md)
- [Live Proof](./docs/LIVE_PROOF.md)
- [Evidence Ledger](./docs/EVIDENCE_LEDGER.md)
- [Runbook](./docs/RUNBOOK.md)
- [Benchmark Scenarios](./scenarios/demo-scenarios.v1.json)

OKX RugShield is a local-first OpenClaw + OKX OnchainOS project that turns low-level token, market, and portfolio capabilities into a higher-level **rug-risk defense workflow**.

OKX provides the primitive skills.
RugShield packages them into a reusable safety pipeline that users or other agents can call to:
- detect rug-related risk signals
- verify wallet exposure
- generate staged exit plans
- produce auditable defense reports

```mermaid
flowchart LR
  A[Token / Market / Onchain Signals] --> B[Scout]
  B --> C[Threat Report]
  C --> D[Guardian]
  E[Wallet Portfolio] --> D
  D --> F[Exposure Check]
  F --> G[Staged Defense Plan]
  G --> H[Simulation / Conditional Action]
```

## Product Structure

The product structure is explicit:

- **signal layer**: identify suspicious token behavior and convert it into a structured Threat Report
- **defense layer**: map that threat to real wallet exposure and prioritize what needs attention first
- **response layer**: turn the situation into a staged, auditable defensive plan instead of vague warnings

RugShield does not try to replace the official OKX primitive skills.
It acts as the **defense and control layer** built on top of them.

## Demo vs Live Usage

### Demo Mode
Demo mode is designed for judges, reviewers, and users who do not yet have the full OKX dependency stack.

It supports:
- mock risk scans
- mock event replay
- guardian simulation
- manual analysis mode

### Live Mode
Live mode enables:
- live token / market signal checks
- live wallet portfolio checks
- stronger guardian response flows

Live mode depends on:
- official OKX / OnchainOS skills
- OKX credentials
- a correct local runtime environment

Dependency policy:

> detect first, warn clearly, degrade gracefully, and only claim live capability when the environment truly supports it.

## What It Does

- **detect rug risk**: identify liquidity drops, abnormal volume, dev sell pressure, smart-money exits, and similar signals
- **generate Threat Report**: convert raw findings into a structured object with risk level, confidence, and next action
- **check wallet exposure**: inspect whether risky tokens or related assets exist in the target wallet portfolio
- **build staged exit plans**: prioritize direct exposure first and return a sequence of defensive actions
- **simulate response**: provide an auditable simulated plan when real execution should not happen
- **support OpenClaw skills**: split the workflow into `rugshield-scout` and `rugshield-guardian`

## Quick Start

```bash
npm install
cp .env.example .env
npm run preflight
npm run demo
npm run replay:mock
npm run patrol:mock
npm run simulate:guardian
npm run benchmark:verbose
```

Optional live prototype examples:

```bash
npm run live:signal -- OKB xlayer
npm run live:portfolio -- 0x58e79a0c44e9bf71152bd2e51fea4c88b8a05097 xlayer,ethereum,base,arbitrum,bsc 1
```

## Local OpenClaw Skill Installation

RugShield ships as two local-first skills:

- `rugshield-scout`
- `rugshield-guardian`

Install locally:

```bash
bash skills/rugshield-scout/scripts/install-local.sh
bash skills/rugshield-guardian/scripts/install-local.sh
```

Default install path:

```bash
~/.openclaw/workspace/skills/
```

If needed:

```bash
export RUGSHIELD_PROJECT_DIR=/path/to/OKX-RugShield
```

## Reproducibility

RugShield includes:
- `scripts/preflight.sh`
- `scripts/benchmark-runner.js`
- `scenarios/demo-scenarios.v1.json`
- mock replay flows
- live prototype entry points

Suggested judging commands:

```bash
npm install
npm run preflight
npm run demo
npm run replay:mock
npm run simulate:guardian
npm run benchmark:verbose
```

## Output Boundaries

### Already implemented
- dual-skill structure: Scout + Guardian
- Threat Report generation
- mock / replay / patrol flows
- live signal prototype
- live portfolio prototype
- staged defense strategy prototype
- preflight and lightweight benchmark framework

### Not fully implemented yet
- production-grade automatic execution
- full real-money autonomous defense loop
- mempool / pending transaction preemptive defense
- full autonomous patrol scheduler

So the project should be evaluated accurately as:

> a demonstrable, testable, extensible onchain defense prototype

## Why It Matters

Most onchain AI products help users find the next opportunity.
RugShield focuses on what users fear more:

- hidden exposure
- rapidly worsening token risk
- not knowing what to reduce first
- acting too late

RugShield pushes onchain AI one step closer to a safety-native workflow:

> detect risk early, map it to real holdings, and return a usable defense response before the loss expands.

## Roadmap

- add stricter executable benchmark validation
- strengthen machine-readable report schemas
- improve official OKX dependency detection
- add screenshots, GIFs, and X demo links
- improve live-mode operational guidance
- extend the defense loop under explicit safety and authorization controls
