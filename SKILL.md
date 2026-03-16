# SKILL.md - OKX RugShield

OKX RugShield is a dual-skill defensive workflow built on top of OpenClaw and OKX OnchainOS skills.

## Skill Layer

- `skills/rugshield-scout/`: detect rug-related risk signals and produce structured Threat Reports
- `skills/rugshield-guardian/`: inspect wallet exposure and generate staged defensive responses

## Integration Notes

- Use Demo Mode when official OKX dependencies are not yet installed.
- Use Live Mode only when upstream OKX / OnchainOS skills and credentials are present.
- Run `npm run preflight` before demos or judge walkthroughs.
