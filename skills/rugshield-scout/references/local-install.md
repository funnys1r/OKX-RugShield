# Local Install

## Recommended installation strategy

Use a two-stage dependency model.

### Stage 1: install official OKX / OnchainOS skills

This project depends on upstream OKX capabilities for live token, wallet, and route-related behavior. Keep those as explicit prerequisites.

Recommended behavior:
- detect whether prerequisite skills exist
- if missing, show a short install checklist
- allow mock or analysis-only mode even when prerequisites are missing

Do not hard-crash for demo-only flows.

### Stage 2: install RugShield skills locally

Copy this skill folder into:

```bash
~/.openclaw/workspace/skills/rugshield-scout
```

Or use the bundled installer:

```bash
bash scripts/install-local.sh
```

## Contest recommendation

For a competition project, use graceful dependency detection rather than assuming the environment is already perfect.

Why:
- judges can still evaluate the skill in mock mode
- users get a clear prerequisite message
- live capability remains demonstrable when OKX skills are present
