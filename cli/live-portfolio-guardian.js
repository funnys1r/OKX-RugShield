#!/usr/bin/env node

const { execSync } = require('child_process');
const { computeExitStrategy } = require('../lib/exit-strategy');
const { filterPortfolioAssets } = require('../lib/portfolio-filter');

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

function inferRiskFromAsset(asset) {
  if (asset.usdValue >= 100 && asset.tokenPrice > 0) {
    return { level: 'WATCH', score: 58 };
  }
  if (asset.usdValue >= 300 && asset.tokenPrice > 0) {
    return { level: 'WARNING', score: 72 };
  }
  return { level: 'SAFE', score: 25 };
}

function main() {
  const address = process.argv[2];
  const chains = process.argv[3] || 'xlayer,ethereum,base,arbitrum,bsc';
  const minUsdValue = Number(process.argv[4] || 1);

  if (!address) {
    console.error('Usage: npm run live:portfolio -- <walletAddress> [chains] [minUsdValue]');
    process.exit(1);
  }

  console.log('\n🛡️ OKX RugShield Live Portfolio Guardian\n');
  log('INFO', `[Guardian Agent] Loading live portfolio for ${address} across ${chains}`);

  const totalValueJson = runJson(`onchainos portfolio total-value --address ${address} --chains ${JSON.stringify(chains)} -o json`);
  const balancesJson = runJson(`onchainos portfolio all-balances --address ${address} --chains ${JSON.stringify(chains)} -o json`);

  const totalValueData = pickFirstData(totalValueJson);
  const balancesData = pickFirstData(balancesJson);
  const totalValueUsd = Number(totalValueData.totalValue || 0);
  const tokenAssets = balancesData.tokenAssets || [];

  const filtered = filterPortfolioAssets(tokenAssets, { minUsdValue });
  const topAssets = filtered.filtered.slice(0, 5);

  const focusAssets = topAssets.map((asset) => {
    const inferred = inferRiskFromAsset(asset);
    const maxSafeExitRatio = asset.usdValue >= 150 ? 0.5 : 0.3;
    const strategy = computeExitStrategy({
      ruggedScore: inferred.score,
      maxSafeExitRatio,
      safeExitSlippageBps: 1000,
      totalValueUsd: asset.usdValue,
      totalTokenAmount: asset.balance,
    });
    return {
      asset,
      inferredThreat: inferred,
      strategy,
    };
  });

  log('INFO', `[Guardian Agent] Portfolio total value ≈ $${totalValueUsd.toFixed(2)}`);
  log('INFO', `[Guardian Agent] Filtered ${filtered.assetCount} meaningful assets (minUsdValue=$${minUsdValue})`);

  console.log('\n--- Portfolio Defense Report ---');
  console.log(JSON.stringify({
    address,
    chains,
    portfolio: {
      totalValueUsd,
      filteredAssetCount: filtered.assetCount,
      filteredTotalUsd: filtered.totalFilteredUsd,
      groupedByChain: Object.fromEntries(
        Object.entries(filtered.grouped).map(([chain, assets]) => [
          chain,
          assets.map((asset) => ({
            symbol: asset.symbol,
            usdValue: asset.usdValue,
            balance: asset.balance,
            tokenPrice: asset.tokenPrice,
            tokenContractAddress: asset.tokenContractAddress,
          })),
        ])
      ),
    },
    focusAssets: focusAssets.map(({ asset, inferredThreat, strategy }) => ({
      symbol: asset.symbol,
      chain: asset.chainName,
      usdValue: asset.usdValue,
      tokenContractAddress: asset.tokenContractAddress,
      inferredThreat,
      strategy: {
        action: strategy.action,
        recommendedExitRatio: strategy.recommendedExitRatio,
        exitValueUsd: strategy.exitValueUsd,
        remainingValueUsd: strategy.remainingValueUsd,
        rationale: strategy.rationale,
      },
    })),
  }, null, 2));

  log('INFO', '[Guardian Agent] Live portfolio prototype complete. This output reflects real wallet balances, filtered into a defense-oriented report.');
}

main();
