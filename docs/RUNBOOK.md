# OKX RugShield 🛡️ | 使用手册

这份手册说明 RugShield 在 OpenClaw 中的标准使用方式。

## 标准入口
请优先把 RugShield 当作 **OpenClaw Skill / 聊天式双智能体系统** 使用，而不是单独的 CLI 程序。

推荐流程：
1. 将 RugShield 相关技能装入 OpenClaw
2. 在聊天界面中触发 Scout 或 Guardian
3. 让系统通过对话输出告警、持仓暴露、策略与确认请求

## 示例 1：后台风险巡检
**用户输入：** `Scout Agent，监控 SOL 和 Base 上的高风险 trench 资产。`

**预期输出：**
- 平时可能保持安静并按轮次巡检
- 一旦发现异常，Scout 会在聊天上下文中输出结构化 JSON `Threat Report`

## 示例 2：触发 Guardian 处理
**用户输入：** `Guardian Agent，请检查最新的 Threat Report，并告诉我当前持仓暴露。`

**预期输出：**
`你当前在 2 个钱包中合计持有价值约 450 美元的 $MEME，逃生到 USDC 的预估滑点为 4%。如需执行，请输入 CONFIRM。`

## 示例 3：自动防御接管
**前提：** `.env` 中已设置 `AUTO_DEFENSE_MODE=true`

**用户输入：** `Scout Agent，持续监控。`

**预期输出：**
- Scout 输出 Threat Report
- Guardian 读取 Threat Report
- Guardian 检查 Portfolio：`检测到持仓暴露：1000 MEME`
- Guardian 根据模式自动推进或请求确认
- Guardian 最终输出：`🛡️ RUGSHIELD IMPACT REPORT ...`

## 示例 4：不依赖 Threat Report 的手动调用
Guardian 不一定要等 Threat Report 才能用。

**用户输入：** `Guardian Agent，现在把我在 Optimism 上 50% 的 $ETH 换成 USDC。`

**预期输出：**
`正在模拟路由... 当前 Gas 约为 0.14 美元。如需执行，请输入 CONFIRM。`

## 比赛演示兜底方式
如果现场暂时没有完整 OpenClaw 环境，可以用 CLI 做快速模拟：

```bash
npm install
npm run demo
```

但要明确说明：
**这只是比赛演示兜底入口，不是项目主形态。**
