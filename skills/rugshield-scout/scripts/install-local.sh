#!/usr/bin/env bash
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_ROOT="${1:-${HOME}/.openclaw/workspace/skills}"
TARGET_DIR="${TARGET_ROOT}/rugshield-scout"

mkdir -p "$TARGET_ROOT"
rm -rf "$TARGET_DIR"
cp -R "$SKILL_DIR" "$TARGET_DIR"

cat <<EOF
[OK] Installed rugshield-scout to:
  $TARGET_DIR

Next steps:
1. Ensure the OKX-RugShield project repo is present locally.
2. Optionally set:
   export RUGSHIELD_PROJECT_DIR=/path/to/OKX-RugShield
3. If official OKX / OnchainOS dependency skills are missing, install them first.
EOF
