# OKX RugShield 🛡️ | 架构说明

RugShield 的标准运行形态是：**运行在 OpenClaw 生态内的双 Skill / 双智能体系统**。

CLI 只作为比赛演示或本地预检的兜底入口，**不是项目主形态**。

![双智能体流程图](https://i.imgur.com/placeholder-flow.png)

## 整体结构

RugShield 由三层组成：

1. **OpenClaw**：负责消息入口、技能调度、工具调用与聊天式交互
2. **Scout Agent**：负责市场侦察与风险识别
3. **Guardian Agent**：负责持仓暴露检查、逃生策略与模拟执行

## 组件 1：OpenClaw Core
RugShield 依托 OpenClaw 提供的 Skill 机制运行。

这意味着它的标准交互方式不是单独跑一个 Node 脚本，而是：
- 把技能安装进 OpenClaw
- 在聊天界面中触发 Scout / Guardian
- 通过对话完成告警、分析、确认与响应

## 组件 2：Scout Agent（市场侦察官）
- **目标：** 在图表彻底崩掉前尽可能早地发现风险
- **依赖技能：** `okx-dex-token`、`okx-dex-market`、`okx-dex-signal`、`okx-dex-trenches`
- **执行方式：** 输出结构化 JSON `Threat Report`，让 Guardian 能基于结果继续处理，而不是让用户自己消化一大段描述

## 组件 3：Guardian Agent（资金护卫官）
- **目标：** 判断用户是否真实暴露，并构建退出路径
- **依赖技能：** `okx-wallet-portfolio`、`okx-dex-swap`、`okx-onchain-gateway`
- **执行方式：**
  1. 读取 `Threat Report`
  2. 检查用户真实持仓
  3. 如果无暴露，则直接停止
  4. 如果有暴露，则评估退出策略
  5. 先模拟，再根据模式决定是否进入执行

## 当前实现边界

当前仓库已经明确实现或提供了：
- Skill 结构与角色拆分
- OpenClaw 接入方式
- mock 演示入口
- OnchainOS skill 安装流程
- 风险识别 → 暴露检查 → 模拟响应的闭环说明

当前仓库尚未完整提供：
- 实盘级自动执行代码
- 基于真实池子深度的精细退出比例计算模块
- Mempool 抢先防御模块

因此，当前项目最准确的定位是：
**已完成核心结构、集成闭环与 mock 验证入口的 Skill-first 原型。**

## 为什么要拆成双智能体？
单智能体在高压链上场景中，容易把市场分析、资产分析、执行判断和聊天输出混成一锅，导致：

- 上下文噪音过多
- 决策逻辑不清晰
- 提示词越来越长
- 风险与执行边界模糊

RugShield 的拆分方式是：
- **Scout 只管发现问题**
- **Guardian 只管保护资金**

这样职责更清楚，风控链路也更容易解释、调试和演示。

## CLI 的定位
仓库中的 CLI 主要用于两种场景：

1. **比赛兜底演示**：评委临时没有完整 OpenClaw 环境时，可快速跑 mock demo
2. **本地预检**：在接入真实环境变量前，先检查仓库结构与依赖状态

因此，CLI 是辅助层，不应被理解成项目本体。
