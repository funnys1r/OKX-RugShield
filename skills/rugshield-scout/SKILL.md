---
name: rugshield-scout
description: Detect rug-pull and onchain token risk signals, generate structured Threat Reports, and support mock or live token risk inspection with a RugShield-style workflow. Use when the user asks to scan a token, inspect abnormal liquidity or volume, analyze dev dumping or smart-money exits, run proactive patrols, replay mock rug events, or create a threat report for a token, wallet context, or chain.
---

# RugShield Scout

Inspect token risk and output a structured Threat Report.

## Workflow

1. Parse the target token, chain, and desired mode from the request.
2. Choose the lightest mode that satisfies the request:
   - mock event replay for demos or testing
   - patrol mock for proactive alert simulation
   - live signal fetch for real token or market context
3. Evaluate the strongest available signals:
   - liquidity drop
   - abnormal volume or price behavior
   - dev wallet sell pressure
   - smart-money exit
   - concentration or holder-distribution anomalies
4. Classify risk as `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
5. Produce a Threat Report.
6. If risk is `HIGH` or above, recommend handing off to `rugshield-guardian`.

## Output contract

Always include:

- token
- chain
- risk_level
- confidence
- key_signals
- brief_reasoning
- affected_tokens
- timestamp
- recommended_next_action

Prefer JSON when the user asks for machine-readable output. Otherwise provide a short Chinese summary followed by a structured block.

## Execution

Use bundled scripts for deterministic runs:

- `scripts/run-scout.sh mock` → mock demo
- `scripts/run-scout.sh patrol-mock` → proactive patrol simulation
- `scripts/run-scout.sh live <token> <chain>` → live token signal fetch
- `scripts/run-scout.sh replay <path-to-mock-event.json>` → replay a saved event

The script expects either:

- `RUGSHIELD_PROJECT_DIR` to point at the OKX-RugShield repo, or
- a sibling checkout discoverable from the current working directory.

If the project repo or dependencies are unavailable, fall back to manual analysis and clearly mark the result as non-executed.

## References

Read these only when needed:

- `references/risk-signals.md` for signal definitions and grading heuristics
- `references/threat-report-schema.md` for the Threat Report structure
- `references/local-install.md` for local install and dependency strategy

## Guardrails

- Do not claim live onchain verification unless the script actually ran successfully.
- Do not present a signal-only scan as portfolio defense; hand off to `rugshield-guardian` for exposure checks.
- Treat execution and trading language conservatively; this skill is for detection and reporting.
