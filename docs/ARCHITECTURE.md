# OKX RugShield 🛡️ | 架构说明

RugShield 运行在 OpenClaw 之上，底层依赖 `okx/onchainos-skills`，采用异步双智能体工作流。

![双智能体流程图](https://i.imgur.com/placeholder-flow.png)

## 组件 1：OpenClaw Core
RugShield 作为 OpenClaw 内的一组技能与工作流运行，复用标准化的工具调用接口与聊天式交互能力。

## 组件 2：Scout Agent（市场侦察官）
- **目标：** 在图表彻底崩掉前尽可能早地发现风险
- **依赖技能：** `okx-dex-token`、`okx-dex-market`、`okx-dex-signal`、`okx-dex-trenches`
- **执行方式：** 输出结构化 JSON `Threat Report`，而不是要求用户去阅读一大段自然语言说明。这样 Guardian 可以直接基于结构化结果继续处理。

## 组件 3：Guardian Agent（资金护卫官）
- **目标：** 判断用户是否真实暴露，并构建逃生路径
- **依赖技能：** `okx-wallet-portfolio`、`okx-dex-swap`、`okx-onchain-gateway`
- **执行方式：**
  1. 读取 `Threat Report`
  2. 使用 `okx-wallet-portfolio` 检查用户是否持仓
  3. 如果持仓为 0，则忽略
  4. 如果持仓大于 0，则调用 `okx-onchain-gateway` 模拟退出路径
  5. 如果滑点可接受，则在 Safe Mode 下请求用户输入 `CONFIRM`
  6. 如果 `AUTO_DEFENSE_MODE=true`，则绕过人工确认，直接执行 `okx-dex-swap` 路由

## 为什么要做双智能体拆分？
单智能体系统在链上高压场景里很容易因为提示词过长而失真：

> 既要读新闻、看图表、查钱包、算滑点、做路由、还要决定是否执行。

这会让职责过于混杂。

RugShield 的设计是主动降噪：
- **Scout 只看市场风险**
- **Guardian 只看用户持仓与执行路径**

这种分工可以减少上下文污染，让风控逻辑更清楚，也更容易解释给评委和用户。 
