# Runbook

This runbook describes how to operate OKX RugShield in demo-first and live-prototype modes.

## 1. Fresh setup

```bash
npm install
cp .env.example .env
npm run preflight
```

If `preflight` reports missing upstream OKX dependencies, you can still continue with demo mode.

## 2. Demo walkthrough

Use this path for judges, screenshots, and basic verification.

### Demo command sequence

```bash
npm run demo
npm run replay:mock
npm run patrol:mock
npm run simulate:guardian
npm run benchmark:verbose
```

### What each command demonstrates

- `npm run demo`: basic scout mock output
- `npm run replay:mock`: replay-based Threat Report flow
- `npm run patrol:mock`: patrol alert behavior
- `npm run simulate:guardian`: staged defensive response output
- `npm run benchmark:verbose`: reproducibility and scenario coverage

## 3. Local OpenClaw skill installation

Install the two local skills:

```bash
bash skills/rugshield-scout/scripts/install-local.sh
bash skills/rugshield-guardian/scripts/install-local.sh
```

Default target:

```bash
~/.openclaw/workspace/skills/
```

If the project lives elsewhere:

```bash
export RUGSHIELD_PROJECT_DIR=/path/to/OKX-RugShield
```

## 4. Live prototype walkthrough

Use this only when you have a fuller environment.

### Recommended checks

- official OKX / OnchainOS skills installed
- `.env` configured
- `npm run preflight` completes without hard failures

### Live prototype commands

```bash
npm run live:signal -- OKB xlayer
npm run live:portfolio -- 0x58e79a0c44e9bf71152bd2e51fea4c88b8a05097 xlayer,ethereum,base,arbitrum,bsc 1
```

## 5. Interpreting preflight

### READY
Environment is broadly ready for the repository's supported paths.

### PARTIALLY READY
Demo mode is usable, but live prerequisites are incomplete.
This is acceptable for most contest walkthroughs.

### NOT READY
One or more hard requirements are missing, such as project structure or runtime basics.

## 6. Troubleshooting

### Problem: `npm run preflight` warns that official OKX skills are missing
Meaning:
- live mode may be limited
- demo mode is still expected to work

Action:
- continue with demo commands
- install upstream OKX / OnchainOS skills before claiming fuller live support

### Problem: `.env` missing or keys missing
Meaning:
- live prototype paths are not fully configured

Action:
- copy `.env.example` to `.env`
- set `OKX_API_KEY`, `OKX_API_SECRET`, `OKX_API_PASSPHRASE`

### Problem: local skills are not installed in OpenClaw workspace
Action:

```bash
bash skills/rugshield-scout/scripts/install-local.sh
bash skills/rugshield-guardian/scripts/install-local.sh
```

## 7. Contest-safe messaging

Use these phrases consistently:
- demo mode supported
- live prototype supported
- graceful downgrade supported
- production-grade autonomous execution not yet implemented
