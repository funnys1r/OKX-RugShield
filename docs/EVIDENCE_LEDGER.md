# Evidence Ledger

This document tracks what the current repository can demonstrate and how to verify each claim.

## Evidence table

| Area | Status | Command | Expected evidence |
| --- | --- | --- | --- |
| Demo scout output | implemented | `npm run demo` | structured mock scout output with token, chain, risk level, confidence, and next action |
| Mock replay Threat Report | implemented | `npm run replay:mock` | structured Threat Report-style JSON with key signals and recommended guardian follow-up |
| Mock patrol alert | implemented | `npm run patrol:mock` | patrol alert output showing a high-risk condition and next action |
| Guardian simulation | implemented | `npm run simulate:guardian` | staged defense plan with exposed positions, risk priority, and confirmation requirement |
| Environment readiness check | implemented | `npm run preflight` | `READY`, `PARTIALLY READY`, or `NOT READY` summary with dependency warnings |
| Benchmark framework | implemented | `npm run benchmark:verbose` | scenario summary showing pass, block, or fail counts |
| Live signal prototype | prototype | `npm run live:signal -- OKB xlayer` | prototype JSON output for token and chain with explicit live-prototype note |
| Live portfolio prototype | prototype | `npm run live:portfolio -- <wallet> xlayer,ethereum 1` | prototype guardian output with wallet, chains, and execution condition |
| Production-grade autonomous execution | not implemented | n/a | should not be claimed |

## Interpreting statuses

### implemented
The repository includes a working local command path that can be executed directly in the current project.

### prototype
The repository includes a working placeholder or prototype path, but it should not be described as a full production implementation.

### not implemented
The repository does not currently provide this capability and documentation should not overstate it.

## Current claim boundaries

The repository can credibly claim:
- dual-skill structure
- demo mode
- replayable threat reporting flow
- guardian simulation flow
- preflight readiness checks
- lightweight benchmark support
- live prototype entry points

The repository should not currently claim:
- full real-money automatic execution
- complete production-grade OKX integration
- autonomous mempool defense
- fully automated patrol scheduler

## Reviewer guidance

Recommended minimum validation sequence:

```bash
npm install
npm run preflight
npm run demo
npm run replay:mock
npm run simulate:guardian
npm run benchmark:verbose
```

Optional prototype checks:

```bash
npm run live:signal -- OKB xlayer
npm run live:portfolio -- 0x58e79a0c44e9bf71152bd2e51fea4c88b8a05097 xlayer,ethereum,base,arbitrum,bsc 1
```
