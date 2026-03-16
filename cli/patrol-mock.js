#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { computeExitStrategy } = require('../lib/exit-strategy');

function log(type, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] ${message}`);
}

function loadMockEvent(fileArg) {
  const defaultPath = path.join(__dirname, '..', 'mock', 'mock-rug-event.json');
  const target = fileArg ? path.resolve(process.cwd(), fileArg) : defaultPath;
  const raw = fs.readFileSync(target, 'utf8');
  return { path: target, event: JSON.parse(raw) };
}

function patrolMock(fileArg) {
  const { path: filePath, event } = loadMockEvent(fileArg);
  const strategy = computeExitStrategy({
    ruggedScore: event?.threat?.rugged_score,
    maxSafeExitRatio: event?.liquidity?.max_safe_exit_ratio,
    safeExitSlippageBps: event?.liquidity?.safe_exit_slippage_bps,
    totalValueUsd: event?.portfolio?.total_value_usd,
    totalTokenAmount: event?.portfolio?.total_token_amount,
  });

  console.log('\n🛡️ OKX RugShield Active Patrol Mock\n');
  log('INFO', `Loaded patrol scenario: ${filePath}`);
  log('INFO', '[Scout Agent] 启动主动巡检，检查高风险持仓与异常池子变化...');
  log('INFO', `[Scout Agent] 发现 ${event.token.symbol} 风险等级 ${event.threat.threat_level}，评分 ${event.threat.rugged_score}`);
  log('WARN', `[Scout Agent] 主动发出 Threat Report：${event.threat.reason.join(' / ')}`);

  log('INFO', '[Guardian Agent] 收到主动告警，开始检查多钱包暴露...');
  log('INFO', `[Guardian Agent] 检测到 ${event.portfolio.wallets.length} 个钱包存在暴露，总价值约 $${event.portfolio.total_value_usd}`);

  if (strategy.action === 'PAUSE_EXECUTION') {
    log('WARN', '[Guardian Agent] 当前安全退出比例为 0，建议仅主动提醒用户，不执行退出。');
  } else if (strategy.action === 'DYNAMIC_PARTIAL_EXIT') {
    log('WARN', `[Guardian Agent] 当前仅建议主动退出 ${(strategy.recommendedExitRatio * 100).toFixed(1)}% 仓位，以避免灾难性滑点。`);
  } else {
    log('INFO', '[Guardian Agent] 当前池子可承载策略目标，可按风险等级执行完整方案。');
  }

  console.log('\n--- Active Defense Summary ---');
  console.log(JSON.stringify({
    patrolMode: true,
    token: event.token,
    threat: event.threat,
    exposureWalletCount: event.portfolio.wallets.length,
    totalValueUsd: event.portfolio.total_value_usd,
    strategy: {
      action: strategy.action,
      recommendedExitRatio: strategy.recommendedExitRatio,
      exitValueUsd: strategy.exitValueUsd,
      remainingValueUsd: strategy.remainingValueUsd,
      rationale: strategy.rationale,
    },
    nextStep: strategy.action === 'PAUSE_EXECUTION'
      ? 'notify-only'
      : 'notify-and-prepare-guardian-response'
  }, null, 2));

  log('INFO', '[System] 本次主动巡检演示完成：展示的是“先发现、先提醒、先给方案”，而不是等用户临门一脚再被动检查。');
}

patrolMock(process.argv[2]);
