#!/usr/bin/env node

/**
 * Frontend Setup Verification Script
 * Tests if all dependencies are installed and frontend is ready to run
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';

function log(color, symbol, text) {
  console.log(`${color}${symbol}${RESET} ${text}`);
}

function checkNodeVersion() {
  log(CYAN, '[1/4]', 'Node.js Version Check');
  
  try {
    const version = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(version.split('.')[0].substring(1));
    
    log(RESET, '      ', `Current: ${version}`);
    
    if (majorVersion < 18) {
      log(RED, '      ', '❌ ERROR: Node.js 18+ required');
      return false;
    }
    
    log(GREEN, '      ', '✅ Node.js version OK');
    return true;
  } catch (e) {
    log(RED, '      ', '❌ Node.js not found or error checking version');
    return false;
  }
}

function checkNpmDependencies() {
  log(CYAN, '[2/4]', 'npm Dependencies Check');
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log(RED, '      ', '❌ package.json not found');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    log(YELLOW, '      ', '⚠️  node_modules not found');
    log(RESET, '      ', 'Run: npm install');
    return false;
  }
  
  // Check key dependencies
  const criticalDeps = ['next', 'react', 'typescript'];
  let allPresent = true;
  
  for (const dep of criticalDeps) {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
      log(GREEN, '      ', `✅ ${dep}`);
    } else {
      log(RED, '      ', `❌ ${dep}`);
      allPresent = false;
    }
  }
  
  if (!allPresent) {
    log(RED, '      ', '❌ Some dependencies missing');
    log(RESET, '      ', 'Run: npm install');
    return false;
  }
  
  log(GREEN, '      ', '✅ All critical dependencies present');
  return true;
}

function checkEnvironment() {
  log(CYAN, '[3/4]', 'Environment Configuration Check');
  
  const envFile = path.join(__dirname, '.env.local');
  
  if (!fs.existsSync(envFile)) {
    log(YELLOW, '      ', '⚠️  .env.local file not found');
    log(RESET, '      ', 'Create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:8000');
    
    // This is not critical for startup, so return true
    return true;
  }
  
  const envContent = fs.readFileSync(envFile, 'utf8');
  
  if (envContent.includes('NEXT_PUBLIC_API_URL')) {
    log(GREEN, '      ', '✅ .env.local configured');
    return true;
  } else {
    log(YELLOW, '      ', '⚠️  NEXT_PUBLIC_API_URL not in .env.local');
    log(RESET, '      ', 'Add: NEXT_PUBLIC_API_URL=http://localhost:8000');
    return true; // Not critical
  }
}

function checkBuildTools() {
  log(CYAN, '[4/4]', 'Build Tools Check');
  
  try {
    // Check if next command works
    execSync('npx next --version 2>/dev/null || next --version', { encoding: 'utf8' });
    log(GREEN, '      ', '✅ Next.js build tools available');
    return true;
  } catch (e) {
    log(RED, '      ', '❌ Next.js build tools not accessible');
    log(RESET, '      ', 'Run: npm install');
    return false;
  }
}

function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║        IIROS Frontend Setup Verification                  ║
╚════════════════════════════════════════════════════════════╝
`);
  
  const results = [];
  
  results.push(['Node.js Version', checkNodeVersion()]);
  results.push(['npm Dependencies', checkNpmDependencies()]);
  results.push(['Environment', checkEnvironment()]);
  results.push(['Build Tools', checkBuildTools()]);
  
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                     Verification Summary                  ║
╚════════════════════════════════════════════════════════════╝
`);
  
  for (const [name, result] of results) {
    const status = result ? `${GREEN}✅ PASS${RESET}` : `${RED}❌ FAIL${RESET}`;
    console.log(`${status} - ${name}`);
  }
  
  const allPassed = results.every(([_, result]) => result);
  
  if (allPassed) {
    console.log(`
${GREEN}✅ All checks passed! Frontend is ready to run.${RESET}

Start frontend with:
  npm run dev

Frontend will be available at:
  http://localhost:3000
`);
    process.exit(0);
  } else {
    console.log(`
${RED}❌ Some checks failed. Please fix issues above.${RESET}

Common fixes:
  1. Install dependencies: npm install
  2. Create .env.local with NEXT_PUBLIC_API_URL
  3. Update Node.js to 18+
`);
    process.exit(1);
  }
}

main();
