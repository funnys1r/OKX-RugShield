#!/usr/bin/env node
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const wantJson = args.includes('--json');
const positional = args.filter((x) => x !== '--json');

const wallet = positional[0] || 'unknown-wallet';
const chains = (positional[1] || 'xlayer').split(',').map((x) => x.trim()).filter(Boolean);
const limit = Number(positional[2] || 5);

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

function formatUsd(v) {
  const n = toNum(v) || 0;
  return `$${n.toFixed(2)}`;
}

function formatAmount(v) {
  const n = toNum(v);
  if (n === null) return String(v);
  if (Math.abs(n) >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
  if (Math.abs(n) >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 6 });
  return n.toLocaleString('en-US', { maximumFractionDigits: 12 });
}

function riskLabel(level) {
  return ({ high: '高风险', medium: '中风险', low: '低风险', unknown: '未知' })[level] || level;
}

function printSection(lines, title, items, formatter) {
  lines.push(title);
  if (!Array.isArray(items) || items.length === 0) {
    lines.push('- 无');
  } else {
    items.forEach((item, idx) => lines.push(formatter(item, idx)));
  }
  lines.push('');
}

function printResult(result) {
  if (wantJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const lines = [];
  lines.push('=== RugShield Guardian 实时持仓报告 ===');
  lines.push(`钱包地址：${result.wallets_checked.join(', ')}`);
  lines.push(`扫描链：${result.chains_checked.join(', ')}`);
  lines.push(`运行模式：${result.mode}`);
  lines.push(`风险优先级：${result.risk_priority}`);
  lines.push(`结论：${result.threat_summary}`);
  lines.push('');

  if (result.portfolio_summary) {
    lines.push('[资产概览]');
    lines.push(`- 估算总价值：${formatUsd(result.portfolio_summary.total_usd_value)}`);
    lines.push(`- 返回展示仓位：${result.portfolio_summary.returned_positions}`);
    lines.push(`- 扫描到的总仓位：${result.portfolio_summary.scanned_positions}`);
    lines.push(`- 有估值仓位：${result.portfolio_summary.valued_positions}`);
    lines.push(`- 已过滤垃圾仓位：${result.portfolio_summary.filtered_dust_positions}`);
    lines.push(`- 已过滤零价值仓位：${result.portfolio_summary.filtered_zero_value_positions}`);
    lines.push('');
  }

  printSection(lines, '[重点敞口]', result.exposed_positions, (p) => {
    const riskMarks = [];
    if (p.is_risk_token) riskMarks.push('OKX风险标记');
    if (p.risk_level) riskMarks.push(riskLabel(p.risk_level));
    const riskText = riskMarks.length ? ` | 风险=${riskMarks.join(' / ')}` : '';
    return `${p.priority}. ${p.token} | 链=${p.chain} | 数量=${formatAmount(p.amount)} | 估值=${formatUsd(p.usd_value)} | 合约=${p.contract}${riskText}`;
  });

  printSection(lines, '[风险分组] 高风险', result.risk_groups && result.risk_groups.high, (p, idx) => {
    return `${idx + 1}. ${p.token} | 链=${p.chain} | 估值=${formatUsd(p.usd_value)} | 原因=${p.risk_reason}`;
  });

  printSection(lines, '[风险分组] 中风险', result.risk_groups && result.risk_groups.medium, (p, idx) => {
    return `${idx + 1}. ${p.token} | 链=${p.chain} | 估值=${formatUsd(p.usd_value)} | 原因=${p.risk_reason}`;
  });

  printSection(lines, '[风险分组] 低风险', result.risk_groups && result.risk_groups.low, (p, idx) => {
    return `${idx + 1}. ${p.token} | 链=${p.chain} | 估值=${formatUsd(p.usd_value)} | 原因=${p.risk_reason}`;
  });

  printSection(lines, '[链路分布]', result.chain_breakdown, (c) => {
    return `- ${c.chain}：${formatUsd(c.usd_value)}，${c.positions} 个仓位`;
  });

  printSection(lines, '[已过滤垃圾仓位]', result.filtered_positions_preview, (p, idx) => {
    return `${idx + 1}. ${p.token} | 链=${p.chain} | 数量=${formatAmount(p.amount)} | 估值=${formatUsd(p.usd_value)} | 原因=${p.filter_reason}`;
  });

  lines.push('[防守建议]');
  result.staged_exit_plan.forEach((step, idx) => {
    lines.push(`${idx + 1}. ${step}`);
  });
  lines.push('');
  lines.push(`[执行条件] ${result.execution_condition}`);
  lines.push(`[流动性提示] ${result.slippage_or_liquidity_notes}`);
  lines.push(`[确认要求] ${result.confirmation_requirement}`);

  console.log(lines.join('\n'));
}

const res = runJson(['portfolio', 'all-balances', '--address', wallet, '--chains', chains.join(',')]);
const apiError = res.parsed && res.parsed.error ? String(res.parsed.error) : '';
const raw = [apiError, res.stderr, res.stdout].filter(Boolean).join(' | ');
const authIssue = /Timestamp request expired|50102/i.test(raw);

if (res.status !== 0 || !res.parsed || res.parsed.ok !== true) {
  printResult({
    mode: authIssue ? 'live-auth-fallback' : 'live-error-fallback',
    component: 'rugshield-guardian',
    threat_summary: authIssue
      ? '实时持仓查询已触达官方 OKX CLI 路径，但因鉴权时间戳校验失败，当前无法获取结果。'
      : '实时持仓查询未能通过官方 OKX CLI 路径成功完成。',
    wallets_checked: [wallet],
    chains_checked: chains,
    exposed_positions: [],
    portfolio_summary: {
      total_usd_value: 0,
      returned_positions: 0,
      scanned_positions: 0,
      valued_positions: 0
    },
    chain_breakdown: [],
    risk_priority: 'unknown',
    risk_groups: { high: [], medium: [], low: [] },
    filtered_positions_preview: [],
    staged_exit_plan: authIssue
      ? [
          '先修正主机时间或时间戳校验问题。',
          '时间同步完成后重新执行实时持仓查询。',
          '在鉴权恢复前，先使用人工复核或模拟模式。'
        ]
      : [
          '先检查 onchainos CLI 安装和连通性。',
          '确认环境正常后重新执行持仓查询。',
          '在 live 查询恢复前，先使用人工复核或模拟模式。'
        ],
    slippage_or_liquidity_notes: '当前不可用',
    execution_condition: authIssue
      ? '当前环境下，鉴权持仓路径被时间戳校验阻断'
      : '当前环境下，没有可用的实时持仓执行路径',
    confirmation_requirement: 'Safe Mode 下需要二次确认'
  });
  process.exit(0);
}

const CHAIN_INDEX_TO_NAME = {
  '1': 'ethereum',
  '10': 'optimism',
  '56': 'bsc',
  '137': 'polygon',
  '196': 'xlayer',
  '324': 'zksync',
  '42161': 'arbitrum',
  '43114': 'avalanche',
  '501': 'solana',
  '8453': 'base'
};

const rawBalances = Array.isArray(res.parsed.data)
  ? res.parsed.data.flatMap((entry) => Array.isArray(entry.tokenAssets) ? entry.tokenAssets : [])
  : [];

const normalizedPositions = rawBalances
  .map((item) => {
    const balance = toNum(item.balance);
    const tokenPrice = toNum(item.tokenPrice ?? item.tokenPriceUsd);
    const usdValue = balance !== null && tokenPrice !== null
      ? balance * tokenPrice
      : (toNum(item.usdValue) || 0);
    const contract = item.tokenContractAddress || '(native)';
    const chain = item.chainName || item.chain || CHAIN_INDEX_TO_NAME[String(item.chainIndex || '')] || 'unknown';
    const token = item.symbol || item.tokenSymbol || 'unknown';

    let riskLevel = 'low';
    let riskReason = '主流或正常估值仓位';

    if (Boolean(item.isRiskToken)) {
      riskLevel = 'high';
      riskReason = '被 OKX 标记为风险代币';
    } else if ((usdValue || 0) === 0) {
      riskLevel = 'medium';
      riskReason = '无可用估值，疑似空气币或未收录代币';
    } else if ((usdValue || 0) < 1) {
      riskLevel = 'medium';
      riskReason = '估值极低，属于小额尾仓或垃圾仓位';
    }

    return {
      token,
      chain,
      amount: balance ?? item.balance ?? 'unknown',
      usd_value: usdValue,
      priority: 0,
      contract,
      is_risk_token: Boolean(item.isRiskToken),
      risk_level: riskLevel,
      risk_reason: riskReason,
      raw_token_price: tokenPrice
    };
  })
  .sort((a, b) => (b.usd_value || 0) - (a.usd_value || 0));

const ZERO_VALUE_THRESHOLD = 0;
const DUST_USD_THRESHOLD = 1;

const filteredOutPositions = [];
const actionablePositions = [];
for (const item of normalizedPositions) {
  const usdValue = toNum(item.usd_value) || 0;
  if (usdValue <= ZERO_VALUE_THRESHOLD) {
    filteredOutPositions.push({ ...item, filter_reason: '零价值仓位' });
    continue;
  }
  if (usdValue < DUST_USD_THRESHOLD && !item.is_risk_token) {
    filteredOutPositions.push({ ...item, filter_reason: '低于 $1 的垃圾尾仓' });
    continue;
  }
  actionablePositions.push(item);
}

const positions = actionablePositions.slice(0, Math.max(1, limit));
positions.forEach((p, idx) => { p.priority = idx + 1; });

const totalUsdValue = actionablePositions.reduce((sum, item) => sum + (toNum(item.usd_value) || 0), 0);
const valuedPositions = actionablePositions.filter((item) => (toNum(item.usd_value) || 0) > 0).length;
const chainBreakdownMap = new Map();
for (const item of actionablePositions) {
  const key = item.chain || 'unknown';
  const current = chainBreakdownMap.get(key) || { chain: key, usd_value: 0, positions: 0 };
  current.usd_value += toNum(item.usd_value) || 0;
  current.positions += 1;
  chainBreakdownMap.set(key, current);
}
const chainBreakdown = Array.from(chainBreakdownMap.values())
  .sort((a, b) => (b.usd_value || 0) - (a.usd_value || 0));

const riskGroups = {
  high: actionablePositions.filter((item) => item.risk_level === 'high').slice(0, 10),
  medium: actionablePositions.filter((item) => item.risk_level === 'medium').slice(0, 10),
  low: actionablePositions.filter((item) => item.risk_level === 'low').slice(0, 10)
};

const priority = positions.length === 0 ? 'monitor' : (positions[0].usd_value || 0) > 1000 ? 'immediate' : 'elevated';
const plan = positions.length === 0
  ? ['当前未发现需要优先处理的有效仓位，先持续观察。']
  : [
      '优先检查高估值直接敞口，先看主仓而不是小尾仓。',
      '在流动性不确定时分批减仓，不要一次性砸出。',
      '执行前再次确认余额、价格、路由和滑点条件。'
    ];

printResult({
  mode: 'live-okx-cli',
  component: 'rugshield-guardian',
  threat_summary: '实时持仓查询已通过官方 OKX CLI 路径完成，以下为过滤和分组后的可读结果。',
  wallets_checked: [wallet],
  chains_checked: chains,
  portfolio_summary: {
    total_usd_value: totalUsdValue,
    returned_positions: positions.length,
    scanned_positions: normalizedPositions.length,
    valued_positions: valuedPositions,
    filtered_dust_positions: filteredOutPositions.filter((x) => x.filter_reason === '低于 $1 的垃圾尾仓').length,
    filtered_zero_value_positions: filteredOutPositions.filter((x) => x.filter_reason === '零价值仓位').length
  },
  exposed_positions: positions,
  chain_breakdown: chainBreakdown,
  risk_groups: riskGroups,
  filtered_positions_preview: filteredOutPositions.slice(0, 10),
  risk_priority: priority,
  staged_exit_plan: plan,
  slippage_or_liquidity_notes: '真实执行前仍需检查流动性、路由质量和滑点。',
  execution_condition: '当前仅做分析输出，除非你单独明确授权，否则不会执行任何链上动作',
  confirmation_requirement: 'Safe Mode 下需要二次确认'
});
