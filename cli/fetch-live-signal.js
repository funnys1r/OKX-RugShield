#!/usr/bin/env node

const { execSync } = require('child_process');
const { computeExitStrategy } = require('../lib/exit-strategy');

const CHAIN_INDEX_TO_NAME = {
  '1': 'ethereum',
  '56': 'bsc',
  '196': 'xlayer',
  '501': 'solana',
  '8453': 'base',
  '42161': 'arbitrum',
  '137': 'polygon',
};

function log(type, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] ${message}`);
}

function runJson(command) {
  const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(output);
}

function pickFirstData(json) {
  if (!json || json.ok !== true || !Array.isArray(json.data) || json.data.length === 0) {
    throw new Error('No data returned from onchainos');
  }
  return json.data[0];
}

function chainNameFromIndex(chainIndex, fallback) {
  return CHAIN_INDEX_TO_NAME[String(chainIndex)] || fallback;
}

function inferThreatLevel(change24h, liquidityUsd) {
  if (change24h <= -15 || liquidityUsd < 10000) return { level: 'CRITICAL', score: 92 };
  if (change24h <= -8 || liquidityUsd < 50000) return { level: 'WARNING', score: 78 };
  if (change24h <= -3 || liquidityUsd < 150000) return { level: 'WATCH', score: 58 };
  return { level: 'SAFE', score: 25 };
}

function main() {
  const query = process.argv[2] || 'OKB';
  const requestedChain = process.argv[3] || 'xlayer';
  const walletValueUsd = Number(process.argv[4] || 45000);
  const walletTokenAmount = Number(process.argv[5] || 50000);

  console.log('\n🛡️ OKX RugShield Live Signal Prototype\n');
  log('INFO', `Searching live token data for query=${query}, requestedChain=${requestedChain}`);

  const search = runJson(`onchainos token search ${JSON.stringify(query)} --chain ${requestedChain} -o json`);
  const token = pickFirstData(search);

  const address = token.tokenContractAddress;
  const tokenName = token.tokenName || token.tokenSymbol || query;
  const tokenSymbol = token.tokenSymbol || query;
  const resolvedChain = chainNameFromIndex(token.chainIndex, requestedChain);
  const resolvedChainIndex = token.chainIndex || requestedChain;

  log('INFO', `[Scout Agent] Found token ${tokenSymbol} at ${address} on ${resolvedChain}`);

  const priceInfo = runJson(`onchainos token price-info ${address} --chain ${resolvedChain} -o json`);
  const marketPrice = runJson(`onchainos market price ${address} --chain ${resolvedChain} -o json`);

  const priceData = pickFirstData(priceInfo);
  const marketData = pickFirstData(marketPrice);

  const liquidityUsd = Number(priceData.liquidity || 0);
  const price = Number(priceData.price || marketData.price || 0);
  const change24h = Number(priceData.change || priceData.priceChange24H || 0);
  const inferred = inferThreatLevel(change24h, liquidityUsd);

  const maxSafeExitRatio = liquidityUsd < 10000 ? 0.15 : liquidityUsd < 50000 ? 0.3 : liquidityUsd < 150000 ? 0.5 : 1;
  const safeExitSlippageBps = liquidityUsd < 10000 ? 1500 : liquidityUsd < 50000 ? 1000 : 700;

  const strategy = computeExitStrategy({
    ruggedScore: inferred.score,
    maxSafeExitRatio,
    safeExitSlippageBps,
    totalValueUsd: walletValueUsd,
    totalTokenAmount: walletTokenAmount,
  });

  const report = {
    source: 'RugShield-Live-Prototype',
    token: {
      name: tokenName,
      symbol: tokenSymbol,
      address,
      requestedChain,
      resolvedChain,
      chainIndex: resolvedChainIndex,
    },
    liveMarket: {
      price,
      liquidityUsd,
      marketCap: Number(priceData.marketCap || 0),
      change24h,
      holders: Number(priceData.holders || 0),
    },
    inferredThreat: {
      threatLevel: inferred.level,
      ruggedScore: inferred.score,
      rationale: [
        `24h 变化为 ${change24h}%`,
        `流动性约为 $${liquidityUsd}`,
        '当前为基于真实链上市场数据的原型级风险推断，不代表最终实盘风控结论',
      ],
    },
    guardianStrategy: strategy,
  };

  log('INFO', `[Scout Agent] Live data loaded: price=${price}, liquidity=$${liquidityUsd}, change24h=${change24h}%`);
  log('INFO', `[Guardian Agent] Inferred threat=${inferred.level}, recommended action=${strategy.action}, exit ratio=${(strategy.recommendedExitRatio * 100).toFixed(1)}%`);

  console.log('\n--- Live Signal Report ---');
  console.log(JSON.stringify(report, null, 2));
  log('INFO', 'Prototype complete. This flow uses real OKX OnchainOS market/token data, but Guardian execution remains simulation/prototype only.');
}

main();
