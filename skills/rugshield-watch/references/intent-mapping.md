# Intent Mapping

Use this file when the user's wording is casual, short, or ambiguous.

## Monitoring intent → watcher action

### Immediate / one-shot language
Examples:
- 马上检查一次
- 查一下
- 看看有没有问题
- 现在扫一下
- 按默认方案检查

Default action:
- run watcher once
- use summary mode
- use default config if no wallet list is specified

## Persistent monitoring intent
Examples:
- 帮我盯着这个钱包
- 以后定时看一下
- 每半小时查一次
- 有问题再提醒我
- 按默认方案开

Default action:
- explain the proposed watch policy
- if persistent scheduling is not yet wired, say that clearly
- still run one immediate summary patrol so the user gets useful output now

## Wallet-specific phrases
Examples:
- 看下这个钱包
- 检查这个地址
- 帮我盯着 0x...

If the user asks for a one-time exposure review:
- Guardian is acceptable

If the user asks for recurring monitoring / watch / patrol:
- prefer RugShield Watch

## Fallback policy
If watcher runtime fails:
1. say RugShield watcher path was attempted
2. explain the actual failure
3. only then offer a conservative fallback
