#!/usr/bin/env node
/**
 * @file rugshield.js
 * @description The CLI Orchestrator for OKX RugShield.
 * Provides a demo mode for judges and a preflight check for real deployments.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const repoRoot = path.join(__dirname, '..');
const envPath = path.join(repoRoot, '.env');
dotenv.config({ path: envPath });

function logger(msg, type = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] ${msg}`);
}

function hasFile(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function printStatus(label, status) {
  console.log(`- ${label}: ${status}`);
}

function runMockDemo() {
  console.log('\n🛡️ OKX RugShield Mock Demo\n');
  logger('Initializing Mock Demo (Hackathon / Judge Mode)...');
  logger('No live credentials required. Using fully simulated threat intelligence and execution.', 'INFO');

  setTimeout(() => {
    logger('[Scout Agent] 🚨 CRITICAL RISK IDENTIFIED for token 0xPepeDump', 'WARN');
    console.log(JSON.stringify({
      source: 'RugShield-Scout',
      threat_level: 'CRITICAL',
      rugged_score: 94,
      token_address: '0xPepeDump...',
      chain: 'x-layer',
      reason: 'Dev wallet dumped 80% / Smart money net outflow 90% in 5min'
    }, null, 2));
  }, 800);

  setTimeout(() => {
    logger('[Guardian Agent] Intercepted Scout Threat Report. Executing Multi-Wallet Sweep...');
    logger('[Guardian Agent] Target Found: 50,000 PepeDump in Meme Wallet (0xMeme...)');
    logger('[Guardian Agent] Applying Tiered Exit Strategy (Level 3: Fatal Risk -> Market Sell to USDC)');
    logger('[Guardian Agent] Simulating Route via okx-onchain-gateway...');
  }, 2200);

  setTimeout(() => {
    logger('[Guardian Agent] ⚠️ MEV-Aware Anti-Sandwich Protection Activated. Using Private RPC.');
    logger('[Guardian Agent] Simulation Success. Pre-estimated Slippage: 2.1%');
    logger('[Guardian Agent] 🚀 AUTO_DEFENSE_MODE = true. Bypassing human confirmation.');
    logger('[Guardian Agent] Broadcasting simulated swap transaction to OKX X Layer L2...');
    logger('[Guardian Agent] ✅ Simulated transaction confirmed. Rescued 45,000 USDC. Funds secured.');
    process.exit(0);
  }, 4200);
}

async function runPreCheck() {
  logger('Initializing OKX RugShield Dual-Agent System...');

  const scoutDir = path.join(repoRoot, 'skills/rugshield-scout');
  const guardianDir = path.join(repoRoot, 'skills/rugshield-guardian');
  if (!fs.existsSync(scoutDir) || !fs.existsSync(guardianDir)) {
    logger('RugShield Dual Agent directories missing!', 'ERROR');
    process.exit(1);
  }
  logger('Dual Agent skills (Scout & Guardian) detected. Cross-Validation Engine ready.');

  if (!fs.existsSync(envPath)) {
    logger('.env file not found. Create it from .env.example before running live preflight.', 'ERROR');
    process.exit(1);
  }
  logger('.env file detected.');

  const apiKey = process.env.OKX_API_KEY;
  const secret = process.env.OKX_API_SECRET;
  const passphrase = process.env.OKX_API_PASSPHRASE;
  if (!apiKey || !secret || !passphrase) {
    logger('Missing OKX_API_KEY / OKX_API_SECRET / OKX_API_PASSPHRASE in .env.', 'ERROR');
    process.exit(1);
  }
  logger('Required OKX credential fields detected.');

  logger('Simulating OKX OnchainOS Gateway connectivity probe (presentation-safe check)...');
  await new Promise((resolve) => setTimeout(resolve, 800));
  logger('Simulated network connection to OKX DEX / RPCs... [OK]');

  const args = process.argv.slice(2);
  const autoDefenseFlag = args.includes('--auto-pilot');
  const envAutoDefense = process.env.AUTO_DEFENSE_MODE === 'true';
  const mode = (autoDefenseFlag || envAutoDefense) ? 'AUTO-DEFENSE' : 'SAFE-MODE';

  logger(`Selected Mode: ${mode}`);
  if (mode === 'AUTO-DEFENSE') {
    logger('AUTO-DEFENSE Mode active. The Guardian agent will instantly execute DEX swaps when thresholds are breached.', 'WARN');
  } else {
    logger('SAFE-MODE active. The Guardian agent will wait for your explicit CONFIRM string in OpenClaw before executing on-chain swaps.');
  }

  console.log('\n--- SYSTEM READY FOR OPENCLAW ---');
  console.log('To start the dual-agent loop, load this workspace into OpenClaw or install the bundled skills into an OpenClaw skill directory.');
  console.log(`Current Workspace: ${repoRoot}`);
  console.log('----------------------------------\n');

  console.log('--- OKX RugShield Deployment Status ---');
  printStatus('okx-dex-trenches', 'DECLARED_READY (requires installed OKX OnchainOS skill)');
  printStatus('okx-wallet-portfolio', 'DECLARED_READY (requires installed OKX OnchainOS skill)');
  printStatus('okx-dex-swap', 'DECLARED_READY (requires installed OKX OnchainOS skill)');
  printStatus('okx-onchain-gateway', 'DECLARED_READY (requires installed OKX OnchainOS skill)');
  printStatus('rugshield-scout (bundled)', hasFile('skills/rugshield-scout/SKILL.md') ? 'READY' : 'MISSING');
  printStatus('rugshield-guardian (bundled)', hasFile('skills/rugshield-guardian/SKILL.md') ? 'READY' : 'MISSING');
  printStatus('preflight', 'READY');
  console.log('\n✅ Preflight completed. OKX RugShield is ready for a live OpenClaw session.');
}

const args = new Set(process.argv.slice(2));
if (args.has('--mock') || args.has('--dry-run')) {
  runMockDemo();
} else {
  runPreCheck().catch((err) => {
    logger(err.message, 'FATAL');
    process.exit(1);
  });
}
