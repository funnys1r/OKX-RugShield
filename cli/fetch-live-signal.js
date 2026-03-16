#!/usr/bin/env node
const { execFileSync } = require('child_process');

const tokenQuery = process.argv[2] || 'UNKNOWN';
const chain = process.argv[3] || 'unknown';

function runJson(args) {
  const env = { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.PATH || ''}` };
  const out = execFileSync('onchainos', args, { encoding: 'utf8', env, stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(out);
}

function safeRun(args) {
  try {
    return { ok: true, value: runJson(args) };
  } catch (error) {
    return {
      ok: false,
      error: String(error.stderr || error.message || error)
    };
  }
}

function pickBestToken(searchData, query) {
  const list = Array.isArray(searchData) ? searchData : [];
  const q = String(query || '').toUpperCase();
  return (
    list.find((x) => String(x.tokenSymbol || '').toUpperCase() === q) ||
    list.find((x) => String(x.tokenName || '').toUpperCase() === q) ||
    list[0] || null
  );
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function classifyRisk({ advanced, priceInfo, signals }) {
  let score = 0;
  const keySignals = [];

  if (advanced) {
    const riskLevel = String(advanced.riskControlLevel || '');
    const top10 = toNum(advanced.top10HoldPercent);
    const tags = Array.isArray(advanced.tokenTags) ? advanced.tokenTags : [];

    if (riskLevel === '1') keySignals.push('okx_risk_control_level_1');
    else if (riskLevel) {
      score += 2;
      keySignals.push(`okx_risk_control_level_${riskLevel}`);
    }

    if (top10 !== null && top10 >= 30) {
      score += 2;
      keySignals.push('top10_holder_concentration_high');
    } else if (top10 !== null && top10 > 0) {
      keySignals.push('top10_holder_concentration_observed');
    }

    if (tags.includes('communityRecognized')) keySignals.push('community_recognized');
    if (tags.some((x) => /volumeplunge/i.test(x))) {
      score += 1;
      keySignals.push('volume_plunge_tag');
    }
    if (tags.some((x) => /volumesurge/i.test(x))) keySignals.push('volume_surge_tag');
    if (tags.some((x) => /honeypot|suspicious/i.test(x))) {
      score += 3;
      keySignals.push('token_tag_risk_flag');
    }
  }

  if (priceInfo) {
    const liquidity = toNum(priceInfo.liquidity);
    const change24h = toNum(priceInfo.priceChange24H);
    if (liquidity !== null && liquidity < 100000) {
      score += 2;
      keySignals.push('low_liquidity');
    } else if (liquidity !== null) {
      keySignals.push('liquidity_present');
    }
    if (change24h !== null && change24h <= -30) {
      score += 2;
      keySignals.push('price_drop_24h_gt_30pct');
    } else if (change24h !== null) {
      keySignals.push('price_change_24h_observed');
    }
  }

  if (Array.isArray(signals) && signals.length > 0) {
    keySignals.push('smart_money_signal_present');
    const soldHigh = signals.some((s) => toNum(s.soldRatioPercent) !== null && toNum(s.soldRatioPercent) > 80);
    if (soldHigh) {
      score += 1;
      keySignals.push('signal_wallets_already_sold_heavily');
    }
  } else {
    keySignals.push('no_token_specific_signal_found');
  }

  let riskLevel = 'LOW';
  let confidence = 'low';
  if (score >= 5) {
    riskLevel = 'HIGH';
    confidence = 'medium';
  } else if (score >= 3) {
    riskLevel = 'MEDIUM';
    confidence = 'medium';
  } else {
    riskLevel = 'LOW';
    confidence = 'low';
  }

  return { riskLevel, confidence, keySignals: Array.from(new Set(keySignals)) };
}

const search = safeRun(['token', 'search', '--query', tokenQuery, '--chains', chain]);
if (!search.ok || !search.value.ok) {
  console.log(JSON.stringify({
    mode: 'live-error-fallback',
    component: 'rugshield-scout',
    token: tokenQuery,
    chain,
    risk_level: 'unknown',
    confidence: 'low',
    key_signals: ['live_search_failed'],
    brief_reasoning: 'Official OKX token search did not complete successfully in this environment.',
    affected_tokens: [tokenQuery],
    timestamp: new Date().toISOString(),
    recommended_next_action: 'Retry after checking onchainos CLI installation, credentials, and network connectivity.'
  }, null, 2));
  process.exit(0);
}

const picked = pickBestToken(search.value.data, tokenQuery);
if (!picked) {
  console.log(JSON.stringify({
    mode: 'live-no-match',
    component: 'rugshield-scout',
    token: tokenQuery,
    chain,
    risk_level: 'unknown',
    confidence: 'low',
    key_signals: ['token_not_found'],
    brief_reasoning: 'Official OKX token search returned no matching token for this query on the requested chain.',
    affected_tokens: [],
    timestamp: new Date().toISOString(),
    recommended_next_action: 'Verify the token symbol or contract address and try again.'
  }, null, 2));
  process.exit(0);
}

const address = picked.tokenContractAddress;
const priceInfoRes = safeRun(['token', 'price-info', '--address', address, '--chain', chain]);
const advancedRes = safeRun(['token', 'advanced-info', '--address', address, '--chain', chain]);
const signalRes = safeRun(['signal', 'list', '--chain', chain, '--token-address', address]);

const priceInfo = priceInfoRes.ok && priceInfoRes.value.ok && Array.isArray(priceInfoRes.value.data) ? priceInfoRes.value.data[0] : null;
const advanced = advancedRes.ok && advancedRes.value.ok ? advancedRes.value.data : null;
const signals = signalRes.ok && signalRes.value.ok && Array.isArray(signalRes.value.data) ? signalRes.value.data : [];

const { riskLevel, confidence, keySignals } = classifyRisk({ advanced, priceInfo, signals });
const notes = [];
if (picked.tagList && picked.tagList.communityRecognized) notes.push('Token is community-recognized in OKX search results.');
if (priceInfo && priceInfo.liquidity) notes.push(`Observed liquidity: ${priceInfo.liquidity}`);
if (priceInfo && priceInfo.priceChange24H) notes.push(`24h change: ${priceInfo.priceChange24H}%`);
if (advanced && advanced.top10HoldPercent) notes.push(`Top10 holder concentration: ${advanced.top10HoldPercent}%`);
if (signals.length === 0) notes.push('No token-specific smart-money signal found in current signal query.');

console.log(JSON.stringify({
  mode: 'live-okx-cli',
  component: 'rugshield-scout',
  token: picked.tokenSymbol || tokenQuery,
  chain,
  risk_level: riskLevel,
  confidence,
  key_signals: keySignals,
  brief_reasoning: notes.join(' '),
  affected_tokens: Array.from(new Set([picked.tokenSymbol || tokenQuery, tokenQuery].filter(Boolean))),
  timestamp: new Date().toISOString(),
  recommended_next_action: riskLevel === 'HIGH' || riskLevel === 'CRITICAL'
    ? 'Run rugshield-guardian against wallets exposed to this asset.'
    : 'If portfolio exposure matters, run rugshield-guardian for wallet-level confirmation.'
}, null, 2));
