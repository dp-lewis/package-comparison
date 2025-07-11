#!/usr/bin/env node
// compare-packages.js
// Utility to compare dependencies and devDependencies between package.json files

const fs = require('fs');
const path = require('path');

function readPackageJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    process.exit(1);
  }
}

function compareDeps(base, target) {
  const result = { added: {}, removed: {}, changed: {} };
  for (const dep in base) {
    if (!(dep in target)) {
      result.removed[dep] = base[dep];
    } else if (base[dep] !== target[dep]) {
      result.changed[dep] = { from: base[dep], to: target[dep] };
    }
  }
  for (const dep in target) {
    if (!(dep in base)) {
      result.added[dep] = target[dep];
    }
  }
  return result;
}

function printDiff(diff, label) {
  const green = s => `\x1b[32m${s}\x1b[0m`;
  const red = s => `\x1b[31m${s}\x1b[0m`;
  const yellow = s => `\x1b[33m${s}\x1b[0m`;
  console.log(`\n=== ${label} ===`);
  for (const dep in diff.added) {
    console.log(green(`+ ${dep}@${diff.added[dep]}`));
  }
  for (const dep in diff.removed) {
    console.log(red(`- ${dep}@${diff.removed[dep]}`));
  }
  for (const dep in diff.changed) {
    const { from, to } = diff.changed[dep];
    console.log(yellow(`~ ${dep}: ${from} → ${to}`));
  }
}

function main() {
  const [,, basePath, targetPath, format = 'terminal'] = process.argv;
  if (!basePath || !targetPath) {
    console.error('Usage: node compare-packages.js <base> <target> [format]');
    process.exit(1);
  }
  const basePkg = readPackageJson(basePath);
  const targetPkg = readPackageJson(targetPath);

  const depDiff = compareDeps(basePkg.dependencies || {}, targetPkg.dependencies || {});
  const devDepDiff = compareDeps(basePkg.devDependencies || {}, targetPkg.devDependencies || {});

  if (format === 'terminal') {
    printDiff(depDiff, 'dependencies');
    printDiff(devDepDiff, 'devDependencies');
  } else if (format === 'json') {
    console.log(JSON.stringify({ dependencies: depDiff, devDependencies: devDepDiff }, null, 2));
  } else if (format === 'html') {
    // Placeholder for HTML output
    console.log('HTML output not implemented yet.');
  } else {
    console.error('Unknown format:', format);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} else {
  module.exports = { compareDeps };
}
