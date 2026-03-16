#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-}"
shift || true

find_project_dir() {
  if [[ -n "${RUGSHIELD_PROJECT_DIR:-}" && -d "${RUGSHIELD_PROJECT_DIR}" ]]; then
    printf '%s\n' "${RUGSHIELD_PROJECT_DIR}"
    return 0
  fi

  local candidates=(
    "${PWD}/OKX-RugShield"
    "${PWD}/repo"
    "${HOME}/OKX-RugShield"
    "${HOME}/workspace/OKX-RugShield"
    "${HOME}/workspace-ops/OKX-RugShield"
  )

  local c
  for c in "${candidates[@]}"; do
    if [[ -f "$c/package.json" && -d "$c/cli" ]]; then
      printf '%s\n' "$c"
      return 0
    fi
  done

  return 1
}

PROJECT_DIR="$(find_project_dir || true)"
if [[ -z "$PROJECT_DIR" ]]; then
  echo "RugShield project not found. Set RUGSHIELD_PROJECT_DIR to the OKX-RugShield repo path." >&2
  exit 2
fi

cd "$PROJECT_DIR"

case "$MODE" in
  live)
    WALLET="${1:-}"
    CHAINS="${2:-}"
    LIMIT="${3:-1}"
    if [[ -z "$WALLET" || -z "$CHAINS" ]]; then
      echo "Usage: run-guardian.sh live <wallet> <chainCsv> [limit]" >&2
      exit 2
    fi
    node cli/live-portfolio-guardian.js -- "$WALLET" "$CHAINS" "$LIMIT"
    ;;
  simulate)
    node cli/simulate-guardian.js
    ;;
  *)
    cat >&2 <<'EOF'
Usage:
  run-guardian.sh live <wallet> <chainCsv> [limit]
  run-guardian.sh simulate
EOF
    exit 2
    ;;
esac
