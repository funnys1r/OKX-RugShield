#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { computeExitStrategy } = require('../lib/exit-strategy');

function log(type, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] ${message}`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeInput(input) {
  if (input?.source === 'mock-rug-event') {
    return {
      token: input.token,
      threat: input.threat,
      portfolio: input.portfolio,
      liquidity: input.liquidity,
    };
  }

  if (input?.source === 'RugShield-Scout') {
    return {
      token: {
        symbol: 'UNKNOWN',
        address: input.token_address,
        chain: input.chain,
      },
      threat: {
        threat_level: input.threat_level,
        rugged_score: input.rugged_score,
        reason: Array.isArray(input.reason) ? input.reason : [String(input.reason || '')],
      },
      portfolio: {
        wallets: [],
        total_token_amount: 0,
        total_value_usd: 0,
      },
      liquidity: {
        safe_exit_slippage_bps: 1000,
        max_safe_exit_ratio: input.rugged_score >= 90 ? 0.3 : input.rugged_score >= 60 ? 0.5 : 0,
      },
    };
  }

  throw new Error('Unsupported input format');
}

function simulateGuardian(fileArg) {
  const defaultPath = path.join(__dirname, '..', 'mock', 'mock-rug-event.json');
  const targetPath = fileArg ? path.resolve(process.cwd(), fileArg) : defaultPath;
  const input = readJson(targetPath);
  const normalized = normalizeInput(input);

  const strategy = computeExitStrategy({
    ruggedScore: normalized.threat.rugged_score,
    maxSafeExitRatio: normalized.liquidity.max_safe_exit_ratio,
    safeExitSlippageBps: normalized.liquidity.safe_exit_slippage_bps,
    totalValueUsd: normalized.portfolio.total_value_usd,
    totalTokenAmount: normalized.portfolio.total_token_amount,
  });

  console.log('\n🛡️ OKX RugShield Guardian Pipeline Simulation\n');
  log('INFO', `Loaded input: ${targetPath}`);
  log('INFO', '[Guardian Agent] 开始读取 Threat Report...');
  log('INFO', `[Guardian Agent] Threat Level=${normalized.threat.threat_level}, Rugged Score=${normalized.threat.rugged_score}`);
  log('INFO', `[Guardian Agent] Token=${normalized.token.symbol || 'UNKNOWN'} @ ${normalized.token.address}`);

  const walletCount = normalized.portfolio.wallets.length;
  if (walletCount === 0) {
    log('WARN', '[Guardian Agent] 当前输入未包含真实钱包暴露数据，将使用占位暴露信息继续模拟。');
  } else {
    log('INFO', `[Guardian Agent] 检测到 ${walletCount} 个钱包存在暴露，总价值约 $${normalized.portfolio.total_value_usd}`);
  }

  log('INFO', '[Guardian Agent] 开始生成退出策略并评估安全退出比例...');
  log('INFO', `[Guardian Agent] 推荐动作=${strategy.action}, 推荐退出比例=${(strategy.recommendedExitRatio * 100).toFixed(1)}%`);

  const routePlan = {
    routerSkill: 'okx-dex-swap',
    simulationSkill: 'okx-onchain-gateway',
    targetAsset: normalized.threat.rugged_score >= 75 ? 'USDC' : 'USDC/ETH',
    safeExitSlippageBps: strategy.safeExitSlippageBps,
    recommendedExitRatio: strategy.recommendedExitRatio,
  };

  const report = {
    input: {
      token: normalized.token,
      threat: normalized.threat,
    },
    exposure: {
      walletCount,
      totalValueUsd: normalized.portfolio.total_value_usd,
      totalTokenAmount: normalized.portfolio.total_token_amount,
      wallets: normalized.portfolio.wallets,
    },
    strategy,
    routePlan,
    modeGuidance: {
      safeMode: '需要用户手动 CONFIRM 后才继续执行',
      autoDefenseMode: '仅在环境已启用且具备真实链上能力时才适用',
    },
  };

  console.log('\n--- Guardian Pipeline Report ---');
  console.log(JSON.stringify(report, null, 2));

  log('INFO', '[Guardian Agent] 模拟完成。本输出用于说明 Guardian 如何从 Threat Report 走到退出策略与路由规划。');
}

simulateGuardian(process.argv[2]);
