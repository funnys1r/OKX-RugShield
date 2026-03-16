# Prompts and Scenarios

This document is provided for hackathon judging transparency and reproducibility.

It summarizes the prompt design, target scenarios, and expected behavior of OKX RugShield.

## Claw and model context

- Claw runtime: OpenClaw
- Model version: GPT-5.4
- Project structure: dual-skill workflow
- Skills: `rugshield-scout`, `rugshield-guardian`

This repository publishes the workflow, prompt structure, and expected outputs so judges can understand how the system is intended to operate.

## Application scenarios

RugShield targets a defensive onchain user journey.

### Scenario 1: risky token signal appears
A user or monitoring workflow notices unusual activity around a token.

Goal:
- identify whether the signal resembles rug-related behavior
- produce a structured Threat Report

### Scenario 2: user asks whether their wallet is exposed
A user wants to know whether they still hold the risky token or related exposure.

Goal:
- inspect wallet exposure
- rank urgency
- return a defensive plan

### Scenario 3: judge wants a reproducible demo
A reviewer needs a local path that does not depend on full live upstream configuration.

Goal:
- support mock replay
- support guardian simulation
- provide benchmark and preflight outputs

## Prompt design summary

The project uses a two-role prompt design.

### Scout prompt summary

Intent:
- interpret token and market signals conservatively
- identify rug-related warning patterns
- output a structured Threat Report

Expected reasoning pattern:
- inspect token and chain context
- evaluate liquidity, volume, dev behavior, and smart-money movement
- classify risk level
- recommend next action

Expected output fields:
- `token`
- `chain`
- `risk_level`
- `confidence`
- `key_signals`
- `brief_reasoning`
- `recommended_next_action`

Example user requests:
- `扫描 OKB 在 xlayer 上有没有 rug 风险`
- `帮我分析这个 token 有没有流动性异常`
- `回放一个 mock 风险事件并输出 Threat Report`

### Guardian prompt summary

Intent:
- map a Threat Report to wallet exposure
- generate a staged defensive response
- stay conservative about execution authority

Expected reasoning pattern:
- read threat context
- identify wallet and chains
- inspect exposure
- prioritize positions
- produce staged actions
- clarify execution conditions

Expected output fields:
- `threat_summary`
- `wallets_checked`
- `chains_checked`
- `exposed_positions`
- `risk_priority`
- `staged_exit_plan`
- `execution_condition`
- `confirmation_requirement`

Example user requests:
- `检查我这个地址有没有暴露在高风险 token 上`
- `根据 Threat Report 给我一个退出方案`
- `用 Safe Mode 输出一个防守建议`

## Demo scenarios

### Demo scenario A: scout mock
Command:

```bash
npm run demo
```

Expected result:
- mock scout output with `risk_level`, `confidence`, and `recommended_next_action`

### Demo scenario B: replay Threat Report
Command:

```bash
npm run replay:mock
```

Expected result:
- replayable Threat Report-style JSON

### Demo scenario C: guardian simulation
Command:

```bash
npm run simulate:guardian
```

Expected result:
- staged defense plan with exposed positions and confirmation requirement

### Demo scenario D: benchmark
Command:

```bash
npm run benchmark:verbose
```

Expected result:
- scenario-level reproducibility summary

## Live-prototype scenarios

### Live-prototype scenario A: live signal
Command:

```bash
npm run live:signal -- OKB xlayer
```

Expected result:
- prototype output for token and chain context

### Live-prototype scenario B: live portfolio
Command:

```bash
npm run live:portfolio -- 0x58e79a0c44e9bf71152bd2e51fea4c88b8a05097 xlayer,ethereum,base,arbitrum,bsc 1
```

Expected result:
- prototype wallet exposure output

## Boundaries

This repository currently publishes:
- prompt structure
- workflow design
- demo flows
- live prototype entry points
- benchmark and preflight paths

It does not claim:
- production-grade autonomous execution
- full real-money defense automation
- any capability beyond the documented demo and prototype scope
