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

function htmlEscape(str) {
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function diffToHtmlList(diff) {
  let html = '<ul>';
  for (const dep in diff.added) {
    html += `<li class="added">+ ${htmlEscape(dep)}@${htmlEscape(diff.added[dep])}</li>`;
  }
  for (const dep in diff.removed) {
    html += `<li class="removed">- ${htmlEscape(dep)}@${htmlEscape(diff.removed[dep])}</li>`;
  }
  for (const dep in diff.changed) {
    html += `<li class="changed">~ ${htmlEscape(dep)}: ${htmlEscape(diff.changed[dep].from)} &rarr; ${htmlEscape(diff.changed[dep].to)}</li>`;
  }
  html += '</ul>';
  return html;
}

function renderHtmlTemplate(template, data) {
  return template
    .replace(/{{title}}/g, data.title)
    .replace(/{{baseName}}/g, data.baseName)
    .replace(/{{baseVersion}}/g, data.baseVersion)
    .replace(/{{targetName}}/g, data.targetName)
    .replace(/{{targetVersion}}/g, data.targetVersion)
    .replace(/{{dependencies}}/g, data.dependencies)
    .replace(/{{devDependencies}}/g, data.devDependencies);
}

function getHtmlTemplate(templatePath) {
  // Always use a template file, defaulting to templates/HTML-TEMPLATE.example.html
  const defaultTemplate = path.join(__dirname, 'templates', 'HTML-TEMPLATE.example.html');
  const resolvedPath = templatePath || defaultTemplate;
  if (fs.existsSync(resolvedPath)) {
    return fs.readFileSync(resolvedPath, 'utf8');
  } else {
    console.error('HTML template file not found:', resolvedPath);
    process.exit(1);
  }
}

function main() {
  // Support: node compare-packages.js <base> <target> [format] [--template path]
  const args = process.argv.slice(2);
  const basePath = args[0];
  const targetPath = args[1];
  const format = args[2] || 'terminal';
  const templateFlagIndex = args.indexOf('--template');
  const templatePath = templateFlagIndex !== -1 ? args[templateFlagIndex + 1] : undefined;

  if (!basePath || !targetPath) {
    console.error('Usage: node compare-packages.js <base> <target> [format] [--template path]');
    process.exit(1);
  }
  const basePkg = readPackageJson(basePath);
  const targetPkg = readPackageJson(targetPath);

  const depDiff = compareDeps(basePkg.dependencies || {}, targetPkg.dependencies || {});
  const devDepDiff = compareDeps(basePkg.devDependencies || {}, targetPkg.devDependencies || {});

  // Helper to sanitise file names
  function safeName(name) {
    return name.replace(/[^a-zA-Z0-9_-]+/g, '_');
  }
  const baseShort = safeName(basePkg.name || path.basename(basePath, '.json'));
  const targetShort = safeName(targetPkg.name || path.basename(targetPath, '.json'));
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0,19);

  if (format === 'terminal') {
    printDiff(depDiff, 'dependencies');
    printDiff(devDepDiff, 'devDependencies');
  } else if (format === 'json') {
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const jsonPath = path.join(
      outputDir,
      `report_${baseShort}_vs_${targetShort}_${timestamp}.json`
    );
    fs.writeFileSync(jsonPath, JSON.stringify({
      compared: { base: basePath, target: targetPath },
      generated: new Date().toISOString(),
      dependencies: depDiff,
      devDependencies: devDepDiff
    }, null, 2));
    console.log(`JSON report written to ${jsonPath}`);
  } else if (format === 'html') {
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const htmlPath = path.join(
      outputDir,
      `report_${baseShort}_vs_${targetShort}_${timestamp}.html`
    );
    const template = getHtmlTemplate(templatePath);
    const html = renderHtmlTemplate(template, {
      title: 'package.json Comparison Report',
      baseName: basePkg.name || 'Base',
      baseVersion: basePkg.version || '',
      targetName: targetPkg.name || 'Target',
      targetVersion: targetPkg.version || '',
      dependencies: diffToHtmlList(depDiff),
      devDependencies: diffToHtmlList(devDepDiff)
    });
    fs.writeFileSync(htmlPath, html);
    console.log(`HTML report written to ${htmlPath}`);
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

// Additional exports for testing
module.exports = {
  compareDeps,
  diffToHtmlList,
  renderHtmlTemplate,
  getHtmlTemplate,
  htmlEscape
};
