# Local Install

## Dependency policy

Treat official OKX / OnchainOS skills as upstream dependencies.

Recommended runtime behavior:
- check whether prerequisite skills are available
- if available, enable live portfolio or route simulation paths
- if unavailable, downgrade to manual planning or simulation and clearly say what is missing

## Local installation

Copy this skill folder into:

```bash
~/.openclaw/workspace/skills/rugshield-guardian
```

Or use:

```bash
bash scripts/install-local.sh
```

## User messaging

Prefer this order:
1. detect
2. explain what is missing
3. provide exact install steps
4. continue in reduced mode when possible

This is more robust than assuming dependencies are always preinstalled.
