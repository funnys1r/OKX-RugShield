# OKX RugShield 🛡️ | 上线检查清单

在用真实资金运行 RugShield 之前，请至少确认以下事项全部完成。

## [ ] 1. OpenClaw 隔离运行
请确保 RugShield 运行在一个独立的 OpenClaw workspace 中。
不要把日常写代码、写文档的智能体和负责真实资金防御的 Guardian 混在一起，否则容易造成上下文污染或误执行。

## [ ] 2. 环境变量已正确填写
```env
OKX_API_KEY=********
OKX_API_SECRET=********
OKX_API_PASSPHRASE=********
AUTO_DEFENSE_MODE=false # 建议先从 false 开始
```

请确认这些值已经从 OKX 后台正确获取，并写入 `.env` 文件。

## [ ] 3. 已按 OpenClaw Skill 形态接入
请确认：
- 外部 OKX OnchainOS skills 已安装
- `rugshield-scout` 与 `rugshield-guardian` 已被 OpenClaw 发现
- 你准备用聊天界面触发，而不是只依赖 CLI

CLI 只能作为预检或比赛兜底演示，不应当作真实生产主入口。

## [ ] 4. 已验证 Safe Mode
请先运行：

```bash
node cli/rugshield.js
```

并确认日志中出现 Safe Mode 提示。

在你明确接受非人工介入执行之前，不要急着开启 Auto-Defense Mode。

## [ ] 5. 依赖技能已安装
请确认你已经执行：

```bash
node scripts/installer.js --core-only
```

并且已经安装到至少以下关键技能：
- `okx-dex-swap`
- `okx-wallet-portfolio`

## [ ] 6. 已做一次模拟退出验证
在 Safe Mode 下，等待一次 `WATCH` 或 `WARNING` 级别风险触发。
观察 Guardian 是否能够正确读取 `okx-wallet-portfolio` 持仓，并在尝试 `okx-onchain-gateway` 路由前完成模拟。

如果你只想测试流程，可以在需要确认时输入 `NO`，而不是 `CONFIRM`，从而取消执行。

如果这一整套链路都符合预期，再进入真实生产使用。
