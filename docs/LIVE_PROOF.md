# Live Proof

This repository supports **live prototype paths**, not full production-grade autonomous execution.

## What live means here

When documentation says `live`, it means one of the following:

- a prototype path that accepts real token or wallet inputs
- a path intended to sit on top of official OKX / OnchainOS dependencies when they exist
- a runtime mode that should only be claimed when environment readiness checks pass

It does **not** mean:
- production-grade autonomous real-money execution
- complete dependency-free OKX integration inside this repository alone
- guaranteed live availability on every machine

## Live prerequisites

Before claiming live readiness, verify:

1. Node and npm are installed
2. OpenClaw is installed
3. official OKX / OnchainOS-related skills are installed
4. `.env` exists and includes required OKX credentials
5. `npm run preflight` does not report hard failures

## Recommended verification flow

### Step 1: run preflight

```bash
npm run preflight
```

Expected result:
- `PARTIALLY READY` is acceptable for demo-first judging
- only claim stronger live ability when the environment clearly satisfies upstream dependencies

### Step 2: run live signal prototype

```bash
npm run live:signal -- OKB xlayer
```

Expected output characteristics:
- includes `token`
- includes `chain`
- includes `risk_level`
- includes an explicit note that this is a prototype live path unless upstream dependencies are fully configured

### Step 3: run live portfolio prototype

```bash
npm run live:portfolio -- 0x58e79a0c44e9bf71152bd2e51fea4c88b8a05097 xlayer,ethereum,base,arbitrum,bsc 1
```

Expected output characteristics:
- includes `wallets_checked`
- includes `chains_checked`
- includes `execution_condition`
- clearly indicates manual review or conditional use when full live dependencies are not available

## Claim policy

Use the following language consistently:

### Safe claims
- live signal prototype supported
- live portfolio prototype supported
- live capability depends on official OKX / OnchainOS prerequisites
- graceful downgrade to demo mode is supported

### Unsafe claims
Do not claim:
- fully autonomous live execution
- production-grade onchain defense automation
- complete upstream OKX integration fully embedded in this repository

## Contest guidance

For judging, the best sequence is:

```bash
npm install
npm run preflight
npm run demo
npm run replay:mock
npm run simulate:guardian
npm run benchmark:verbose
```

Then optionally show live prototype entry points if the environment supports them.
