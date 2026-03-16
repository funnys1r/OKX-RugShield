#!/usr/bin/env bash
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_ROOT="${1:-${HOME}/.openclaw/workspace/skills}"
TARGET_DIR="${TARGET_ROOT}/rugshield-watch"

mkdir -p "$TARGET_ROOT"
rm -rf "$TARGET_DIR"
cp -R "$SKILL_DIR" "$TARGET_DIR"
chmod +x "$TARGET_DIR/scripts/run-watch.sh" || true

cat <<EOF
[OK] Installed rugshield-watch to:
  $TARGET_DIR

Next steps:
1. Ensure the OKX-RugShield project repo is present locally.
2. Optionally set:
   export RUGSHIELD_PROJECT_DIR=/path/to/OKX-RugShield
3. Use natural language like:
   - 马上检查一次
   - 按默认方案开
   - 帮我盯着这个钱包
EOF
