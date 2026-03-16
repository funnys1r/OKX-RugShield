#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const coreOnly = args.includes('--core-only');
const repoRoot = path.resolve(__dirname, '..');
const workspaceSkillsDir = process.env.OPENCLAW_SKILLS_DIR || path.join(os.homedir(), '.openclaw', 'workspace', 'skills');
const skillsToInstall = ['rugshield-scout', 'rugshield-guardian', 'rugshield-watch'];
const officialRepo = 'https://github.com/okx/onchainos-skills';
const officialInstall = 'npx skills add okx/onchainos-skills';

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

function exists(p) {
  return fs.existsSync(p);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function detectOkxLikeSkills() {
  if (!exists(workspaceSkillsDir)) return [];
  const candidates = [];
  for (const name of fs.readdirSync(workspaceSkillsDir)) {
    const skillDir = path.join(workspaceSkillsDir, name);
    const skillFile = path.join(skillDir, 'SKILL.md');
    if (exists(skillFile)) {
      const body = fs.readFileSync(skillFile, 'utf8').toLowerCase();
      if (body.includes('okx') || body.includes('onchainos')) candidates.push(name);
    }
  }
  return candidates;
}

log('== RugShield Installer ==');
log(`Repo root: ${repoRoot}`);
log(`Target skills dir: ${workspaceSkillsDir}`);
log(`Mode: ${dryRun ? 'dry-run' : 'apply'}`);

const detected = detectOkxLikeSkills();
if (detected.length > 0) {
  log(`[OK] Detected upstream OKX / OnchainOS-related skills: ${detected.join(', ')}`);
} else {
  log('[WARN] No upstream OKX / OnchainOS-related skill detected in the OpenClaw skills dir.');
  log(`[WARN] Install official upstream skills first for fuller live mode:`);
  log(`       ${officialInstall}`);
  log(`       ${officialRepo}`);
  log('[WARN] Demo mode can still work without them.');
}

if (!coreOnly) {
  log('[INFO] No extra installer stages defined beyond local skill installation.');
}

for (const skill of skillsToInstall) {
  const src = path.join(repoRoot, 'skills', skill);
  const dest = path.join(workspaceSkillsDir, skill);
  if (!exists(src)) {
    log(`[FAIL] Missing local skill source: ${src}`);
    process.exitCode = 1;
    continue;
  }
  if (dryRun) {
    log(`[DRY] Would install ${skill} -> ${dest}`);
    continue;
  }
  fs.rmSync(dest, { recursive: true, force: true });
  copyDir(src, dest);
  log(`[OK] Installed ${skill} -> ${dest}`);
}

log('');
log('Next steps:');
log(`1. If not already installed, run: ${officialInstall}`);
log('2. Run npm run preflight');
log('3. Use demo mode immediately if upstream dependencies are not installed');
log('4. Configure one of the supported secret names for live mode: OKX_SECRET_KEY or OKX_API_SECRET');
