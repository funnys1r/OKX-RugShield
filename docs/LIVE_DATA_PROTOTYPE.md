# OKX RugShield 🛡️ | 真实链上数据原型

这份文档说明当前仓库中新增的“真实链上数据输入”原型。

## 目标

此前仓库的多数演示入口基于本地 mock 数据。
当前新增的 live data prototype 目标是：

- 通过 OKX OnchainOS Skills 获取真实 token / market 数据
- 将真实市场数据接入 RugShield 的 Guardian 策略链路
- 在不触发真实广播的前提下，展示“真实数据输入 → 原型风控输出”这一闭环

## 入口命令

```bash
npm run live:signal -- OKB xlayer
```

参数含义：
- 第 1 个参数：代币查询词，默认 `OKB`
- 第 2 个参数：链名，默认 `xlayer`
- 第 3/4 个参数（可选）：模拟持仓价值与模拟持仓数量

## 当前能力边界

这个原型当前做的是：
- 真实调用 `okx-dex-token` / `okx-dex-market`
- 根据真实价格、流动性、24h 变化做原型级风险推断
- 再将结果交给 `lib/exit-strategy.js` 生成 Guardian 策略

它当前还不是：
- 完整实盘风控结论
- 实盘自动执行器
- 基于真实钱包实时暴露的完整闭环

因此最准确的定位是：
**真实链上数据驱动的 Guardian 原型桥接层。**
