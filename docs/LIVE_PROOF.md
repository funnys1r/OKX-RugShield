# Live Proof

This repository now uses the **official OKX `onchainos` CLI path** for live and live-adjacent functionality where available.

## What is already verified

### Verified live signal path
The Scout live path has been connected to official OKX CLI calls:
- `onchainos token search`
- `onchainos token price-info`
- `onchainos token advanced-info`
- optional `onchainos signal list`

That means `npm run live:signal -- <token> <chain>` is no longer a placeholder-only path.
It now produces a structured result derived from official OKX CLI output.

### Verified live portfolio attempt path
The Guardian live path now attempts:
- `onchainos portfolio all-balances`

If this authenticated path fails, the repository reports an explicit fallback mode instead of pretending live portfolio access succeeded.

## What live means here

When documentation says `live`, it means one of the following:

- a path that calls the official `onchainos` CLI provided by `okx/onchainos-skills`
- a path that accepts real token or wallet inputs
- a runtime mode that should only be claimed when environment readiness checks pass

It does **not** mean:
- production-grade autonomous real-money execution
- complete dependency-free OKX integration inside this repository alone
- guaranteed authenticated success on every machine regardless of host time and environment state

## Verified upstream install path

Official repository:
- `https://github.com/okx/onchainos-skills`

Official install command:

```bash
npx skills add okx/onchainos-skills
```

CLI install command:

```bash
curl -sSL https://raw.githubusercontent.com/okx/onchainos-skills/main/install.sh | sh
```

## Live prerequisites

Before claiming live readiness, verify:

1. Node and npm are installed
2. OpenClaw is installed
3. official OKX / OnchainOS-related skills are installed
4. `onchainos` CLI is installed and on PATH
5. `.env` exists and includes required OKX credentials
6. `npm run preflight` reports `READY`

## Recommended verification flow

### Step 1: run preflight

```bash
npm run preflight
```

Expected result:
- `READY` when environment, upstream skills, and credentials are present

### Step 2: run live signal path

```bash
npm run live:signal -- OKB xlayer
```

Expected output characteristics:
- includes `mode: live-okx-cli`
- includes `token`
- includes `chain`
- includes `risk_level`
- reflects real data obtained via official OKX CLI calls

### Step 3: run live portfolio path

```bash
npm run live:portfolio -- 0x58e79a0c44e9bf71152bd2e51fea4c88b8a05097 xlayer,ethereum,base,arbitrum,bsc 1
```

Expected output characteristics:
- includes either `mode: live-okx-cli` or `mode: live-auth-fallback`
- includes `wallets_checked`
- includes `chains_checked`
- includes `execution_condition`

## Important environment note

Authenticated portfolio endpoints may fail if the host clock is significantly out of sync, because OKX-authenticated requests depend on valid timestamps.

If you see an error like:
- `Timestamp request expired`

then the repository should report a **live authenticated fallback** rather than pretending the portfolio query succeeded.

## Claim policy

### Safe claims
- official OKX `onchainos` CLI path integrated
- live signal path supported through official CLI and verified
- live portfolio path attempted through official CLI and verified
- authenticated portfolio fallback clearly reported if timestamp or auth validation fails
- graceful downgrade to demo mode is supported

### Unsafe claims
Do not claim:
- fully autonomous live execution
- production-grade onchain defense automation
- guaranteed authenticated portfolio success on a host with broken clock or invalid credentials

## Contest guidance

For judging, the best sequence is:

```bash
npm install
npm run preflight
npm run demo
npm run replay:mock
npm run simulate:guardian
npm run benchmark:verbose
npm run live:signal -- OKB xlayer
```

Then optionally show the live portfolio path and any authenticated fallback behavior honestly.
