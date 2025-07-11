// compare-packages.integration.test.js
// Integration test for the compare-packages.js CLI utility

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const assert = require('assert');

function integrationTest() {
  // 1. Setup
  const basePath = path.join(__dirname, 'base-package.json');
  const targetPath = path.join(__dirname, 'target-package.json');
  const outputDir = path.join(__dirname, '..', 'output');

  // Clean output directory before running
  if (fs.existsSync(outputDir)) {
    for (const file of fs.readdirSync(outputDir)) {
      fs.unlinkSync(path.join(outputDir, file));
    }
  }

  // Write fixture files
  fs.writeFileSync(basePath, JSON.stringify({ name: 'base', dependencies: { a: '1.0.0' } }, null, 2));
  fs.writeFileSync(targetPath, JSON.stringify({ name: 'target', dependencies: { a: '2.0.0', b: '1.0.0' } }, null, 2));

  // 2. Run the script (JSON output)
  const scriptPath = path.join(__dirname, '..', 'compare-packages.js');
  execSync(`node ${scriptPath} ${basePath} ${targetPath} json`);

  // 3. Assert output
  const files = fs.readdirSync(outputDir);
  const jsonFile = files.find(f => f.endsWith('.json') && f.includes('base') && f.includes('target'));
  assert(jsonFile, 'JSON report file not found');
  const jsonContent = JSON.parse(fs.readFileSync(path.join(outputDir, jsonFile), 'utf8'));
  console.log('DEBUG: jsonContent', JSON.stringify(jsonContent, null, 2));
  assert(jsonContent.dependencies.added.b === '1.0.0');
  assert(jsonContent.dependencies.changed.a.from === '1.0.0');
  assert(jsonContent.dependencies.changed.a.to === '2.0.0');

  // 4. Cleanup
  fs.unlinkSync(basePath);
  fs.unlinkSync(targetPath);
  fs.unlinkSync(path.join(outputDir, jsonFile));
  console.log('Integration test passed!');
}

integrationTest();
