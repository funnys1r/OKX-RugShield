# OKX RugShield 🛡️

一个运行在 OpenClaw 生态内的聊天式双 Skill / 双智能体链上风控项目，用于在高风险代币出现 Rug 信号时，完成风险识别、持仓暴露检查、退出策略生成与模拟执行。

## 1. 项目概述

OKX RugShield 由两个核心 Skill 组成：

- `rugshield-scout`：负责市场侦察与风险识别
- `rugshield-guardian`：负责持仓暴露检查、退出策略与模拟执行

项目依赖 OpenClaw 作为运行入口，依赖 OKX OnchainOS Skills 作为底层链上能力来源。

标准运行形态是：
- 把 Skill 接入 OpenClaw
- 在聊天界面中触发 Scout / Guardian
- 通过对话完成风险分析与响应

仓库中的 CLI 仅用于：
- 本地预检
- mock 演示
- 比赛现场没有完整 OpenClaw 环境时的兜底展示
- 原型级链路验证

## 模型与 Agent 配置说明

- 本项目的标准运行入口是 **OpenClaw**。
- Agent 结构采用双 Skill 形态：`rugshield-scout` + `rugshield-guardian`。
- 当前项目的 Agent 行为定义主要承载于：
  - `skills/rugshield-scout/SKILL.md`
  - `skills/rugshield-guardian/SKILL.md`
- 当前仓库中的本地脚本（如 `demo` / `replay:mock` / `patrol:mock` / `simulate:guardian` / `live:signal` / `live:portfolio`）用于原型验证，不代表仓库把底层大模型固定死在某一个单一提供商或单一版本上。
- 更详细的 AI / Agent 配置说明见：`docs/AI_SETUP.md`

## 展示链接（待补）

- X（推特）演示链接：待补
- OKX 星球演示链接：待补

## 2. 当前已实现 / 当前不包含

### 当前已实现
- 基于 OpenClaw 的双 Skill 结构：`rugshield-scout` + `rugshield-guardian`
- 基于规则与流程定义的风险识别、暴露检查、退出策略与模拟响应框架
- `npm run demo` 本地 mock 演示
- `npm run replay:mock` 基于 mock 输入的事件回放入口
- `npm run patrol:mock` 主动巡检 / 主动告警原型入口
- `npm run simulate:guardian` Guardian 闭环桥接原型入口
- `npm run live:signal` 基于真实 OKX OnchainOS token/market 数据的原型入口
- `mock/mock-rug-event.json` 演示输入样例
- `lib/exit-strategy.js` 动态退出比例计算模块（原型）
- 外部 OKX OnchainOS Skills 的安装与本地 Skill 注入流程

### 当前不包含或未完整实现
- 完整实盘级自动执行程序
- 基于真实钱包实时暴露的完整闭环
- Mempool / Pending Transaction 抢先防御
- 完整自动化巡检调度框架

## 3. 核心功能

### 3.1 Scout Agent
`rugshield-scout` 负责：
- 扫描代币风险
- 识别 Dev 砸盘、聪明钱撤退、流动性恶化等信号
- 输出结构化 `Threat Report`
- 在演示场景下生成模拟风险事件
- 在原型阶段支持主动巡检与主动告警入口

### 3.2 Guardian Agent
`rugshield-guardian` 负责：
- 检查用户是否持有相关风险资产
- 聚合多钱包持仓暴露
- 生成阶梯式退出策略
- 在执行前进行路由模拟
- 根据模式决定请求确认或自动响应
- 在原型阶段支持从 Threat Report 走到策略/路由规划的桥接模拟

### 3.3 Mock / Demo / Prototype 能力
项目提供：
- `npm run demo`：本地 mock 演示
- `npm run replay:mock`：读取 mock 事件并回放 Scout → Guardian 联动
- `npm run patrol:mock`：模拟 Scout 主动巡检并交给 Guardian 生成防守建议
- `npm run simulate:guardian`：模拟 Guardian 从 Threat Report 走到退出策略与路由规划
- `npm run live:signal`：读取真实 OKX OnchainOS token/market 数据并生成原型级 Guardian 输出
- `mock/mock-rug-event.json`：最小可用的模拟事件输入样例

## 4. 工作流程

RugShield 的基本工作流程如下：

1. Scout 发现高风险代币信号
2. Scout 输出结构化 `Threat Report`
3. Guardian 检查用户真实持仓暴露
4. Guardian 结合风险等级、流动性深度、滑点与模式配置生成退出方案
5. 在 `Safe Mode` 下请求 `CONFIRM`，或在满足条件时执行自动响应

## 5. 安装与接入

### 5.1 安装依赖

```bash
npm install
```

### 5.2 创建环境文件

```bash
cp .env.example .env
```

填写：
- `OKX_API_KEY`
- `OKX_API_SECRET`
- `OKX_API_PASSPHRASE`
- `AUTO_DEFENSE_MODE`

### 5.3 安装 OpenClaw 所需技能

```bash
npm run install:core
# 或
node scripts/installer.js --core-only
```

安装脚本会：
- 安装 7 个必需的 OKX OnchainOS Skills
- 把 `rugshield-scout` 与 `rugshield-guardian` 复制到 `~/.openclaw/workspace/skills/`
- 运行预检

## 6. 使用方式

### 6.1 OpenClaw 标准入口
推荐在 OpenClaw 聊天界面中直接触发，例如：

- `运行 场景1：午夜土狗闪崩 模拟演示`
- `执行全仓体检`
- `开始主动巡检并在发现高风险时提醒我`
- `Guardian Agent，检查最新 Threat Report 并告诉我当前持仓暴露`

### 6.2 CLI 原型入口
如果暂时没有完整 OpenClaw 环境，可运行：

```bash
npm run demo
npm run replay:mock
npm run patrol:mock
npm run simulate:guardian
npm run live:signal -- OKB xlayer
```

这些命令用于 mock / 原型验证，不代表真实链上自动执行。

## 7. 运行模式

### Safe Mode
默认模式。
执行前需要人工确认。

### Auto-Defense Mode
当 `AUTO_DEFENSE_MODE=true` 时，Guardian 可以在高危场景下自动处理。

是否能够真正自动执行，取决于：
- 当前 OpenClaw 环境是否已正确安装相关 OKX OnchainOS Skills
- 是否配置了执行权限
- 是否具备真实链上调用能力

## 8. 原型与测试入口

### 8.1 本地 mock 演示

```bash
npm run demo
```

### 8.2 Mock 回放

```bash
npm run replay:mock
```

该命令会读取 `mock/mock-rug-event.json`，并输出一次基于 mock 输入的 Scout → Guardian 联动回放。

### 8.3 主动巡检原型

```bash
npm run patrol:mock
```

该命令会模拟 Scout 主动巡检高风险资产、主动发出 Threat Report，并由 Guardian 在用户尚未先发起交易的情况下生成防守建议。

### 8.4 Guardian 闭环模拟

```bash
npm run simulate:guardian
```

该命令会读取 Threat Report / mock 事件输入，调用 `lib/exit-strategy.js`，并输出更接近真实 Guardian pipeline 的桥接报告。

### 8.5 真实链上数据原型

```bash
npm run live:signal -- OKB xlayer
```

该命令会调用真实的 `okx-dex-token` / `okx-dex-market` 数据，并生成原型级 Guardian 策略输出。

### 8.6 Mock 测试包

仓库内提供：

- `mock/mock-rug-event.json`

该文件包含：
- 模拟高危 Rug 事件
- 模拟多钱包持仓暴露
- 模拟流动性深度下降
- 模拟动态退出建议

它用于帮助开发者和评审快速理解项目的风险输入与策略输出结构。

## 9. 仓库结构

```text
OKX-RugShield/
├── cli/
│   ├── fetch-live-signal.js
│   ├── patrol-mock.js
│   ├── replay-mock.js
│   ├── simulate-guardian.js
│   └── rugshield.js
├── lib/
│   └── exit-strategy.js
├── scripts/
│   └── installer.js
├── skills/
│   ├── rugshield-scout/SKILL.md
│   └── rugshield-guardian/SKILL.md
├── docs/
│   ├── ACTIVE_DEFENSE.md
│   ├── ARCHITECTURE.md
│   ├── GUARDIAN_PIPELINE.md
│   ├── INTEGRATION_MATRIX.md
│   ├── LIVE_DATA_PROTOTYPE.md
│   ├── PROACTIVE_PATROL.md
│   ├── PRODUCTION_CHECKLIST.md
│   └── RUNBOOK.md
├── mock/
│   ├── mock-rug-event.json
│   └── README.md
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

## 10. 当前限制

当前版本的边界如下：

- 项目的主形态是 OpenClaw Skill，不是独立量化交易系统
- `npm run demo`、`npm run replay:mock`、`npm run patrol:mock`、`npm run simulate:guardian`、`npm run live:signal` 都属于原型验证入口，不是实盘执行证明
- `mock/mock-rug-event.json` 是演示输入样例，不是完整自动回放框架
- Mempool 抢先防御、多钱包并发执行、更加精细的深度计算，当前主要属于增强方向

## 11. 后续规划

后续增强方向包括：

- 动态最优解退出：结合真实池子深度、滑点阈值与可回收率计算退出比例
- Mempool / Pending Transaction 级提前响应
- 多钱包并发路由模拟与并发执行
- 更完整的 mock 回放与测试流
- 更接近真实后台守护的主动巡检调度机制
- 与 AA 钱包 / 账户抽象执行策略层更深结合

## 12. 安全提示

- 请优先在模拟盘、测试环境、子账户或小资金环境中体验本项目。
- 不要向 Agent 提供私钥、助记词、API Secret 或其他敏感凭证。
- 请优先使用官方提供或认可的 Skills，并谨慎启用第三方扩展能力。
- 当前仓库中的 mock / 原型能力不应被视为主钱包实盘自动执行工具。

## 13. 接手顺序

如果一个 OpenClaw Agent 接手这个仓库，建议顺序如下：

1. 阅读 `skills/rugshield-scout/SKILL.md`
2. 阅读 `skills/rugshield-guardian/SKILL.md`
3. 执行 `npm install`
4. 执行 `node scripts/installer.js --core-only`
5. 配置 `.env`
6. 在 OpenClaw 聊天环境中触发 Scout / Guardian
