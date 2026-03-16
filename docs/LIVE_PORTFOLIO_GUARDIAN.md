# OKX RugShield 🛡️ | 真实 Portfolio Guardian 原型

这份文档说明当前仓库中新增的“真实多链持仓 → Guardian 防守报告”原型。

## 目标

此前 Guardian 更多使用 mock 持仓或静态输入。
当前原型的目标是：

- 读取真实多链 wallet portfolio
- 过滤零价、噪音、小额资产
- 输出重点暴露列表
- 对重点资产生成原型级 Guardian 防守建议

## 入口命令

```bash
npm run live:portfolio -- <walletAddress> [chains] [minUsdValue]
```

示例：

```bash
npm run live:portfolio -- 0x58e79a0c44e9bf71152bd2e51fea4c88b8a05097 xlayer,ethereum,base,arbitrum,bsc 1
```

## 当前能力边界

这个原型当前做的是：
- 真实读取 OKX portfolio 数据
- 对持仓进行过滤与排序
- 为重点持仓输出 Guardian 风格防守建议

它当前还不是：
- 实盘自动执行器
- 真实风险评分引擎
- 基于真实池子深度的完整退出决策系统

因此最准确的定位是：
**真实钱包暴露输入驱动的 Guardian 原型分析入口。**
