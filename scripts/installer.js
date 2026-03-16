#!/usr/bin/env node
/**
 * @file installer.js
 * @description Layered installer for OKX RugShield using okx/onchainos-skills.
 * Installs external OKX skills and copies bundled RugShield skills into OpenClaw-discoverable locations.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const coreOnly = args.has('--core-only');
const repoRoot = path.join(__dirname, '..');
const workspaceSkillsDir = path.join(os.homedir(), '.openclaw/workspace/skills');
const results = [];

const coreInstallSteps = [
  { cmd: 'npx skills add https://github.com/okx/onchainos-skills --skill okx-dex-token --yes --global', label: 'okx-dex-token' },
  { cmd: 'npx skills add https://github.com/okx/onchainos-skills --skill okx-dex-market --yes --global', label: 'okx-dex-market' },
  { cmd: 'npx skills add https://github.com/okx/onchainos-skills --skill okx-dex-signal --yes --global', label: 'okx-dex-signal' },
  { cmd: 'npx skills add https://github.com/okx/onchainos-skills --skill okx-dex-trenches --yes --global', label: 'okx-dex-trenches' },
  { cmd: 'npx skills add https://github.com/okx/onchainos-skills --skill okx-wallet-portfolio --yes --global', label: 'okx-wallet-portfolio' },
  { cmd: 'npx skills add https://github.com/okx/onchainos-skills --skill okx-dex-swap --yes --global', label: 'okx-dex-swap' },
  { cmd: 'npx skills add https://github.com/okx/onchainos-skills --skill okx-onchain-gateway --yes --global', label: 'okx-onchain-gateway' }
];

const bundledSkills = [
  'rugshield-scout',
  'rugshield-guardian'
];

function pushResult(label, status) {
  results.push({ label, status });
}

function printPlan() {
  console.log('--- OKX RugShield Installer ---\n');
  console.log(`Dry-run: ${dryRun ? 'yes' : 'no'}`);
  console.log(`Core-only: ${coreOnly ? 'yes' : 'no (same install set in v1)'}`);
  console.log(`Repo root: ${repoRoot}`);
  console.log(`OpenClaw workspace skills dir: ${workspaceSkillsDir}`);
  console.log('\nCore install set (external OKX OnchainOS skills):');
  coreInstallSteps.forEach((s) => console.log(`- ${s.label}`));
  console.log('\nBundled RugShield skills to install locally:');
  bundledSkills.forEach((s) => console.log(`- ${s}`));
  console.log('\nPreflight:');
  console.log('- node cli/rugshield.js');
  console.log('');
}

function run(step) {
  console.log(`> Executing: ${step.cmd}`);
  if (dryRun) {
    pushResult(step.label, 'DRY_RUN');
    return;
  }
  try {
    execSync(step.cmd, { stdio: 'inherit', cwd: repoRoot });
    pushResult(step.label, 'OK');
  } catch (e) {
    pushResult(step.label, 'FAIL');
    console.error(`| Failed: ${step.cmd}`);
    printSummary();
    process.exit(1);
  }
}

function ensureBundledSkillExists(skillName) {
  const srcDir = path.join(repoRoot, 'skills', skillName);
  const srcSkill = path.join(srcDir, 'SKILL.md');
  if (!fs.existsSync(srcSkill)) {
    pushResult(`${skillName} (bundled source)`, 'FAIL');
    console.error(`| Missing bundled skill definition: ${srcSkill}`);
    printSummary();
    process.exit(1);
  }
  pushResult(`${skillName} (bundled source)`, dryRun ? 'DRY_RUN' : 'OK');
  return srcDir;
}

function copyDirRecursive(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installBundledSkill(skillName) {
  const srcDir = ensureBundledSkillExists(skillName);
  const destDir = path.join(workspaceSkillsDir, skillName);
  console.log(`> Installing bundled skill to OpenClaw workspace: ${skillName}`);
  if (dryRun) {
    pushResult(`${skillName} (workspace install)`, 'DRY_RUN');
    return;
  }
  copyDirRecursive(srcDir, destDir);
  pushResult(`${skillName} (workspace install)`, 'OK');
}

function printSummary() {
  console.log('\n--- Install Summary ---');
  for (const item of results) {
    console.log(`- ${item.label}: ${item.status}`);
  }
}

printPlan();

console.log('[1/3] Installing core OKX OnchainOS skills for OpenClaw...');
for (const step of coreInstallSteps) run(step);

console.log('\n[2/3] Installing bundled RugShield skills into OpenClaw workspace...');
for (const skillName of bundledSkills) installBundledSkill(skillName);

console.log('\n[3/3] Finalizing environment...');
run({ cmd: 'node cli/rugshield.js', label: 'preflight' });

printSummary();
console.log('\n✅ Deployment Complete! OpenClaw is armed and ready.');
