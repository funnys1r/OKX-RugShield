# OKX RugShield 🛡️ | Runbook

This runbook offers common scenarios and how to prompt OpenClaw to properly utilize RugShield.

## Example 1: The Idle Watch
**User Input**: "Scout Agent, watch for risks across SOL and Base trenches."
**Expected OpenClaw Output**: (Silence, polling). If a risk is found, the Scout Agent outputs a structured JSON Threat Report to the chat context. 

## Example 2: The Guardian Trigger
**User Input** (or automatically if Scout outputs a Threat): "Guardian Agent, please review the latest Threat Report and tell me our exposure."
**Expected OpenClaw Output**: "You have $450 equivalent in $MEME across 2 wallets. The slippage to escape to USDC is currently 4%. Please type `CONFIRM` to execute."

## Example 3: Auto-Defense Intercept
*(Assuming AUTO_DEFENSE_MODE=true in .env)*
**User Input**: "Scout Agent, continuous watch."
**Expected OpenClaw Output**: 
- Scout emits Threat Report.
- Guardian detects Threat Report.
- Guardian checks Portfolio: "Exposure detected: 1000 MEME."
- Guardian directly broadcasts via Gateway.
- Guardian final Output: "🛡️ RUGSHIELD IMPACT REPORT... Result: Swapped to 500 USDC on Base. Tx Hash: 0xABC"

## Example 4: Manual Swap Overrides
You don't need a threat report to use the Guardian.
**User Input**: "Guardian Agent, swap 50% of my $ETH into USDC right now on Optimism."
**Expected OpenClaw Output**: "Simulating route... Gas is $0.14. Please `CONFIRM` the execution."
