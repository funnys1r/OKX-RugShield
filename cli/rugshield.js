#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const mockPath = path.join(__dirname, '..', 'mock', 'mock-rug-event.json');
const useMock = process.argv.includes('--mock');
if (useMock && fs.existsSync(mockPath)) {
  const event = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
  console.log(JSON.stringify({
    mode: 'mock',
    component: 'rugshield-scout',
    token: event.token || 'UNKNOWN',
    chain: event.chain || 'unknown',
    risk_level: event.risk_level || 'HIGH',
    confidence: event.confidence || 'medium',
    key_signals: event.key_signals || ['liquidity_drop'],
    recommended_next_action: 'Run guardian simulation or live portfolio check'
  }, null, 2));
} else {
  console.log('OKX RugShield CLI ready. Use --mock for demo mode.');
}
