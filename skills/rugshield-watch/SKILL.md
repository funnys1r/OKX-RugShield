---
name: rugshield-watch
description: Run one-shot or scheduled RugShield wallet patrols from natural-language requests. Use when the user says things like “马上检查一次”, “查一下”, “看一下有没有问题”, “按默认方案开”, “帮我盯着这个钱包”, “看着这个地址”, “以后定时查”, “每 30 分钟查一次”, “只在有问题时提醒我”, or asks for a default wallet check, watchlist summary, recurring patrol, alert-only monitoring, or multi-wallet meme/rug risk monitoring across onchain wallets.
---

# RugShield Watch

This skill turns the agent into the **watch / patrol layer** of RugShield.

Use it to bridge natural-language monitoring requests into the watcher runtime instead of falling back to browser checks or vague manual analysis.

## Core rule

When the user expresses monitoring intent, prefer this skill over generic public-source inspection.

Typical monitoring intent includes:
- `马上检查一次`
- `查一下`
- `看一下有没有问题`
- `按默认方案开`
- `帮我盯着这个钱包`
- `看着这个地址`
- `定时查一下`
- `以后定时看一下`
- `只在有问题的时候提醒我`
- `看下默认 watchlist`

## Intent mapping

### 1. One-shot patrol
If the user asks for a quick check, immediate scan, or “查一下 / 看一下 / 马上检查一次”:
- run a one-shot watcher summary
- prefer default config when wallet list is not specified
- return a concise Chinese summary first

### 2. Wallet-specific watch
If the user provides one or more wallet addresses:
- run watcher with an ad-hoc config built from those wallets, or
- if only one wallet is provided and the request is clearly exposure-oriented, Guardian may still be appropriate
- when the user says “盯着 / 看着 / 以后帮我查”, prefer watch mode over a one-off Guardian report

### 3. Scheduled patrol intent
If the user asks for recurring checks:
- do not pretend scheduling is already active unless it was actually configured
- first confirm the intended default frequency if the user did not specify one
- default recommendation: every 30 minutes, alert on new high-risk / worsening risk
- if the environment has not yet wired persistent scheduling, say so clearly and offer immediate one-shot patrol plus proposed schedule parameters

## Output discipline

Default chat output should be:
1. one-line conclusion
2. concise Chinese structured summary
3. next-step suggestion only if needed

Do not dump raw developer JSON unless the user asks for JSON or automation output.

## Execution

Use the bundled script for deterministic runs:

- `scripts/run-watch.sh summary-default` → one-shot default watcher summary
- `scripts/run-watch.sh summary-config <config>` → one-shot summary with explicit config
- `scripts/run-watch.sh json-default` → machine-readable default watcher run

The script expects either:
- `RUGSHIELD_PROJECT_DIR` to point at the OKX-RugShield repo, or
- a sibling checkout discoverable from the current working directory.

## References

Read these only when needed:
- `references/intent-mapping.md` for natural-language intent → action rules
- `references/defaults.md` for default patrol behavior and safe fallback rules

## Guardrails

- Do not silently downgrade to browser/public-source mode without saying the RugShield watcher path failed first.
- Do not claim recurring monitoring is active unless a persistent schedule was actually created.
- Prefer default behavior over asking the user to restate in a rigid phrase.
- If intent is ambiguous, choose the safest useful default: one-shot summary patrol.
