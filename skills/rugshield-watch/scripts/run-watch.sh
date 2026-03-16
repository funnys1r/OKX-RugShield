#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-summary-default}"
ARG2="${2:-}"

resolve_repo() {
  if [[ -n "${RUGSHIELD_PROJECT_DIR:-}" && -d "${RUGSHIELD_PROJECT_DIR}" ]]; then
    printf '%s\n' "$RUGSHIELD_PROJECT_DIR"
    return 0
  fi

  local here
  here="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
  if [[ -f "$here/package.json" && -d "$here/cli" ]]; then
    printf '%s\n' "$here"
    return 0
  fi

  local sibling="$(pwd)/OKX-RugShield"
  if [[ -f "$sibling/package.json" && -d "$sibling/cli" ]]; then
    printf '%s\n' "$sibling"
    return 0
  fi

  echo "Unable to locate OKX-RugShield repo. Set RUGSHIELD_PROJECT_DIR first." >&2
  return 1
}

REPO_DIR="$(resolve_repo)"
cd "$REPO_DIR"

case "$MODE" in
  summary-default)
    node cli/watch-wallets.js --config ./config/watch-wallets.example.json --summary-only
    ;;
  json-default)
    node cli/watch-wallets.js --config ./config/watch-wallets.example.json --json
    ;;
  summary-config)
    if [[ -z "$ARG2" ]]; then
      echo "summary-config requires a config path" >&2
      exit 1
    fi
    node cli/watch-wallets.js --config "$ARG2" --summary-only
    ;;
  *)
    echo "Unknown mode: $MODE" >&2
    echo "Supported: summary-default | json-default | summary-config <path>" >&2
    exit 1
    ;;
esac
