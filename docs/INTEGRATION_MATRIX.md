# OKX RugShield 🛡️ | OnchainOS 集成矩阵

这份文档用于说明 RugShield 与 OKX OnchainOS Skills 的具体对应关系，帮助评审快速判断项目的集成深度。

## 1. Scout Agent 集成

| Skill | 用途 | 在系统中的位置 |
|---|---|---|
| `okx-dex-token` | 获取代币基础结构、持币结构、元数据与潜在执行摩擦信息 | Scout 风险识别 |
| `okx-dex-market` | 观察价格波动、K 线、流动性变化 | Scout 风险识别 |
| `okx-dex-signal` | 观察聪明钱、鲸鱼或 KOL 相关信号 | Scout 风险识别 |
| `okx-dex-trenches` | 识别 trench 风险、Dev 行为、可疑 Meme 风险 | Scout 风险识别 |

## 2. Guardian Agent 集成

| Skill | 用途 | 在系统中的位置 |
|---|---|---|
| `okx-wallet-portfolio` | 检查用户是否真实持有风险资产，统计多钱包暴露 | Guardian 暴露检查 |
| `okx-dex-swap` | 生成退出路径或换仓路径 | Guardian 路由规划 |
| `okx-onchain-gateway` | 模拟执行、估算滑点与执行可行性 | Guardian 模拟/执行 |

## 3. 闭环关系

RugShield 的典型闭环如下：

1. Scout 使用 `token/market/signal/trenches` 识别风险
2. Scout 输出结构化 `Threat Report`
3. Guardian 使用 `wallet-portfolio` 检查用户是否真实暴露
4. Guardian 使用 `dex-swap` 规划退出路径
5. Guardian 使用 `onchain-gateway` 做模拟与执行前判断

## 4. 当前集成边界

当前仓库的重点是：
- 明确 Skill 角色分工
- 明确集成闭环
- 提供可复现的 mock 演示与安装流程

当前尚未在仓库中实现完整的：
- Mempool / Pending Transaction 抢先防御
- 多链专项优化展示（当前说明以 EVM / X Layer 风格路径为主）
- 完整实盘级自动执行框架

因此，这份项目更适合被理解为：
**一个以 OpenClaw Skill 为主形态、已打通核心集成闭环、并提供 mock 验证入口的链上风控项目原型。**
