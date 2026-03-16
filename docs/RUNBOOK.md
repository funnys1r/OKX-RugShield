# OKX RugShield 🛡️ | 使用手册

这份手册用于说明常见使用场景，以及在 OpenClaw 中应该如何触发 RugShield。

## 示例 1：后台风险巡检
**用户输入：** `Scout Agent，监控 SOL 和 Base 上的高风险 trench 资产。`

**预期输出：**
- 平时可能保持安静并持续轮询
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
- Guardian 直接通过 Gateway 广播执行
- Guardian 最终输出：`🛡️ RUGSHIELD IMPACT REPORT ... Result: Swapped to 500 USDC on Base. Tx Hash: 0xABC`

## 示例 4：不依赖 Threat Report 的手动调用
Guardian 不一定要等 Threat Report 才能用。

**用户输入：** `Guardian Agent，现在把我在 Optimism 上 50% 的 $ETH 换成 USDC。`

**预期输出：**
`正在模拟路由... 当前 Gas 约为 0.14 美元。如需执行，请输入 CONFIRM。`
