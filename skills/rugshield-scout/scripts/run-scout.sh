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
  mock)
    node cli/rugshield.js --mock
    ;;
  patrol-mock)
    node cli/patrol-mock.js
    ;;
  live)
    TOKEN="${1:-}"
    CHAIN="${2:-}"
    if [[ -z "$TOKEN" || -z "$CHAIN" ]]; then
      echo "Usage: run-scout.sh live <token> <chain>" >&2
      exit 2
    fi
    node cli/fetch-live-signal.js -- "$TOKEN" "$CHAIN"
    ;;
  replay)
    EVENT_PATH="${1:-mock/mock-rug-event.json}"
    node cli/replay-mock.js -- "$EVENT_PATH"
    ;;
  *)
    cat >&2 <<'EOF'
Usage:
  run-scout.sh mock
  run-scout.sh patrol-mock
  run-scout.sh live <token> <chain>
  run-scout.sh replay [path-to-event.json]
EOF
    exit 2
    ;;
esac
