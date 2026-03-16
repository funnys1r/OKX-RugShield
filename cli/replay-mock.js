#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const input = process.argv[2] || path.join(__dirname, '..', 'mock', 'mock-rug-event.json');
const event = JSON.parse(fs.readFileSync(input, 'utf8'));
console.log(JSON.stringify({
  mode: 'replay',
  component: 'rugshield-scout',
  token: event.token || 'UNKNOWN',
  chain: event.chain || 'unknown',
  risk_level: event.risk_level || 'HIGH',
  confidence: event.confidence || 'medium',
  key_signals: event.key_signals || ['liquidity_drop', 'smart_money_exit'],
  brief_reasoning: event.brief_reasoning || 'Mock event replay indicates elevated rug risk.',
  affected_tokens: [event.token || 'UNKNOWN'],
  recommended_next_action: 'Run rugshield-guardian'
}, null, 2));
