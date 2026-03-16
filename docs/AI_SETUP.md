# OKX RugShield 🛡️ | AI / Agent 配置说明

这份文档用于说明本项目在当前原型阶段的 Agent 组织方式、模型使用方式与 Prompt 载体，帮助评审和协作者理解项目的 AI 组成。

## 1. Agent 结构

当前项目采用双 Agent / 双 Skill 结构：

- `rugshield-scout`
  - 负责市场侦察、风险识别、Threat Report 输出
- `rugshield-guardian`
  - 负责持仓暴露检查、退出策略生成、路由规划与模拟响应

## 2. Prompt / 指令载体

当前项目并未将 Prompt 写成单独的纯文本对话模板文件，而是主要以内嵌于 Skill 文档的方式存在：

- `skills/rugshield-scout/SKILL.md`
- `skills/rugshield-guardian/SKILL.md`

也就是说，当前原型的 Agent 行为主要由：
- Skill frontmatter（触发说明）
- Skill body（职责、流程、输出格式、约束）

共同定义。

## 3. 当前模型形态

本项目的标准运行入口是 OpenClaw。
因此实际模型使用与调度遵循 OpenClaw 当前会话/环境配置，而不是在本仓库中写死某一个模型。

当前原型仓库的定位是：
- 提供可被 OpenClaw 调用的双 Skill
- 提供本地 mock / 原型级桥接脚本
- 不把底层 LLM 锁死在单一厂商或单一型号上

## 4. 当前已实现的 AI 行为层

在当前仓库中，AI 相关能力主要体现在：

- Scout 对风险事件的结构化表达
- Guardian 对持仓暴露、退出比例、路由规划的原型级推理链
- mock / replay / patrol / simulate / live prototype 的程序化演示入口

## 5. 当前边界

当前仓库尚未提供：
- 完整独立的系统 Prompt 导出文件
- 某个固定模型版本与所有场景强绑定的配置
- 实盘级 autonomous execution agent

因此最准确的描述是：
**本项目当前以 OpenClaw Skill + 原型脚本的方式承载 Agent 行为，Prompt 的核心载体是两个 SKILL.md 文件。**
