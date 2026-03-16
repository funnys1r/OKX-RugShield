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

function replayMock(fileArg) {
  const { path: filePath, event } = loadMockEvent(fileArg);
  const strategy = computeExitStrategy({
    ruggedScore: event?.threat?.rugged_score,
    maxSafeExitRatio: event?.liquidity?.max_safe_exit_ratio,
    safeExitSlippageBps: event?.liquidity?.safe_exit_slippage_bps,
    totalValueUsd: event?.portfolio?.total_value_usd,
    totalTokenAmount: event?.portfolio?.total_token_amount,
  });

  console.log('\n🛡️ OKX RugShield Mock Replay\n');
  log('INFO', `Loaded mock event: ${filePath}`);
  log('INFO', `[Scout Agent] 识别到 ${event.token.symbol} 的高危事件，风险等级 ${event.threat.threat_level}，评分 ${event.threat.rugged_score}`);
  console.log(JSON.stringify({
    source: 'RugShield-Scout',
    threat_level: event.threat.threat_level,
    rugged_score: event.threat.rugged_score,
    token_address: event.token.address,
    chain: event.token.chain,
    reason: event.threat.reason.join(' / '),
  }, null, 2));

  log('INFO', `[Guardian Agent] 检测到 ${event.portfolio.wallets.length} 个钱包存在暴露，总价值约 $${event.portfolio.total_value_usd}`);
  log('INFO', `[Guardian Agent] 当前池子安全退出比例约 ${(strategy.maxSafeExitRatio * 100).toFixed(1)}%，推荐退出比例 ${(strategy.recommendedExitRatio * 100).toFixed(1)}%`);
  log('INFO', `[Guardian Agent] 建议动作：${strategy.action}`);

  console.log('\n--- Dynamic Exit Strategy ---');
  console.log(JSON.stringify({
    level: strategy.level,
    action: strategy.action,
    recommendedExitRatio: strategy.recommendedExitRatio,
    exitValueUsd: strategy.exitValueUsd,
    exitTokenAmount: strategy.exitTokenAmount,
    remainingValueUsd: strategy.remainingValueUsd,
    remainingTokenAmount: strategy.remainingTokenAmount,
    safeExitSlippageBps: strategy.safeExitSlippageBps,
    rationale: strategy.rationale,
  }, null, 2));

  console.log('\n--- Wallet Exposure ---');
  console.log(JSON.stringify(event.portfolio.wallets, null, 2));

  log('INFO', '[Guardian Agent] mock 回放结束。本次结果用于验证策略逻辑，不代表真实链上广播已经发生。');
}

replayMock(process.argv[2]);
