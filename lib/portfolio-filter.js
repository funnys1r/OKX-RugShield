const CHAIN_INDEX_TO_NAME = {
  '1': 'ethereum',
  '56': 'bsc',
  '196': 'xlayer',
  '501': 'solana',
  '8453': 'base',
  '42161': 'arbitrum',
  '137': 'polygon',
};

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function chainName(chainIndex) {
  return CHAIN_INDEX_TO_NAME[String(chainIndex)] || String(chainIndex || 'unknown');
}

function normalizeAsset(asset) {
  const balance = toNumber(asset.balance, 0);
  const tokenPrice = toNumber(asset.tokenPrice, 0);
  const usdValue = balance * tokenPrice;
  return {
    symbol: asset.symbol || '(unknown)',
    chainIndex: String(asset.chainIndex || ''),
    chainName: chainName(asset.chainIndex),
    tokenContractAddress: asset.tokenContractAddress || '(native)',
    balance,
    tokenPrice,
    usdValue,
    isRiskToken: Boolean(asset.isRiskToken),
    raw: asset,
  };
}

function filterPortfolioAssets(tokenAssets = [], options = {}) {
  const minUsdValue = toNumber(options.minUsdValue, 1);
  const includeZeroPrice = Boolean(options.includeZeroPrice);
  const normalized = tokenAssets.map(normalizeAsset);

  const filtered = normalized.filter((asset) => {
    if (!includeZeroPrice && asset.tokenPrice <= 0) return false;
    if (asset.usdValue < minUsdValue) return false;
    return true;
  });

  filtered.sort((a, b) => b.usdValue - a.usdValue);

  const grouped = {};
  for (const asset of filtered) {
    if (!grouped[asset.chainName]) grouped[asset.chainName] = [];
    grouped[asset.chainName].push(asset);
  }

  const totalFilteredUsd = filtered.reduce((sum, asset) => sum + asset.usdValue, 0);

  return {
    filtered,
    grouped,
    totalFilteredUsd,
    assetCount: filtered.length,
  };
}

module.exports = {
  filterPortfolioAssets,
};
