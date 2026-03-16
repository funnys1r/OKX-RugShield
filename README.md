# OKX RugShield 🛡️

**一个面向多钱包链上用户的 OpenClaw 聊天式双智能体风控防御系统，由 OpenClaw + OKX OnchainOS Skills 驱动。**

<div align="center">
  <h3>不只是帮你找百倍币，更要帮你在 Rug 之前保住本金。</h3>
  <p>OKX Onchain OS AI 松参赛项目。</p>
</div>

---

## 1. 项目定位

**一句话介绍：**  
OKX RugShield 是一个运行在 OpenClaw 生态内的双 Skill / 双智能体风控系统，专门面向链上多钱包用户，在高风险代币出现 Rug 信号时，帮助用户完成“发现风险 → 检查暴露 → 模拟退出 → 执行防御”的完整链路。

它主要应对这些真实问题：

- Dev 砸盘
- 聪明钱快速撤退
- 流动性短时间枯竭
- 土狗半夜闪崩
- 多钱包持仓来不及手动退出

大多数 AI Agent 都在帮用户寻找下一个机会。  
**RugShield 聚焦的是另一件更现实的事：在图表崩掉前，把本金尽可能安全地带走。**

---

## 2. 标准运行形态

这不是一个“以 CLI 为主、顺手支持 Skill”的项目。  
**RugShield 的标准运行形态，是 OpenClaw 里的聊天式双智能体 Skill 系统。**

也就是说，推荐使用方式是：

1. 将本仓库中的 `rugshield-scout` 与 `rugshield-guardian` 接入 OpenClaw
2. 安装所需的 OKX OnchainOS skills
3. 在聊天界面中触发 Scout 与 Guardian
4. 通过对话完成风控分析、持仓暴露检查、路由模拟与执行确认

CLI 只用于：
- **比赛现场兜底演示**
- **本地预检 / Demo fallback**

它不是项目主入口。

---

## 3. 为什么这个方向值得做？

对于空投猎人、Meme 玩家、多钱包链上用户来说，风险从来不是慢慢来的，而是几分钟内突然爆发。

等用户反应过来时，往往已经发生了：
- 巨鲸钱包先跑了
- 滑点迅速恶化
- LP 被抽走
- 最好的逃生路线已经没了

**RugShield 想做的，就是把这种混乱场景变成一个结构化防御流程：**

1. **Scout** 先发现风险
2. **Guardian** 再检查用户是否真的有持仓暴露
3. **Guardian** 计算并模拟最合适的退出路径
4. 按模式选择：**Safe Mode 人工确认**，或 **Auto-Defense Mode 自动响应**

---

## 4. 核心设计：Scout + Guardian 双智能体

RugShield 基于 **OpenClaw** 和 **OKX OnchainOS Skills** 构建成一个双智能体系统。

### Scout Agent：市场侦察官
Scout 不负责执行交易，只负责侦测风险，并输出结构化 `Threat Report`。

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
- 根据模式决定等待 `CONFIRM`，还是自动推进

### 为什么要拆成两个智能体？
因为单智能体在高压链上场景里，容易把市场判断、持仓判断、执行判断、聊天输出混在一起，提示词越来越长，逻辑边界越来越模糊。

RugShield 的思路是：
- **Scout 专心看市场**
- **Guardian 专心保资金**

这样结构更清楚，也更适合比赛演示、调试和后续扩展。

---

## 5. 这个项目的亮点

### 5.1 实用性：不是一键全抛，而是阶梯式逃生
RugShield 不是机械地“发现风险就清仓”，而是按风险等级给出不同处理：

- **Level 1 风险（60–75）**：卖出 50% 换成 USDC，优先锁定本金
- **Level 2 风险（75–90）**：100% 切换到 ETH / SOL 这类主流避险资产
- **Level 3 致命风险（90+）**：立即全额换成 USDC

### 5.2 创新性：MEV 感知的防夹逃生
在链上闪崩场景里，光“决定卖”是不够的。
你还得真的卖得出去，而且不能在路上被夹得体无完肤。

因此 RugShield 在设计上显式考虑了：
- 滑点恶化
- 紧急路由
- 提高 gas 优先级
- 执行前模拟验证
- 私有 RPC / 防夹广播偏好

### 5.3 与 OKX 生态结合紧密
项目围绕 OKX OnchainOS 技能栈形成闭环：

`portfolio -> token -> market -> signal -> trenches -> gateway -> swap`

这条链路把：
- 风险识别
- 用户真实暴露判断
- 路由模拟与执行

连成了一个完整工作流。

### 5.4 可复现性强
项目同时支持：
- **OpenClaw 标准形态**：真实聊天式双智能体使用
- **CLI 兜底演示形态**：评委没有完整 OpenClaw 环境时，快速跑 mock demo

---

## 6. 标准使用方式（OpenClaw 主入口）

推荐使用流程：

```bash
# 1. 安装依赖
npm install

# 2. 创建环境文件
cp .env.example .env
# 填入 OKX_API_KEY / OKX_API_SECRET / OKX_API_PASSPHRASE

# 3. 安装外部 OKX skills + 本仓库自带 RugShield skills
npm run install:core
# 或：node scripts/installer.js --core-only
```

安装脚本会自动：
- 安装 7 个必需的 OKX OnchainOS skills
- 把 `rugshield-scout` 和 `rugshield-guardian` 复制到 `~/.openclaw/workspace/skills/`
- 进行一次预检

完成后，推荐在 OpenClaw 的聊天界面中直接触发：

- `运行 场景1：午夜土狗闪崩 模拟演示`
- `执行全仓体检`
- `Guardian Agent，检查最新 Threat Report 并告诉我当前持仓暴露`

也就是说：
**真正的产品体验发生在聊天界面里，而不是终端里。**

---

## 7. 比赛现场兜底演示方式（CLI Fallback）

如果评委现场暂时没有完整 OpenClaw 环境，或者只想快速看懂逻辑闭环，可以运行：

```bash
cd OKX-RugShield
npm install
npm run demo
```

这会跑一个完整的 **模拟 Scout → Guardian → 资金救援流程**，特点是：
- 不需要真实 OKX 凭证
- 不需要真实钱包
- 不会真的广播交易

请注意：
**这只是比赛演示兜底入口，不是项目主形态。**

---

## 8. 聊天式交互体验

RugShield 本来就是为 **聊天场景原生交互** 设计的：Telegram、Discord、飞书，或者任何接入 OpenClaw 的消息界面。

一个典型流程可以是：

1. 把 RugShield 安装进 OpenClaw
2. 让系统加载两个内置技能
3. 在聊天窗口中输入：
   - `运行 场景1：午夜土狗闪崩 模拟演示`
   - `执行全仓体检`
   - `Guardian Agent，检查最新 Threat Report 并告诉我持仓暴露`
4. 系统会直接在聊天界面里输出：
   - 风险报告
   - 逃生建议
   - 路由模拟结果
   - 确认执行提示

这让它更像一个 7x24 在线的链上资金保镖，而不是一个命令行玩具。

---

## 9. 依赖的 OKX OnchainOS Skills

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

## 10. 运行模式

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

## 11. 典型作战场景

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

## 12. 为什么这个项目值得关注？

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

## 13. 适合比赛现场的演示顺序

如果你要现场路演，推荐这样讲：

1. 先说明：**这是一个运行在 OpenClaw 内的聊天式双智能体风控系统**
2. 解释：**Scout 负责发现风险，Guardian 负责保护资金**
3. 展示结构化 Threat Report
4. 展示 Guardian 的持仓暴露检查与模拟退出结果
5. 说明 Safe Mode 和 Auto-Defense Mode 的区别
6. 如果现场没有完整 OpenClaw 环境，再运行 `npm run demo` 作为兜底
7. 最后用一句话收尾：  
   **“大多数 Agent 帮你追涨，RugShield 帮你防 Rug。”**

---

## 14. 仓库结构

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

## 15. 给 OpenClaw Agent 的接手说明

如果一个 OpenClaw Agent 收到这个仓库，应按以下顺序处理：

1. 阅读 `skills/rugshield-scout/SKILL.md`
2. 阅读 `skills/rugshield-guardian/SKILL.md`
3. 执行 `npm install`
4. 执行 `node scripts/installer.js --core-only`
5. 提示用户填写 `.env`
6. 在 OpenClaw 环境中以聊天式方式触发 Scout / Guardian

---

**Powered by OpenClaw + OKX OnchainOS Skills.**
