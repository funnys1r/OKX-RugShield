# OpenClaw 安装即用

这份文档面向 OpenClaw 最终用户。

RugShield 现在建议按 **Scout / Guardian / Watcher** 三层来理解：

- **Scout**：负责发现代币风险
- **Guardian**：负责确认钱包暴露并生成防守方案
- **Watcher**：负责定时巡检多个钱包并输出差异告警

---

## 1. 使用路径总览

### 最终用户主路径

1. 安装官方 OKX / OnchainOS skills
2. 安装 `rugshield-scout`
3. 安装 `rugshield-guardian`
4. 如果需要 live 能力，配置 OKX 凭证
5. 在 OpenClaw 中直接通过自然语言调用
6. 如需定时巡检，再启用 Watcher 层

### 两种入口不要混淆

#### OpenClaw 用户入口
- 安装 skill
- 直接聊天调用
- 适合日常使用

#### 仓库命令入口
- 适合开发、评审、调试、本地演示
- 例如 `npm run demo` / `npm run live:portfolio`

---

## 2. 先安装官方 OKX / OnchainOS skills

官方仓库：
- `https://github.com/okx/onchainos-skills`

推荐安装方式：

```bash
npx skills add okx/onchainos-skills
```

常用能力包括：
- `okx-wallet-portfolio`
- `okx-dex-market`
- `okx-dex-signal`
- `okx-dex-trenches`
- `okx-dex-swap`
- `okx-dex-token`
- `okx-onchain-gateway`

---

## 3. 安装 RugShield 本地 skills

### 方式 A：安装核心 skills

```bash
node scripts/installer.js --core-only
```

会安装：
- `rugshield-scout`
- `rugshield-guardian`

### 方式 B：手动安装

```bash
bash skills/rugshield-scout/scripts/install-local.sh
bash skills/rugshield-guardian/scripts/install-local.sh
```

---

## 4. 配置 live mode 凭证

官方 README 推荐：

```bash
OKX_API_KEY="your-api-key"
OKX_SECRET_KEY="your-secret-key"
OKX_PASSPHRASE="your-passphrase"
```

RugShield 当前兼容：
- `OKX_SECRET_KEY`
- `OKX_API_SECRET`

如果你只做 Demo Mode，可以暂时不配置完整 live 依赖。

---

## 5. 在 OpenClaw 里怎么用

### Scout 场景

你可以直接说：
- `扫描 OKB 在 xlayer 上有没有 rug 风险`
- `帮我分析这个 token 有没有 Dev 砸盘风险`
- `回放一个 mock 风险事件并输出 Threat Report`
- `开始主动巡检高风险 token`

### Guardian 场景

你可以直接说：
- `检查我这个地址有没有暴露在高风险 token 上`
- `根据 Threat Report 给我一个退出方案`
- `帮我做一个 staged exit plan`
- `用 Safe Mode 输出一个防守建议`
- `检查这几个钱包在哪些链上持有可疑 meme 币`

### Watcher 场景

你可以直接说：
- `定时帮我检查这几个钱包有没有新增 rug 风险`
- `每 30 分钟巡检一次我的链上 meme 钱包`
- `只在新增高风险代币时提醒我`
- `把多钱包扫描结果做成一份巡检报告`

---

## 6. 本地命令入口（开发 / 调试 / 演示）

### 基础验证

```bash
npm install
cp .env.example .env
npm run preflight
npm run demo
npm run replay:mock
npm run patrol:mock
npm run simulate:guardian
npm run benchmark:verbose
```

### Live 原型命令

```bash
npm run live:signal -- OKB xlayer
npm run live:portfolio -- 0xYourWallet xlayer,ethereum,base,arbitrum,bsc 8
```

### 多钱包监控 MVP

```bash
npm run watch:wallets -- --config ./config/watch-wallets.example.json
```

---

## 7. 推荐理解方式

### Scout
看市场和代币风险。

### Guardian
看钱包和暴露程度。

### Watcher
看多个钱包的定时巡检和新增风险。

---

## 8. 一句话总结

RugShield 的理想使用方式是：

> 先安装官方 OKX / OnchainOS skills，再安装 RugShield skills，然后通过 OpenClaw 对话使用 Scout 与 Guardian；如果你需要多钱包定时巡检，再启用 Watcher 层。 
