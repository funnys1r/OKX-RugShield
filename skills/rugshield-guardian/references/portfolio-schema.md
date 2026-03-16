# Portfolio Input Schema

Guardian can work from a live portfolio fetch or a manually supplied holding list.

## Minimum live input

- wallet address
- chain list, for example `xlayer,ethereum,base,arbitrum,bsc`
- optional result limit

## Manual holding list

Use this when live fetch is unavailable.

```json
{
  "wallets": ["0x123..."],
  "chains": ["xlayer", "base"],
  "positions": [
    {
      "token": "OKB",
      "chain": "xlayer",
      "amount": 120.5,
      "usd_value": 842.3,
      "liquidity_note": "thin"
    }
  ]
}
```

## Notes

- Prefer exact wallet addresses.
- Keep chain names normalized.
- If values are estimated manually, label them as estimated.
