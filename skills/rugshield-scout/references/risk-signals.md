# Risk Signals

Use these signals to grade rug risk conservatively.

## Primary signals

### Liquidity drop

Treat sudden liquidity decline as a top-tier warning, especially when paired with widening slippage or failed route simulation.

### Abnormal price and volume

Watch for:
- sharp one-direction candles
- abnormal sell volume clusters
- large divergence between volume and holder behavior

### Dev or deployer sell pressure

Upgrade risk if deployer, team, or related wallets are distributing aggressively.

### Smart money exit

If previously profitable or tracked wallets exit quickly, increase severity.

### Holder concentration

Raise concern when a small set of wallets controls a large share of supply or liquidity.

## Severity heuristic

- `LOW`: one weak signal, low confidence
- `MEDIUM`: multiple moderate signals, incomplete confirmation
- `HIGH`: strong signal cluster or one dominant severe signal
- `CRITICAL`: multiple severe signals with high confidence and immediate downside risk

## Confidence

Confidence should reflect data quality and signal agreement, not rhetorical certainty.

- `low`: partial or noisy data
- `medium`: several aligned signals
- `high`: strong agreement from independent indicators
