# Judging Info

This document is written to align with the OKX Onchain OS AI hackathon judging rubric.

## Project summary

OKX RugShield is a dual-skill defensive workflow built on top of OpenClaw and official OKX / OnchainOS skills.

Instead of helping users chase the next trade, RugShield helps them:
- detect rug-related risk
- confirm real wallet exposure
- generate staged defensive responses

## 1. Integration (结合度)

### Why this project is deeply tied to Onchain OS / Claw

- Official `okx/onchainos-skills` provide the primitive capability layer.
- OpenClaw provides the natural-language orchestration and skill runtime.
- RugShield packages those building blocks into a wallet-aware defense workflow.

Without Onchain OS / OKX skills:
- live signal and live portfolio paths are limited
- the workflow degrades to demo or analysis mode

Without OpenClaw:
- the intended dual-skill natural-language invocation path is weakened

### Integration claim

RugShield is not a superficial wrapper.
It is a workflow layer built on top of OKX primitives and OpenClaw skill orchestration.

## 2. Utility (实用性)

### Real problem addressed

Onchain users often face a more immediate pain than finding the next opportunity:
- they may already be exposed to risky tokens
- they may not notice deteriorating conditions early enough
- they may not know which positions to reduce first

RugShield is designed for:
- wallet holders exposed to risky tokens
- users who need defensive guidance
- operators who want a safety-first onchain workflow

### Utility claim

This is a defense-first product.
Its purpose is to reduce confusion and reaction delay when token risk worsens.

## 3. Innovation (创新性)

### What is novel here

Most onchain AI products focus on:
- alpha discovery
- trading suggestions
- execution convenience

RugShield shifts the center of gravity toward:
- threat detection
- wallet exposure confirmation
- staged defensive planning
- auditable risk response

### Innovation claim

The key innovation is repositioning onchain AI from an attack-oriented trading copilot to a defense-oriented asset safety workflow.

## 4. Reproducibility (可复制性)

### What is published

The repository includes:
- README and usage docs
- dual local skills
- preflight check
- benchmark runner
- scenarios file
- demo commands
- live prototype commands
- prompt and scenario summary

### Judge-friendly path

Recommended commands:

```bash
npm install
npm run preflight
npm run demo
npm run replay:mock
npm run simulate:guardian
npm run benchmark:verbose
```

If the environment also has official OKX skills installed:

```bash
npx skills add okx/onchainos-skills
npm run live:signal -- OKB xlayer
npm run live:portfolio -- 0x58e79a0c44e9bf71152bd2e51fea4c88b8a05097 xlayer,ethereum,base,arbitrum,bsc 1
```

### Reproducibility claim

The project is designed so judges can still evaluate it in demo mode even without a perfect live setup.
That is an intentional design choice, not a missing thought.

## Suggested score framing

### Integration
Strong because the workflow explicitly depends on OpenClaw skill orchestration plus official OKX primitive skills for fuller live behavior.

### Utility
Strong because the project solves a real wallet defense problem with clear user pain.

### Innovation
Strong because it reframes onchain AI around defense rather than pure trade opportunity discovery.

### Reproducibility
Good and improving because prompt structure, commands, scenarios, and installation guidance are published.

## Contest materials checklist

To maximize public judging clarity, pair this repository with:
- interaction screenshots
- short demo GIF or video
- X / Twitter post link
- clear note of the OpenClaw runtime and model used during the public demo
