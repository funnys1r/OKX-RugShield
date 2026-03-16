---
name: rugshield-guardian
description: Analyze wallet exposure against a rug-risk Threat Report, generate staged defensive exit plans, and simulate protective onchain responses with a RugShield-style workflow. Use when the user asks to inspect wallet or portfolio exposure, check risky positions across chains, create a defensive sell or exit plan, simulate guardian actions, or respond to a high-risk token alert.
---

# RugShield Guardian

Check portfolio exposure and produce a defensive action plan.

## Workflow

1. Obtain a Threat Report, risky token, or equivalent alert context.
2. Identify wallet addresses and target chains.
3. Choose execution mode:
   - portfolio live check for real exposure analysis
   - simulate guardian for route and staged-exit simulation
4. Filter holdings to positions exposed to the risky asset or related assets.
5. Rank positions by urgency.
6. Build a staged exit or defense plan.
7. State execution conditions explicitly:
   - Safe Mode requires confirmation
   - Auto mode must still be labeled as conditional unless the environment truly supports execution
8. Output an auditable defense report.

## Output contract

Always include:

- threat_summary
- wallets_checked
- chains_checked
- exposed_positions
- risk_priority
- staged_exit_plan
- slippage_or_liquidity_notes
- execution_condition
- confirmation_requirement

Prefer JSON when the user asks for machine-readable output. Otherwise give a short Chinese conclusion first, then the structured defense block.

## Execution

Use bundled scripts for deterministic runs:

- `scripts/run-guardian.sh live <wallet> <chainCsv> [limit]` → live portfolio defense report
- `scripts/run-guardian.sh simulate` → simulate guardian flow

The script expects either:

- `RUGSHIELD_PROJECT_DIR` to point at the OKX-RugShield repo, or
- a sibling checkout discoverable from the current working directory.

If the project repo or dependencies are unavailable, fall back to a manual plan and clearly state that no live portfolio check was executed.

## References

Read these only when needed:

- `references/portfolio-schema.md` for input expectations
- `references/guardian-output-schema.md` for final output structure
- `references/modes.md` for Safe Mode vs Auto-Defense interpretation
- `references/local-install.md` for local install and dependency strategy

## Guardrails

- Do not imply actual asset disposal unless execution is truly available and explicitly authorized.
- Separate exposure analysis from execution authority.
- Keep every recommendation auditable: reason, affected positions, and conditions.
