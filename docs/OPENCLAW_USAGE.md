# OpenClaw 安装即用

这份文档专门面向 **OpenClaw 最终用户**。

重点不是让你手动跑仓库命令，而是：

- 先安装官方 OKX / OnchainOS skills（如果你要 live 能力）
- 安装 RugShield skills
- 然后直接通过对话使用

## 1. 使用路径总览

### 目标路径

1. 安装官方 OKX / OnchainOS skills
2. 把 `rugshield-scout` 安装到 OpenClaw
3. 把 `rugshield-guardian` 安装到 OpenClaw
4. 如果需要 live 能力，配置 OKX 凭证
5. 在 OpenClaw 对话中直接触发

### 不要混淆两种入口

#### OpenClaw 用户入口
这是最终用户主入口：
- 安装 skill
- 直接聊天调用

#### 仓库命令入口
这是给：
- 开发者
- 评委
- 没有完整 OpenClaw 环境时的本地演示

所以：
- `npm run demo` 不是最终用户主路径
- OpenClaw 对话触发才是最终使用方式

## 2. 先安装官方 OKX / OnchainOS skills

官方仓库：
- `https://github.com/okx/onchainos-skills`

根据官方 README，推荐安装方式是：

```bash
npx skills add okx/onchainos-skills
```

官方仓库中列出的核心 skills 包括：
- `okx-wallet-portfolio`
- `okx-dex-market`
- `okx-dex-signal`
- `okx-dex-trenches`
- `okx-dex-swap`
- `okx-dex-token`
- `okx-onchain-gateway`

## 3. 安装 RugShield 本地 skills

### 方式 A：使用安装脚本

在项目根目录运行：

```bash
node scripts/installer.js --core-only
```

这会把以下两个 skill 安装到默认 OpenClaw 技能目录：

- `rugshield-scout`
- `rugshield-guardian`

默认目录：

```bash
~/.openclaw/workspace/skills/
```

### 方式 B：手动安装

```bash
bash skills/rugshield-scout/scripts/install-local.sh
bash skills/rugshield-guardian/scripts/install-local.sh
```

## 4. 配置 live mode 凭证

根据官方仓库 README，推荐配置：

```bash
OKX_API_KEY="your-api-key"
OKX_SECRET_KEY="your-secret-key"
OKX_PASSPHRASE="your-passphrase"
```

RugShield 当前同时兼容：
- `OKX_SECRET_KEY`
- `OKX_API_SECRET`

如果你只想做 Demo Mode，可以先不配置完整 live 依赖。

## 5. 安装后如何在 OpenClaw 中直接使用

安装完成后，直接在 OpenClaw 中发自然语言请求。

### Scout 触发示例

- `扫描 OKB 在 xlayer 上有没有 rug 风险`
- `帮我分析这个 token 有没有流动性异常`
- `回放一个 mock 风险事件并输出 Threat Report`
- `开始主动巡检高风险 token`

### Guardian 触发示例

- `检查我这个地址有没有暴露在高风险 token 上`
- `根据 Threat Report 给我一个退出方案`
- `帮我做一个 staged exit plan`
- `用 Safe Mode 输出一个防守建议`

## 6. 什么时候才需要跑仓库命令

只有在下面这些场景，才需要用仓库命令：

- 你在开发或调试
- 你是评委，需要快速验证项目
- 你当前没有完整 OpenClaw 环境
- 你想跑 preflight / benchmark

典型命令：

```bash
npm run preflight
npm run demo
npm run replay:mock
npm run simulate:guardian
npm run benchmark:verbose
```

## 7. 推荐理解方式

### OpenClaw 用户视角
- 安装官方 OKX skills
- 安装 RugShield skills
- 在聊天里直接使用

### 开发者 / 评委视角
- 使用命令行做验证
- 确认 demo/live prototype 状态
- 检查文档、输出、可复现性

## 8. 一句话总结

RugShield 的理想使用方式是：

> **先安装官方 OKX / OnchainOS skills，再安装 RugShield skills，然后直接通过 OpenClaw 对话使用；仓库命令只是开发、评测和演示辅助入口。**
