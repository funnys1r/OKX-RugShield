function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function decideBaseTarget(score) {
  if (score >= 90) return 1.0;
  if (score >= 75) return 1.0;
  if (score >= 60) return 0.5;
  return 0;
}

function computeExitStrategy(input = {}) {
  const ruggedScore = toNumber(input.ruggedScore);
  const maxSafeExitRatio = clamp(toNumber(input.maxSafeExitRatio, 0), 0, 1);
  const safeExitSlippageBps = toNumber(input.safeExitSlippageBps, 0);
  const totalValueUsd = Math.max(0, toNumber(input.totalValueUsd, 0));
  const totalTokenAmount = Math.max(0, toNumber(input.totalTokenAmount, 0));

  const baseTargetRatio = decideBaseTarget(ruggedScore);
  const recommendedExitRatio = clamp(Math.min(baseTargetRatio, maxSafeExitRatio), 0, 1);

  let level = 'SAFE';
  if (ruggedScore >= 90) level = 'LEVEL_3_FATAL';
  else if (ruggedScore >= 75) level = 'LEVEL_2_HIGH';
  else if (ruggedScore >= 60) level = 'LEVEL_1_WARNING';

  const exitValueUsd = totalValueUsd * recommendedExitRatio;
  const exitTokenAmount = totalTokenAmount * recommendedExitRatio;
  const remainingValueUsd = totalValueUsd - exitValueUsd;
  const remainingTokenAmount = totalTokenAmount - exitTokenAmount;

  const forcedPartialExit = recommendedExitRatio < baseTargetRatio;
  const action = recommendedExitRatio <= 0
    ? 'PAUSE_EXECUTION'
    : forcedPartialExit
      ? 'DYNAMIC_PARTIAL_EXIT'
      : 'FULL_STRATEGY_EXECUTION';

  const rationale = [];
  if (ruggedScore >= 90) {
    rationale.push('风险评分达到 Level 3，理论目标为优先全额退出到稳定资产。');
  } else if (ruggedScore >= 75) {
    rationale.push('风险评分达到 Level 2，理论目标为快速切换到主流避险资产。');
  } else if (ruggedScore >= 60) {
    rationale.push('风险评分达到 Level 1，理论目标为先退出部分仓位锁定本金。');
  } else {
    rationale.push('风险评分未达到强制退出阈值。');
  }

  if (forcedPartialExit) {
    rationale.push(`当前流动性与滑点约束仅支持安全退出 ${(maxSafeExitRatio * 100).toFixed(1)}% 仓位，因此降级为动态部分退出。`);
  } else if (recommendedExitRatio > 0) {
    rationale.push('当前安全退出比例足以覆盖策略目标，可按当前等级执行。');
  } else {
    rationale.push('当前安全退出比例为 0，建议暂停执行并继续监控。');
  }

  if (safeExitSlippageBps > 0) {
    rationale.push(`安全退出滑点阈值参考为 ${(safeExitSlippageBps / 100).toFixed(2)}%。`);
  }

  return {
    level,
    action,
    ruggedScore,
    baseTargetRatio,
    maxSafeExitRatio,
    recommendedExitRatio,
    exitValueUsd,
    exitTokenAmount,
    remainingValueUsd,
    remainingTokenAmount,
    safeExitSlippageBps,
    rationale,
  };
}

module.exports = {
  computeExitStrategy,
};
