# Intent Routing

这份文档把 **用户意图 → 默认动作映射** 正式写成实现导向规则。

目标不是让用户学习固定咒语，而是让 RugShield 在用户说人话时，仍然能够稳定地路由到正确能力，并用合理默认值完成一次可用的链上防 rug 动作。

---

## 1. 设计目标

RugShield 现在有三层能力：

- **Scout**：看 token / market 风险
- **Guardian**：看钱包暴露与防守报告
- **Watcher**：看多钱包巡检、差异比较、主动告警

用户不会天然按这三个名字说话。
用户更可能说：

- `马上检查一次`
- `查一下`
- `帮我看下这个钱包`
- `看下这个币有没有问题`
- `按默认方案开`
- `以后有问题提醒我`

因此需要一套统一的路由规则，把用户表达自动解释成：

- 该走哪个 skill
- 默认参数是什么
- 默认输出格式是什么
- live 失败时如何降级

---

## 2. 总路由原则

### 2.1 优先专用能力
只要命中以下特征，就优先走 RugShield，不先走浏览器 / public-source fallback：

- 钱包地址 `0x...`
- `rug`
- `meme`
- `风险`
- `爆雷`
- `巡检`
- `盯着`
- `提醒我`
- `高风险 token`
- `防守报告`

### 2.2 默认优于追问
如果用户没有提供所有参数：
- 优先补默认值
- 不要第一时间追问实现细节
- 只在确实影响持续监控创建时再追问最小问题

### 2.3 失败时透明降级
如果 RugShield live 路径失败：
1. 明确说明已尝试 RugShield live
2. 给出失败原因
3. 再说明当前降级到什么模式
4. 不要直接假装系统本来就只能做保守检查

### 2.4 默认输出必须用户可读
默认输出：
- 中文
- 先结论后细节
- 摘要优先
- 非调试场景不返回原始 JSON

---

## 3. 用户意图分类

### A. Token 风险分析意图
典型说法：
- `看下这个币有没有 rug 风险`
- `分析这个 token`
- `这个币安全吗`
- `有没有 Dev 砸盘`
- `聪明钱是不是撤了`
- `流动性是不是出问题了`

默认动作：
- 路由到 `rugshield-scout`
- 输出 Threat Report 简版
- 如果风险高，建议接 Guardian

---

### B. 钱包暴露分析意图
典型说法：
- `检查这个钱包有没有 rug 风险`
- `查一下这个地址`
- `看看这个钱包有没有中招`
- `有没有高风险仓位`
- `给我一个防守报告`
- `帮我看下暴露情况`

默认动作：
- 路由到 `rugshield-guardian`
- 默认链：`xlayer,ethereum,base,arbitrum,bsc`
- 默认输出中文结构化防守报告

---

### C. 一次性巡检意图
典型说法：
- `马上检查一次`
- `查一下`
- `看看有没有问题`
- `现在扫一下`
- `按默认方案检查`

默认动作：
- 优先路由到 `rugshield-watch`
- 若给了明确单个钱包并强调“这个地址/这个钱包”，也可转为 Guardian
- 默认输出 watcher 摘要
- 默认使用 watch 默认配置

---

### D. 持续监控 / 定时巡检意图
典型说法：
- `帮我盯着这个钱包`
- `看着这个地址`
- `以后定时查一下`
- `每 30 分钟查一次`
- `只在有问题的时候提醒我`
- `按默认方案开`

默认动作：
- 路由到 `rugshield-watch`
- 如果持久调度尚未真正创建，不要冒充已经开启
- 先执行一次 watcher summary，让用户马上拿到结果
- 再说明建议的监控频率和告警规则

---

## 4. 默认动作映射表

| 用户表达 | 默认 skill | 默认行为 | 默认输出 |
|---|---|---|---|
| 马上检查一次 | rugshield-watch | 立即跑一次 watcher summary | 中文摘要 |
| 查一下 | rugshield-watch / guardian | 无地址 → watcher；有钱包 → guardian | 中文摘要 |
| 看下这个币 | rugshield-scout | 跑 token 风险分析 | Threat Report 简版 |
| 查这个地址 | rugshield-guardian | 跑单钱包 live 防守报告 | 中文结构化报告 |
| 帮我盯着这个钱包 | rugshield-watch | 先跑一次摘要巡检，再说明监控方案 | 中文摘要 + 监控建议 |
| 按默认方案开 | rugshield-watch | 默认 watcher 方案；若无持久调度则先执行一次并说明下一步 | 中文摘要 |
| 只在有问题提醒我 | rugshield-watch | 默认 alert-only 监控策略 | 中文摘要 |

---

## 5. 默认参数规则

### 5.1 默认链
如果用户没有指定链，默认使用：

```text
xlayer,ethereum,base,arbitrum,bsc
```

### 5.2 默认 watcher 配置
如果用户没有指定钱包列表或配置文件，默认使用：

```text
./config/watch-wallets.example.json
```

### 5.3 默认输出模式
- 一次性巡检：`summary-only`
- 钱包防守报告：中文结构化长报告
- token 风险分析：Threat Report 简版

### 5.4 默认安全姿态
- analysis only
- 不自动执行链上操作
- Safe Mode 下保留确认要求

---

## 6. Watcher 的默认行为规则

### 用户说“马上检查一次”
解释为：
- 立即执行一次 watcher
- 使用默认 config
- 只返回摘要
- 不创建持久调度

### 用户说“按默认方案开”
解释为：
- 这是 watch intent，不是浏览器巡检 intent
- 默认先执行一次摘要巡检
- 然后说明“默认方案”包括：
  - 默认 watchlist
  - 默认链
  - 默认告警规则
  - 默认建议频率

### 用户说“帮我盯着 / 定时查”
解释为：
- 这是持续监控 intent
- 如果调度尚未真的配置：
  - 不要说“已开启”
  - 先返回本次巡检结果
  - 再说明建议的持久监控策略

---

## 7. Guardian 与 Watcher 的边界

### 优先走 Guardian 的情况
- 用户明确给出一个钱包地址
- 需求重点是“这个钱包现在暴露了什么”
- 需求重点是“给我防守报告 / 退出方案”

### 优先走 Watcher 的情况
- 用户强调“检查一次 / 查一下 / 巡检”
- 用户强调“盯着 / 看着 / 定时 / 提醒我”
- 用户想看默认 watchlist 或多钱包巡检
- 用户重点是监控，不是单次资产画像

### 冲突时的默认优先级
若同时出现：
- 单钱包地址
- 明确“盯着 / 定时查 / 提醒我”

则优先：
1. `rugshield-watch`
2. 必要时内部调用 Guardian 作为暴露分析引擎

---

## 8. 失败与降级实现规则

### 错误示范
```text
浏览器链上页面当前不可用，因此不能确认
```

这类回复的问题是：
- 没说明是否尝试了 RugShield live 路径
- 会让用户误以为产品本来就只能靠网页

### 正确示范
```text
我已优先尝试 RugShield 的 live watcher / guardian 路径，但当前 OKX / OnchainOS 通道未成功返回结果。
失败原因：xxx。
现在我可以降级到保守模式继续检查，但该结果不能替代真实持仓扫描。
```

### 降级顺序
1. RugShield live
2. RugShield simulation / demo / mock
3. public-source conservative fallback

---

## 9. 实现建议

### 9.1 Skill 层
- `rugshield-scout`：覆盖 token 风险自然语言
- `rugshield-guardian`：覆盖钱包暴露自然语言
- `rugshield-watch`：覆盖巡检 / 盯盘 / 默认方案自然语言

### 9.2 Runtime 层
- `cli/live-portfolio-guardian.js`：单钱包中文结构化报告
- `cli/watch-wallets.js`：多钱包 watcher 摘要、差异、告警
- `skills/rugshield-watch/scripts/run-watch.sh`：自然语言 skill 的稳定执行桥

### 9.3 后续继续增强
- 增加持久调度创建能力
- 增加“当前监控状态”查询
- 增加告警摘要推送到 Feishu / Telegram

---

## 10. 验收标准

### Case 1
用户说：
```text
马上检查一次
```
期望：
- 命中 `rugshield-watch`
- 使用默认 config 跑 watcher summary
- 返回中文摘要

### Case 2
用户说：
```text
检查这个钱包有没有 rug 风险 0x...
```
期望：
- 命中 `rugshield-guardian`
- 返回中文结构化钱包报告

### Case 3
用户说：
```text
看下这个币有没有问题
```
期望：
- 命中 `rugshield-scout`
- 返回 Threat Report 简版

### Case 4
用户说：
```text
帮我盯着这个钱包
```
期望：
- 命中 `rugshield-watch`
- 先返回一次摘要巡检
- 再说明默认监控策略

### Case 5
live 失败时：
- 必须先说明 RugShield live 已尝试
- 必须解释失败原因
- 再说明降级结果

---

## 11. 一句话总结

RugShield 的目标不是让用户学会“正确命令”，而是：

> 用户说人话，系统自动判断是 Scout、Guardian 还是 Watcher，补齐默认参数，优先走专用 live 路径，并在失败时透明降级。
