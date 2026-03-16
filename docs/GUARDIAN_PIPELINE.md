# OKX RugShield 🛡️ | Guardian Pipeline 原型

这份文档说明当前仓库中用于体现 Guardian 闭环能力的原型入口。

## 目标

相比只在 Skill 文档里描述“Guardian 会怎么做”，这个原型的目标是：

- 接收 Threat Report 或 mock 事件输入
- 归一化风险输入
- 检查或承接持仓暴露数据
- 调用动态退出比例模块
- 生成更像真实执行前桥接层的 Guardian Pipeline 报告

## 命令

```bash
npm run simulate:guardian
```

默认读取：

```bash
mock/mock-rug-event.json
```

也可以传入其他 JSON 文件作为输入。

## 当前意义

这个原型并不是实盘执行器。
它的作用是让仓库中出现一个更明确的“桥接层”入口，帮助评审理解：

- Guardian 不只是提示词描述
- Guardian 不是单纯打印 demo 日志
- Guardian 已经开始具备将 Threat Report → 暴露检查 → 退出策略 → 路由规划 串起来的程序化原型
