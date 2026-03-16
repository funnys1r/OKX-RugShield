#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);

function getArg(name, fallback = null) {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] || fallback;
}

const configPath = path.resolve(process.cwd(), getArg('--config', './config/watch-wallets.example.json'));
const statePath = path.resolve(process.cwd(), getArg('--state', './data/last-watch-scan.json'));
const wantJson = args.includes('--json');
const summaryOnly = args.includes('--summary-only');

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function runGuardian(wallet, chains, limit) {
  const cmdArgs = ['cli/live-portfolio-guardian.js', wallet, chains.join(','), String(limit), '--json'];
  const result = spawnSync('node', cmdArgs, { cwd: process.cwd(), encoding: 'utf8' });
  const stdout = String(result.stdout || '').trim();
  const stderr = String(result.stderr || '').trim();
  let parsed = null;
  try {
    parsed = stdout ? JSON.parse(stdout) : null;
  } catch (_) {
    parsed = null;
  }
  return {
    ok: result.status === 0 && parsed,
    status: result.status,
    stdout,
    stderr,
    parsed
  };
}

function riskWeight(level) {
  return ({ high: 3, medium: 2, low: 1 })[level] || 0;
}

function priorityWeight(level) {
  return ({ immediate: 3, elevated: 2, monitor: 1, unknown: 0 })[level] || 0;
}

function notifyRuleEnabled(rules, key) {
  return Array.isArray(rules) && rules.includes(key);
}

function toMap(positions) {
  const map = new Map();
  for (const p of Array.isArray(positions) ? positions : []) {
    map.set(`${p.chain}:${p.contract}:${p.token}`, p);
  }
  return map;
}

function diffWallet(prev, current) {
  const prevMap = toMap(prev && prev.exposed_positions);
  const currMap = toMap(current && current.exposed_positions);
  const prevTop = Array.isArray(prev && prev.exposed_positions) ? prev.exposed_positions[0] : null;
  const currTop = Array.isArray(current && current.exposed_positions) ? current.exposed_positions[0] : null;

  const newPositions = [];
  const increasedRisk = [];
  const removedPositions = [];

  for (const [key, curr] of currMap.entries()) {
    const old = prevMap.get(key);
    if (!old) {
      newPositions.push(curr);
      continue;
    }
    if (riskWeight(curr.risk_level) > riskWeight(old.risk_level)) {
      increasedRisk.push({ before: old, after: curr });
    }
  }

  for (const [key, old] of prevMap.entries()) {
    if (!currMap.has(key)) removedPositions.push(old);
  }

  const previousPriority = prev && prev.risk_priority ? prev.risk_priority : 'unknown';
  const currentPriority = current && current.risk_priority ? current.risk_priority : 'unknown';
  const riskPriorityRaised = priorityWeight(currentPriority) > priorityWeight(previousPriority);

  const topExposureChanged = Boolean(currTop) && (!prevTop || `${currTop.chain}:${currTop.contract}:${currTop.token}` !== `${prevTop.chain}:${prevTop.contract}:${prevTop.token}`);

  const previousTotal = Number(prev && prev.portfolio_summary && prev.portfolio_summary.total_usd_value || 0);
  const currentTotal = Number(current && current.portfolio_summary && current.portfolio_summary.total_usd_value || 0);
  const totalValueChange = currentTotal - previousTotal;

  return {
    newPositions,
    increasedRisk,
    removedPositions,
    riskPriorityRaised,
    previousPriority,
    currentPriority,
    topExposureChanged,
    previousTopExposure: prevTop,
    currentTopExposure: currTop,
    previousTotalValue: previousTotal,
    currentTotalValue: currentTotal,
    totalValueChange
  };
}

function createAlert(walletName, type, severity, message, extra = {}) {
  return {
    wallet_name: walletName,
    type,
    severity,
    message,
    ...extra
  };
}

function buildWalletAlerts(walletCfg, report, diff, notifyOn) {
  const walletName = walletCfg.name || walletCfg.address;
  const alerts = [];

  for (const p of diff.newPositions) {
    if (p.risk_level === 'high' && notifyRuleEnabled(notifyOn, 'new_high_risk')) {
      alerts.push(createAlert(walletName, 'new_high_risk', 'high', `新增高风险仓位 ${p.token} @ ${p.chain}，估值 $${Number(p.usd_value || 0).toFixed(2)}`, {
        token: p.token,
        chain: p.chain,
        usd_value: p.usd_value
      }));
    } else if (p.risk_level === 'medium' && notifyRuleEnabled(notifyOn, 'new_medium_risk')) {
      alerts.push(createAlert(walletName, 'new_medium_risk', 'medium', `新增中风险仓位 ${p.token} @ ${p.chain}，估值 $${Number(p.usd_value || 0).toFixed(2)}`, {
        token: p.token,
        chain: p.chain,
        usd_value: p.usd_value
      }));
    }
  }

  for (const change of diff.increasedRisk) {
    if (notifyRuleEnabled(notifyOn, 'risk_upgraded')) {
      alerts.push(createAlert(walletName, 'risk_upgraded', 'high', `${change.after.token} @ ${change.after.chain} 风险从 ${change.before.risk_level} 升到 ${change.after.risk_level}`, {
        token: change.after.token,
        chain: change.after.chain,
        before: change.before.risk_level,
        after: change.after.risk_level
      }));
    }
  }

  if (diff.riskPriorityRaised && notifyRuleEnabled(notifyOn, 'risk_priority_raised')) {
    alerts.push(createAlert(walletName, 'risk_priority_raised', 'high', `钱包整体风险优先级从 ${diff.previousPriority} 升到 ${diff.currentPriority}`));
  }

  if (diff.topExposureChanged && diff.currentTopExposure && notifyRuleEnabled(notifyOn, 'new_top_exposure')) {
    alerts.push(createAlert(walletName, 'new_top_exposure', 'medium', `新的头号敞口变为 ${diff.currentTopExposure.token} @ ${diff.currentTopExposure.chain}，估值 $${Number(diff.currentTopExposure.usd_value || 0).toFixed(2)}`, {
      token: diff.currentTopExposure.token,
      chain: diff.currentTopExposure.chain,
      usd_value: diff.currentTopExposure.usd_value
    }));
  }

  if (Math.abs(diff.totalValueChange) >= Number(walletCfg.value_change_alert_usd || 0) && Number(walletCfg.value_change_alert_usd || 0) > 0 && notifyRuleEnabled(notifyOn, 'value_change')) {
    const direction = diff.totalValueChange > 0 ? '上升' : '下降';
    alerts.push(createAlert(walletName, 'value_change', 'medium', `钱包估值较上次${direction} $${Math.abs(diff.totalValueChange).toFixed(2)}`));
  }

  const highRiskCount = Array.isArray(report.risk_groups && report.risk_groups.high) ? report.risk_groups.high.length : 0;
  if (highRiskCount > 0 && notifyRuleEnabled(notifyOn, 'existing_high_risk')) {
    alerts.push(createAlert(walletName, 'existing_high_risk', 'high', `当前仍存在 ${highRiskCount} 个高风险仓位需要关注`));
  }

  return alerts;
}

function summarizeWallet(walletCfg, report, diff, walletAlerts) {
  const summary = report.portfolio_summary || {};
  return {
    name: walletCfg.name || walletCfg.address,
    address: walletCfg.address,
    chains: report.chains_checked || walletCfg.chains || [],
    total_usd_value: summary.total_usd_value || 0,
    returned_positions: summary.returned_positions || 0,
    filtered_dust_positions: summary.filtered_dust_positions || 0,
    filtered_zero_value_positions: summary.filtered_zero_value_positions || 0,
    risk_priority: report.risk_priority || 'unknown',
    high_risk_count: Array.isArray(report.risk_groups && report.risk_groups.high) ? report.risk_groups.high.length : 0,
    medium_risk_count: Array.isArray(report.risk_groups && report.risk_groups.medium) ? report.risk_groups.medium.length : 0,
    top_exposures: Array.isArray(report.exposed_positions) ? report.exposed_positions.slice(0, 3) : [],
    alert_count: walletAlerts.length,
    alerts: walletAlerts,
    diff
  };
}

function buildAlertSummary(alerts) {
  const counts = { high: 0, medium: 0, low: 0 };
  const byType = {};
  for (const alert of alerts) {
    counts[alert.severity] = (counts[alert.severity] || 0) + 1;
    byType[alert.type] = (byType[alert.type] || 0) + 1;
  }
  return { severity_counts: counts, type_counts: byType };
}

function printReport(output) {
  if (wantJson) {
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  const lines = [];
  lines.push('=== RugShield Watcher 多钱包巡检报告 ===');
  lines.push(`巡检标签：${output.scan_label}`);
  lines.push(`扫描时间：${output.scanned_at}`);
  lines.push(`钱包数量：${output.wallet_count}`);
  lines.push(`告警数量：${output.alert_count}`);
  lines.push(`高优先级告警：${output.alert_summary.severity_counts.high || 0}`);
  lines.push(`中优先级告警：${output.alert_summary.severity_counts.medium || 0}`);
  lines.push('');

  if (output.alert_count > 0) {
    lines.push('[新增/恶化风险摘要]');
    output.alerts.forEach((alert, idx) => {
      lines.push(`${idx + 1}. [${alert.severity}] ${alert.wallet_name} | ${alert.type} | ${alert.message}`);
    });
    lines.push('');
  } else {
    lines.push('[新增/恶化风险摘要]');
    lines.push('- 本次未发现需要主动提醒的新风险变化');
    lines.push('');
  }

  if (summaryOnly) {
    console.log(lines.join('\n'));
    return;
  }

  output.wallets.forEach((wallet, idx) => {
    lines.push(`[钱包 ${idx + 1}] ${wallet.name}`);
    lines.push(`- 地址：${wallet.address}`);
    lines.push(`- 链：${wallet.chains.join(', ')}`);
    lines.push(`- 风险优先级：${wallet.risk_priority}`);
    lines.push(`- 估算总价值：$${Number(wallet.total_usd_value || 0).toFixed(2)}`);
    lines.push(`- 高风险仓位：${wallet.high_risk_count}`);
    lines.push(`- 中风险仓位：${wallet.medium_risk_count}`);
    lines.push(`- 已过滤垃圾仓位：${wallet.filtered_dust_positions}`);
    lines.push(`- 钱包级告警：${wallet.alert_count}`);
    if (wallet.top_exposures.length > 0) {
      lines.push('- 重点敞口：');
      wallet.top_exposures.forEach((p) => {
        lines.push(`  • ${p.token} | ${p.chain} | $${Number(p.usd_value || 0).toFixed(2)} | ${p.risk_level}`);
      });
    }
    if (wallet.diff.newPositions.length > 0) {
      lines.push(`- 新增可见仓位：${wallet.diff.newPositions.length}`);
    }
    if (wallet.diff.increasedRisk.length > 0) {
      lines.push(`- 风险上升仓位：${wallet.diff.increasedRisk.length}`);
    }
    if (wallet.diff.topExposureChanged && wallet.diff.currentTopExposure) {
      lines.push(`- 头号敞口变化：${wallet.diff.currentTopExposure.token} @ ${wallet.diff.currentTopExposure.chain}`);
    }
    lines.push('');
  });

  console.log(lines.join('\n'));
}

const config = readJson(configPath, null);
if (!config || !Array.isArray(config.wallets) || config.wallets.length === 0) {
  console.error(`Invalid watch config: ${configPath}`);
  process.exit(1);
}

const previous = readJson(statePath, { wallets: [] });
const previousMap = new Map((previous.wallets || []).map((w) => [w.address, w.raw_report]));

const alerts = [];
const walletOutputs = [];
const rawStateWallets = [];
const defaults = config.defaults || {};

for (const walletCfg of config.wallets) {
  const chains = Array.isArray(walletCfg.chains) && walletCfg.chains.length > 0 ? walletCfg.chains : (defaults.chains || ['xlayer']);
  const limit = walletCfg.limit || defaults.limit || 8;
  const notifyOn = Array.isArray(walletCfg.notify_on) && walletCfg.notify_on.length > 0 ? walletCfg.notify_on : (defaults.notify_on || []);
  const run = runGuardian(walletCfg.address, chains, limit);

  if (!run.ok || !run.parsed) {
    const alert = createAlert(walletCfg.name || walletCfg.address, 'scan_failed', 'high', run.stderr || 'Guardian scan failed');
    alerts.push(alert);
    walletOutputs.push({
      name: walletCfg.name || walletCfg.address,
      address: walletCfg.address,
      chains,
      total_usd_value: 0,
      returned_positions: 0,
      filtered_dust_positions: 0,
      filtered_zero_value_positions: 0,
      risk_priority: 'unknown',
      high_risk_count: 0,
      medium_risk_count: 0,
      top_exposures: [],
      alert_count: 1,
      alerts: [alert],
      diff: {
        newPositions: [],
        increasedRisk: [],
        removedPositions: [],
        riskPriorityRaised: false,
        previousPriority: 'unknown',
        currentPriority: 'unknown',
        topExposureChanged: false,
        previousTopExposure: null,
        currentTopExposure: null,
        previousTotalValue: 0,
        currentTotalValue: 0,
        totalValueChange: 0
      }
    });
    rawStateWallets.push({ address: walletCfg.address, raw_report: null });
    continue;
  }

  const prevReport = previousMap.get(walletCfg.address);
  const diff = diffWallet(prevReport, run.parsed);
  const walletAlerts = buildWalletAlerts(walletCfg, run.parsed, diff, notifyOn);

  alerts.push(...walletAlerts);
  walletOutputs.push(summarizeWallet(walletCfg, run.parsed, diff, walletAlerts));
  rawStateWallets.push({ address: walletCfg.address, raw_report: run.parsed });
}

const output = {
  scan_label: config.scan_label || 'rugshield-wallet-watch',
  scanned_at: new Date().toISOString(),
  wallet_count: walletOutputs.length,
  alert_count: alerts.length,
  alert_summary: buildAlertSummary(alerts),
  alerts,
  wallets: walletOutputs
};

writeJson(statePath, {
  scan_label: output.scan_label,
  scanned_at: output.scanned_at,
  wallets: rawStateWallets
});

printReport(output);
