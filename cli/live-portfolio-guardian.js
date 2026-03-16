#!/usr/bin/env node
const { spawnSync } = require('child_process');

const wallet = process.argv[2] || 'unknown-wallet';
const chains = (process.argv[3] || 'xlayer').split(',').map((x) => x.trim()).filter(Boolean);
const limit = Number(process.argv[4] || 5);

function runJson(args) {
  const env = { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.PATH || ''}` };
  const result = spawnSync('onchainos', args, { encoding: 'utf8', env });
  const stdout = String(result.stdout || '').trim();
  const stderr = String(result.stderr || '').trim();
  let parsed = null;
  try {
    parsed = stdout ? JSON.parse(stdout) : null;
  } catch (_) {
    parsed = null;
  }
  return {
    status: result.status,
    stdout,
    stderr,
    parsed
  };
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const res = runJson(['portfolio', 'all-balances', '--address', wallet, '--chains', chains.join(',')]);
const apiError = res.parsed && res.parsed.error ? String(res.parsed.error) : '';
const raw = [apiError, res.stderr, res.stdout].filter(Boolean).join(' | ');
const authIssue = /Timestamp request expired|50102/i.test(raw);

if (res.status !== 0 || !res.parsed || res.parsed.ok !== true) {
  console.log(JSON.stringify({
    mode: authIssue ? 'live-auth-fallback' : 'live-error-fallback',
    component: 'rugshield-guardian',
    threat_summary: authIssue
      ? 'Live portfolio query reached official OKX CLI path but failed on authenticated timestamp validation.'
      : 'Live portfolio query did not complete successfully via official OKX CLI path.',
    wallets_checked: [wallet],
    chains_checked: chains,
    exposed_positions: [],
    risk_priority: 'unknown',
    staged_exit_plan: authIssue
      ? [
          'Fix host clock or timestamp validation first.',
          'Retry live portfolio query after time sync is corrected.',
          'Use manual review or simulation until authenticated portfolio endpoints succeed.'
        ]
      : [
          'Check onchainos CLI installation and connectivity.',
          'Retry portfolio query.',
          'Use manual review or simulation until live portfolio succeeds.'
        ],
    slippage_or_liquidity_notes: 'unavailable',
    execution_condition: authIssue
      ? 'authenticated portfolio path blocked by timestamp validation in current environment'
      : 'no live portfolio execution path available from current authenticated environment',
    confirmation_requirement: 'required in Safe Mode'
  }, null, 2));
  process.exit(0);
}

const rawBalances = Array.isArray(res.parsed.data) ? res.parsed.data : [];
const positions = rawBalances
  .map((item) => {
    const usdValue = toNum(item.tokenPriceUsd) !== null && toNum(item.balance) !== null
      ? toNum(item.tokenPriceUsd) * toNum(item.balance)
      : (toNum(item.usdValue) || 0);
    return {
      token: item.symbol || item.tokenSymbol || 'unknown',
      chain: item.chainName || item.chain || 'unknown',
      amount: toNum(item.balance) ?? item.balance ?? 'unknown',
      usd_value: usdValue,
      priority: 0,
      contract: item.tokenContractAddress || '(native)'
    };
  })
  .sort((a, b) => (b.usd_value || 0) - (a.usd_value || 0))
  .slice(0, Math.max(1, limit));

positions.forEach((p, idx) => { p.priority = idx + 1; });

const priority = positions.length === 0 ? 'monitor' : (positions[0].usd_value || 0) > 1000 ? 'immediate' : 'elevated';
const plan = positions.length === 0
  ? ['No live exposure returned from current balance query. Monitor only.']
  : [
      'review highest-value direct exposure first',
      'reduce positions in stages rather than one shot when liquidity is uncertain',
      're-check balances and market conditions before any further action'
    ];

console.log(JSON.stringify({
  mode: 'live-okx-cli',
  component: 'rugshield-guardian',
  threat_summary: 'Live portfolio query completed through official OKX CLI path.',
  wallets_checked: [wallet],
  chains_checked: chains,
  exposed_positions: positions,
  risk_priority: priority,
  staged_exit_plan: plan,
  slippage_or_liquidity_notes: 'Liquidity and route quality should still be checked before any real execution.',
  execution_condition: 'analysis only unless separate execution authority is explicitly granted',
  confirmation_requirement: 'required in Safe Mode'
}, null, 2));
