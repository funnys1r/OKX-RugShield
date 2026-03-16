# OKX RugShield 🛡️ | Architecture

The system utilizes an asynchronous Dual-Agent pipeline running atop OpenClaw and the `okx/onchainos-skills` framework.

![Dual Agent Flow](https://i.imgur.com/placeholder-flow.png)

## Component 1: OpenClaw Core
RugShield runs as a set of plugins on OpenClaw, benefiting from the standard MCP-like tool interface.

## Component 2: Scout Agent (Market Reconnaissance)
* **Goal**: Detect risk before the chart collapses.
* **OnchainOS Depedencies**: `okx-dex-token`, `okx-dex-market`, `okx-dex-signal`, `okx-dex-trenches`.
* **Execution**: Emits JSON `Threat Reports` instead of forcing a user to read paragraphs of text. This decoupling allows the Guardian to process the risk structuredly.

## Component 3: Guardian Agent (Execution & Router)
* **Goal**: Determine exact user exposure and build an escape path.
* **OnchainOS Dependencies**: `okx-wallet-portfolio`, `okx-dex-swap`, `okx-onchain-gateway`.
* **Execution**: Reads the `Threat Report`. Scans the user portfolio (`okx-wallet-portfolio`). If $0, ignores. If $>0, simulates a dump path using `okx-onchain-gateway`. If slippage is acceptable, it asks for user `CONFIRM`. If `AUTO-DEFENSE-MODE` is true, it overrides `CONFIRM` and instantly broadcasts the `okx-dex-swap` object.

## Why Separate?
Single-agent systems hallucinate heavily during market stress because their system prompts become enormous: "Read the news, check the charts, check my wallet, calculate slippage, execute the trade."  
We stripped out the noise: Scout looks at the market. Guardian looks at the wallet and router. This prevents context contamination.
