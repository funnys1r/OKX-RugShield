# OKX RugShield 🛡️

**A chat-native dual-agent risk defense system for multi-wallet onchain users, powered by OpenClaw + OKX OnchainOS Skills.**

<div align="center">
  <h3>Don’t just find the next 100x — survive the next rug.</h3>
  <p>Official hackathon entry for the OKX Onchain OS AI-Song.</p>
</div>

---

## 1. What is OKX RugShield?

**One-line pitch:**  
OKX RugShield is an AI risk-defense and escape-execution agent for onchain users with multiple wallets.

It is built for the exact moment most crypto agents ignore:

- dev dumping
- smart-money exits
- liquidity collapse
- late-night meme crashes
- multi-wallet positions that are impossible to unwind manually in time

Most AI agents try to help you **find the next opportunity**.  
**RugShield is built to help you keep your capital before the chart dies.**

---

## 2. Why it matters

For airdrop hunters, meme traders, and active onchain users, risk does not arrive politely.
It arrives in minutes.

By the time a human notices:
- the whale wallets are already gone
- slippage is exploding
- LP is drying up
- the best exit route is disappearing

**RugShield turns that chaos into a structured defense flow:**

1. **Scout** detects danger early
2. **Guardian** checks whether you actually hold the asset
3. **Guardian** simulates the safest exit path
4. **Safe Mode** asks for confirmation, or **Auto-Defense Mode** executes instantly

---

## 3. Core idea: a Dual-Agent Defense System

RugShield is built as a **Scout + Guardian** dual-agent system on top of **OpenClaw** and **OKX OnchainOS skills**.

### Scout Agent = Market Recon
Scout never executes.
It only watches the market and outputs structured threat intelligence.

It looks for:
- abnormal price action
- dev wallet dumping
- smart-money exits
- liquidity deterioration
- suspicious holder structure
- execution friction / slippage risk

### Guardian Agent = Portfolio Defense + Escape Router
Guardian only acts after risk is identified.

It:
- checks whether the user is exposed
- scans wallet holdings
- chooses a tiered exit strategy
- simulates the route
- either waits for `CONFIRM` or executes automatically in Auto-Defense Mode

**Why split the system?**
Because single-agent risk bots usually mix market analysis, portfolio analysis, execution, and chat reasoning into one overloaded prompt. Under stress, that becomes noisy and unreliable.

RugShield separates responsibilities:
- **Scout thinks about the market**
- **Guardian thinks about the user’s capital**

That separation makes the system easier to explain, demo, and trust.

---

## 4. What makes this hackathon entry strong

### 4.1 Utility: tiered escape logic
RugShield does not blindly dump everything.

- **Level 1 Risk (60–75):** sell 50% to USDC, keep upside on the rest
- **Level 2 Risk (75–90):** rotate 100% into a major asset like ETH / SOL
- **Level 3 Risk (90+):** immediate full exit to USDC

This makes the product feel like a real defense agent, not a panic button.

### 4.2 Innovation: MEV-aware defensive routing
In a crash, even deciding to exit is not enough.
You also need to **actually get out without being sandwiched to death**.

RugShield explicitly models:
- slippage deterioration
- urgent routing
- higher gas priority
- simulated route validation
- private RPC / anti-sandwich broadcast preferences

### 4.3 Tight OKX ecosystem integration
The system is designed around the OKX OnchainOS skill stack:

`portfolio -> token -> market -> signal -> trenches -> gateway -> swap`

That creates a closed loop from **signal detection** to **wallet awareness** to **execution**.

### 4.4 Reproducibility
The project supports both:
- **Judge Demo Mode**: zero real API keys required
- **Live Mode**: full environment-backed setup

That matters in a hackathon. Judges should be able to see the product in action within minutes, not fight config for half an hour.

---

## 5. Judge-friendly 60-second demo path

If you are a judge or reviewer and just want to see the concept work:

```bash
cd OKX-RugShield
npm install
npm run demo
```

That runs a full **mock Scout → Guardian → rescue flow** with:
- no real OKX credentials
- no live wallet required
- no real transaction broadcast

You will see a simulated sequence where:
1. Scout identifies a critical meme-token rug event
2. Guardian detects wallet exposure
3. Guardian applies Level 3 emergency escape logic
4. Guardian simulates a protected exit into USDC

---

## 6. Live setup path

For a real environment:

```bash
# 1. Install dependencies
npm install

# 2. Create live environment file
cp .env.example .env
# fill in OKX_API_KEY / OKX_API_SECRET / OKX_API_PASSPHRASE

# 3. Install required OKX skills + bundled RugShield skills
npm run install:core
# or: node scripts/installer.js --core-only

# 4. Run live preflight
npm run preflight
# or: node cli/rugshield.js
```

### What the installer does

It will:
- install the 7 required OKX OnchainOS skills
- copy `rugshield-scout` and `rugshield-guardian` into `~/.openclaw/workspace/skills/`
- run a final preflight check

---

## 7. Chat-native experience

RugShield is not designed as a hidden backend script only.
It is meant to live **inside the user’s chat workflow**: Telegram, Discord, Feishu, or any OpenClaw-connected surface.

Example flow:

1. Install RugShield into OpenClaw
2. Let the agent load the two bundled skills
3. In chat, say:
   - `运行 场景1：午夜土狗闪崩 模拟演示`
   - `执行全仓体检`
   - `Guardian Agent, review the latest threat report`
4. The system responds directly inside the conversation with reports, routing decisions, and confirmation requests

That makes the product feel like an **always-available onchain bodyguard**, not a command-line toy.

---

## 8. OKX OnchainOS skill dependencies

### Scout Agent dependencies
- `okx-dex-token`
- `okx-dex-market`
- `okx-dex-signal`
- `okx-dex-trenches`

### Guardian Agent dependencies
- `okx-wallet-portfolio`
- `okx-dex-swap`
- `okx-onchain-gateway`

---

## 9. Working modes

### Safe Mode
Default mode.
Every execution requires human confirmation.

Best for:
- main wallets
- larger capital
- first-time deployment
- judges who want to see guarded behavior

### Auto-Defense Mode
If `AUTO_DEFENSE_MODE=true`, Guardian can instantly react to critical threats.

Best for:
- smaller high-risk wallets
- meme farming wallets
- late-night unattended defense
- users who prioritize speed over manual review

---

## 10. Battle-tested demo scenarios

### Scenario 1 — Midnight Meme Dump
**Problem:** user is asleep, dev dumps, whales exit, chart nukes  
**RugShield response:** Scout flags CRITICAL risk, Guardian liquidates to USDC before full collapse

### Scenario 2 — Multi-Wallet Airdrop Defense
**Problem:** user holds the same airdrop across many wallets and cannot exit fast enough  
**RugShield response:** Guardian aggregates exposure across wallets and prepares coordinated exit logic

### Scenario 3 — Liquidity Trap
**Problem:** token price looks stable, but LP is disappearing and a market sell would destroy the user  
**RugShield response:** Guardian simulates the route, detects extreme slippage, and blocks the bad execution

### Scenario 4 — Full Portfolio Health Check
**Problem:** assets are spread across many wallets and chains  
**RugShield response:** Guardian pulls exposure, Scout scores top risks, and the system returns a unified health matrix

---

## 11. Why this project deserves attention

This is not just another “AI crypto copilot.”

RugShield focuses on an under-served but very real need:
**defending capital during fast-moving onchain failure events.**

It combines:
- chat-native UX
- structured dual-agent design
- wallet-aware defense logic
- MEV-aware execution thinking
- reproducible judge demo flow
- tight OKX ecosystem alignment

That combination gives it a strong story for both:
- **product practicality**
- **technical architecture**

---

## 12. Suggested demo script for judges

If you are presenting live, this is the cleanest sequence:

1. `npm run demo`
2. Explain: **Scout detects risk, Guardian protects capital**
3. Show the structured threat report
4. Show the rescue output into USDC
5. Explain Safe Mode vs Auto-Defense Mode
6. Close with:  
   **“Most agents help you chase pumps. RugShield helps you survive rugs.”**

---

## 13. Repository structure

```text
OKX-RugShield/
├── cli/rugshield.js
├── scripts/installer.js
├── skills/
│   ├── rugshield-scout/SKILL.md
│   └── rugshield-guardian/SKILL.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PRODUCTION_CHECKLIST.md
│   └── RUNBOOK.md
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 14. OpenClaw agent handoff instructions

If an OpenClaw agent receives this repository, it should:

1. Read `skills/rugshield-scout/SKILL.md`
2. Read `skills/rugshield-guardian/SKILL.md`
3. Run `npm install`
4. Run `node scripts/installer.js --core-only`
5. Ask the user to fill in `.env`
6. Run `node cli/rugshield.js`

---

**Powered by OpenClaw + OKX OnchainOS Skills.**
