# OKX RugShield 🛡️ | Production Checklist

Before running RugShield with real size, ensure the following steps are ticked:

## [ ] 1. OpenClaw Isolation
Ensure RugShield is running in an isolated OpenClaw workspace. Do not mix your coding/writing agents with your financial Guardian. It risks context contamination and accidental execution.

## [ ] 2. Environment Variables Set
```
OKX_API_KEY=********
OKX_API_SECRET=********
OKX_API_PASSPHRASE=********
AUTO_DEFENSE_MODE=false # START WITH FALSE
```
Ensure you have pulled correctly from OKX Dashboard and these are populated in `.env`.

## [ ] 3. Safe Mode Verified
Always run `node cli/rugshield.js` against your environment. Ensure it logs:
`SAFE-MODE active. The Guardian agent will wait for your explicit CONFIRM string in OpenClaw...`
Do not enable Auto-Defense until you are explicitly comfortable with non-HITL operations.

## [ ] 4. Dependencies Installed
Ensure you ran `node scripts/installer.js --core-only`. 
You must see `okx-dex-swap` and `okx-wallet-portfolio` amongst the installed OKX OnchainOS skills.

## [ ] 5. Test Transaction
In Safe Mode, wait for a `WATCH` or `WARNING` signal. Observe if the Guardian Agent accurately pulls your `okx-wallet-portfolio` balances before attempting to route an `okx-onchain-gateway` transaction. Say "NO" instead of "CONFIRM" to cancel the simulation. If the simulation logic holds up, you are ready for Production.
