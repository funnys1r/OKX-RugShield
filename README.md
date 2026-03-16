# OKX RugShield 🛡️

**一个面向多钱包链上用户的聊天式双智能体风控防御系统，由 OpenClaw + OKX OnchainOS Skills 驱动。**

<div align="center">
  <h3>不只是帮你找百倍币，更要帮你在 Rug 之前保住本金。</h3>
  <p>OKX Onchain OS AI 松官方参赛项目。</p>
</div>

---

## 1. 项目是什么？

**一句话介绍：**  
OKX RugShield 是一个面向链上多钱包用户的 AI 风控与逃生执行代理。

它解决的是大多数链上用户都经历过、但很少有工具真正处理好的问题：

- Dev 砸盘
- 聪明钱集体撤退
- 流动性快速枯竭
- 土狗半夜闪崩
- 多钱包持仓来不及手动撤退

大多数 AI Agent 都在帮用户寻找下一个机会。  
**RugShield 做的是另一件更现实的事：在图表崩掉前，把本金尽可能安全地带走。**

---

## 2. 为什么这个方向值得做？

对于空投猎人、Meme 玩家、多钱包链上用户来说，风险从来不是慢慢来的。
它通常只需要几分钟。

等人反应过来时，往往已经发生了：
- 巨鲸钱包先跑了
- 滑点迅速恶化
- LP 被抽走
- 最好的逃生路线已经没了

**RugShield 想做的，就是把这种混乱场景变成一个结构化的防御流程：**

1. **Scout** 先发现风险
2. **Guardian** 再检查用户是否真的持仓暴露
3. **Guardian** 计算并模拟最合适的退出路径
4. 按模式选择：**Safe Mode 人工确认**，或 **Auto-Defense Mode 自动执行**

---

## 3. 核心设计：Scout + Guardian 双智能体

RugShield 基于 **OpenClaw** 和 **OKX OnchainOS Skills** 构建成一个双智能体系统。

### Scout Agent：市场侦察官
Scout 不负责执行交易，只负责侦测风险，并生成结构化威胁报告。

它主要观察：
- 异常价格波动
- Dev 钱包砸盘
- 聪明钱净流出
- 流动性恶化
- Holder 结构异常
- 执行摩擦 / 滑点风险

### Guardian Agent：资金护卫官
Guardian 只在发现风险后介入。

它负责：
- 检查用户是否持有该资产
- 聚合多钱包暴露情况
- 选择阶梯式逃生策略
- 模拟执行路径
- 根据模式决定等待 `CONFIRM`，还是自动执行

### 为什么要拆成两个智能体？
因为单智能体在高压链上场景里，往往会把市场判断、持仓判断、执行判断、聊天输出全混在一起，提示词又长又乱，压力一大就容易失真。

RugShield 的思路是：
- **Scout 专心看市场**
- **Guardian 专心保资金**

这样结构更清楚，也更适合比赛演示和答辩说明。

---

## 4. 这个参赛项目的亮点

### 4.1 实用性：不是一键全抛，而是阶梯式逃生
RugShield 不是机械地“发现风险就清仓”。

而是按风险等级给出不同处理：

- **Level 1 风险（60–75）**：卖出 50% 换成 USDC，先锁定本金
- **Level 2 风险（75–90）**：100% 切换到 ETH / SOL 这类主流避险资产
- **Level 3 致命风险（90+）**：立即全额换成 USDC

这让它更像一个真正的资产防御代理，而不是简单告警器。

### 4.2 创新性：MEV 感知的防夹逃生
在链上闪崩场景里，光“决定卖”是不够的。
你还得真的卖得出去，而且不能在路上被夹得体无完肤。

RugShield 在设计里显式考虑了：
- 滑点恶化
- 紧急路由
- 提高 gas 优先级
- 执行前模拟验证
- 私有 RPC / 防夹广播偏好

### 4.3 与 OKX 生态结合紧密
项目围绕 OKX OnchainOS 技能栈形成闭环：

`portfolio -> token -> market -> signal -> trenches -> gateway -> swap`

这条链路把：
- 风险信号识别
- 用户真实持仓判断
- 执行模拟与广播

连成了一个完整工作流。

### 4.4 可复现性强
项目同时支持：
- **评委 Demo 模式**：不需要真实 API key，直接演示完整流程
- **真实运行模式**：接入环境变量后可进入正式预检与部署流程

这对比赛很重要。评委应该在几分钟内看到效果，而不是花大量时间做环境配置。

---

## 5. 评委 60 秒演示路径

如果你是评委，只想快速看懂这个项目，直接运行：

```bash
cd OKX-RugShield
npm install
npm run demo
```

这会跑一个完整的 **模拟 Scout → Guardian → 资金救援流程**，特点是：
- 不需要真实 OKX 凭证
- 不需要真实钱包
- 不会真的广播交易

你会看到：
1. Scout 发现一个高危 Meme 代币 Rug 风险
2. Guardian 检测到钱包有持仓暴露
3. Guardian 启动 Level 3 紧急逃生策略
4. Guardian 模拟带防夹保护的 USDC 逃生路径

---

## 6. 真实环境接入方式

如果你想运行真实模式：

```bash
# 1. 安装依赖
npm install

# 2. 创建环境文件
cp .env.example .env
# 填入 OKX_API_KEY / OKX_API_SECRET / OKX_API_PASSPHRASE

# 3. 安装外部 OKX skills + 本仓库自带 RugShield skills
npm run install:core
# 或：node scripts/installer.js --core-only

# 4. 执行预检
npm run preflight
# 或：node cli/rugshield.js
```

### 安装脚本会做什么？

它会自动：
- 安装 7 个必需的 OKX OnchainOS skills
- 把 `rugshield-scout` 和 `rugshield-guardian` 复制到 `~/.openclaw/workspace/skills/`
- 运行一次最终预检

---

## 7. 聊天式交互体验

RugShield 不是一个只适合藏在服务器后台的脚本。
它本来就是为 **聊天场景原生交互** 设计的：Telegram、Discord、飞书，或者任何接入 OpenClaw 的消息界面。

一个典型流程可以是：

1. 把 RugShield 安装进 OpenClaw
2. 让系统加载两个内置技能
3. 在聊天窗口中输入：
   - `运行 场景1：午夜土狗闪崩 模拟演示`
   - `执行全仓体检`
   - `Guardian Agent，检查最新威胁报告并告诉我持仓暴露`
4. 系统会直接在聊天界面里输出：
   - 风险报告
   - 逃生建议
   - 路由模拟结果
   - 确认执行提示

这让它更像一个 7x24 在线的链上资金保镖，而不是一个命令行玩具。

---

## 8. 依赖的 OKX OnchainOS Skills

### Scout Agent 依赖
- `okx-dex-token`
- `okx-dex-market`
- `okx-dex-signal`
- `okx-dex-trenches`

### Guardian Agent 依赖
- `okx-wallet-portfolio`
- `okx-dex-swap`
- `okx-onchain-gateway`

---

## 9. 运行模式

### Safe Mode（安全模式）
默认模式。
每一步执行前都需要人工确认。

适合：
- 主钱包
- 较大资金
- 初次部署
- 需要更强可控性的用户

### Auto-Defense Mode（自动防御模式）
当 `AUTO_DEFENSE_MODE=true` 时，Guardian 可以在高危场景下自动处理。

适合：
- 小资金高风险钱包
- Meme 冲土狗钱包
- 夜间无人值守防御
- 更在意速度而不是人工介入的用户

---

## 10. 典型作战场景

### 场景 1：午夜土狗闪崩
**问题：** 用户睡着后，Dev 砸盘、巨鲸跑路，图表瞬间归零  
**RugShield 响应：** Scout 识别为 CRITICAL 风险，Guardian 立即执行全额避险换成 USDC

### 场景 2：多钱包空投防守
**问题：** 用户在多个钱包里拿到同一空投，开盘后抛压太大，手动切钱包根本来不及  
**RugShield 响应：** Guardian 聚合多钱包持仓暴露，并给出统一的退出方案

### 场景 3：流动性枯竭陷阱
**问题：** 价格表面没崩，但 LP 正在被抽走，盲目市价卖会被滑点吞掉  
**RugShield 响应：** Guardian 先模拟路由，识别极端滑点风险，拦截危险执行

### 场景 4：全仓体检与高频巡检
**问题：** 用户资产分散在多个钱包和多条链上，难以持续监控  
**RugShield 响应：** Guardian 拉取暴露面，Scout 批量评分，生成统一健康矩阵

---

## 11. 为什么这个项目值得关注？

这不是又一个“帮你发现下一个热点币”的 AI 工具。

RugShield 聚焦的是一个更真实、更痛的需求：
**在链上快速失败事件里，帮助用户优先保住本金。**

它把这些能力合在一起：
- 聊天式交互体验
- 双智能体分工清晰
- 感知用户真实持仓
- 考虑 MEV 与执行摩擦
- 评委可快速复现 Demo
- 与 OKX 生态高度对齐

所以它同时具备：
- **产品价值**
- **架构合理性**
- **比赛演示友好度**

---

## 12. 适合比赛现场的演示顺序

如果你要现场路演，最顺的一套流程是：

1. 运行 `npm run demo`
2. 解释：**Scout 负责发现风险，Guardian 负责保护资金**
3. 展示结构化 Threat Report
4. 展示 Guardian 的模拟救援结果
5. 说明 Safe Mode 和 Auto-Defense Mode 的区别
6. 最后用一句话收尾：  
   **“大多数 Agent 帮你追涨，RugShield 帮你防 Rug。”**

---

## 13. 仓库结构

```text
OKX-RugShield/
├── cli/rugshield.js
├── scripts/installer.js
├── skills/
│   ├── rugshield-scout/SKILL.md
│   └── rugshield-guardian/SKILL.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PRODUCTION_CHECKLIST.md
│   └── RUNBOOK.md
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 14. 给 OpenClaw Agent 的接手说明

如果一个 OpenClaw Agent 收到这个仓库，应按以下顺序处理：

1. 阅读 `skills/rugshield-scout/SKILL.md`
2. 阅读 `skills/rugshield-guardian/SKILL.md`
3. 执行 `npm install`
4. 执行 `node scripts/installer.js --core-only`
5. 提示用户填写 `.env`
6. 执行 `node cli/rugshield.js`

---

**Powered by OpenClaw + OKX OnchainOS Skills.**
