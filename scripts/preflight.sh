#!/usr/bin/env bash
set -euo pipefail

# RugShield preflight for demo/live readiness.
# Safe to run on a judge or local machine.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE_DEFAULT="${HOME}/.openclaw/workspace"
SKILLS_DIR="${OPENCLAW_SKILLS_DIR:-${WORKSPACE_DEFAULT}/skills}"
RUGSHIELD_PROJECT_DIR="${RUGSHIELD_PROJECT_DIR:-$ROOT_DIR}"
ENV_FILE="${RUGSHIELD_ENV_FILE:-${RUGSHIELD_PROJECT_DIR}/.env}"

ok=0
warn=0
fail=0

has_cmd() { command -v "$1" >/dev/null 2>&1; }
line() { printf '%s\n' "$*"; }
pass() { line "[OK]   $*"; ok=$((ok+1)); }
warning() { line "[WARN] $*"; warn=$((warn+1)); }
failure() { line "[FAIL] $*"; fail=$((fail+1)); }
section() { printf '\n== %s ==\n' "$*"; }

check_file_contains() {
  local file="$1" key="$2"
  [[ -f "$file" ]] && grep -Eq "^[[:space:]]*${key}=" "$file"
}

check_skill_like() {
  local pattern="$1"
  find "$SKILLS_DIR" -maxdepth 2 -type f \( -name SKILL.md -o -name package.json \) 2>/dev/null | grep -Eiq "$pattern"
}

section "Runtime"
if has_cmd node; then
  NODE_VERSION="$(node -v)"
  pass "Node detected: ${NODE_VERSION}"
else
  failure "Node.js not found"
fi

if has_cmd npm; then
  NPM_VERSION="$(npm -v)"
  pass "npm detected: ${NPM_VERSION}"
else
  failure "npm not found"
fi

if has_cmd openclaw; then
  OPENCLAW_VERSION="$(openclaw --version 2>/dev/null || true)"
  pass "OpenClaw detected${OPENCLAW_VERSION:+: ${OPENCLAW_VERSION}}"
else
  warning "OpenClaw CLI not found; local skill install path may still be usable if OpenClaw is installed elsewhere"
fi

section "Project"
if [[ -f "${RUGSHIELD_PROJECT_DIR}/package.json" ]]; then
  pass "Project package.json found at ${RUGSHIELD_PROJECT_DIR}"
else
  failure "Project package.json not found at ${RUGSHIELD_PROJECT_DIR}"
fi

for required in cli/rugshield.js cli/fetch-live-signal.js cli/live-portfolio-guardian.js; do
  if [[ -f "${RUGSHIELD_PROJECT_DIR}/${required}" ]]; then
    pass "Found ${required}"
  else
    warning "Missing ${required}"
  fi
done

section "Skills"
if [[ -d "$SKILLS_DIR" ]]; then
  pass "OpenClaw skills dir detected: ${SKILLS_DIR}"
else
  warning "Skills dir not found yet: ${SKILLS_DIR}"
fi

if [[ -d "${SKILLS_DIR}/rugshield-scout" ]]; then
  pass "rugshield-scout installed"
else
  warning "rugshield-scout not installed to ${SKILLS_DIR}"
fi

if [[ -d "${SKILLS_DIR}/rugshield-guardian" ]]; then
  pass "rugshield-guardian installed"
else
  warning "rugshield-guardian not installed to ${SKILLS_DIR}"
fi

if check_skill_like 'okx|onchainos'; then
  pass "Official OKX / OnchainOS-related skill detected"
else
  warning "Official OKX / OnchainOS-related skill not detected; live mode may be limited"
fi

section "Configuration"
if [[ -f "$ENV_FILE" ]]; then
  pass ".env found: ${ENV_FILE}"
else
  warning ".env not found at ${ENV_FILE}"
fi

for key in OKX_API_KEY OKX_API_SECRET OKX_API_PASSPHRASE; do
  if check_file_contains "$ENV_FILE" "$key"; then
    pass "${key} configured"
  else
    warning "${key} missing"
  fi
done

if check_file_contains "$ENV_FILE" "AUTO_DEFENSE_MODE"; then
  pass "AUTO_DEFENSE_MODE configured"
else
  warning "AUTO_DEFENSE_MODE not configured; Safe Mode assumed"
fi

section "Mode Readiness"
if [[ -f "${RUGSHIELD_PROJECT_DIR}/mock/mock-rug-event.json" ]]; then
  pass "Demo mode ready: mock event sample present"
else
  warning "Demo mode sample missing: mock/mock-rug-event.json"
fi

LIVE_READY=1
[[ -f "$ENV_FILE" ]] || LIVE_READY=0
check_skill_like 'okx|onchainos' || LIVE_READY=0
for key in OKX_API_KEY OKX_API_SECRET OKX_API_PASSPHRASE; do
  check_file_contains "$ENV_FILE" "$key" || LIVE_READY=0
done

if [[ "$LIVE_READY" -eq 1 ]]; then
  pass "Live mode likely available"
else
  warning "Live mode not fully ready; demo/mock/manual-analysis mode recommended"
fi

section "Summary"
line "Passed:  ${ok}"
line "Warnings:${warn}"
line "Failed:  ${fail}"

if [[ "$fail" -gt 0 ]]; then
  line "\nResult: NOT READY"
  exit 1
fi

if [[ "$warn" -gt 0 ]]; then
  line "\nResult: PARTIALLY READY"
  exit 0
fi

line "\nResult: READY"
