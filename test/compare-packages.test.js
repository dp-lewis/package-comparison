// compare-packages.test.js
// Unit tests for compare-packages.js

const assert = require('assert');

// Import functions from compare-packages.js
const { compareDeps, diffToHtmlList, renderHtmlTemplate, getHtmlTemplate, htmlEscape } = require('../compare-packages');

function testCompareDeps() {
  // Test 1: No changes
  let base = { a: '1.0.0', b: '2.0.0' };
  let target = { a: '1.0.0', b: '2.0.0' };
  let diff = compareDeps(base, target);
  assert.deepStrictEqual(diff, { added: {}, removed: {}, changed: {} });

  // Test 2: Added dependency
  base = { a: '1.0.0' };
  target = { a: '1.0.0', b: '2.0.0' };
  diff = compareDeps(base, target);
  assert.deepStrictEqual(diff, { added: { b: '2.0.0' }, removed: {}, changed: {} });

  // Test 3: Removed dependency
  base = { a: '1.0.0', b: '2.0.0' };
  target = { a: '1.0.0' };
  diff = compareDeps(base, target);
  assert.deepStrictEqual(diff, { added: {}, removed: { b: '2.0.0' }, changed: {} });

  // Test 4: Changed version
  base = { a: '1.0.0' };
  target = { a: '2.0.0' };
  diff = compareDeps(base, target);
  assert.deepStrictEqual(diff, { added: {}, removed: {}, changed: { a: { from: '1.0.0', to: '2.0.0' } } });

  // Test 5: Mixed changes
  base = { a: '1.0.0', b: '2.0.0', c: '3.0.0' };
  target = { a: '1.0.1', d: '4.0.0' };
  diff = compareDeps(base, target);
  assert.deepStrictEqual(diff, {
    added: { d: '4.0.0' },
    removed: { b: '2.0.0', c: '3.0.0' },
    changed: { a: { from: '1.0.0', to: '1.0.1' } }
  });

  console.log('All compareDeps tests passed!');
}

testCompareDeps();

function testDiffToHtmlList() {
  const diff = {
    added: { a: '1.0.0' },
    removed: { b: '2.0.0' },
    changed: { c: { from: '1.0.0', to: '2.0.0' } }
  };
  const html = diffToHtmlList(diff);
  assert(html.includes('class="added"'));
  assert(html.includes('class="removed"'));
  assert(html.includes('class="changed"'));
  assert(html.includes('+ a@1.0.0'));
  assert(html.includes('- b@2.0.0'));
  assert(html.includes('~ c: 1.0.0'));
  assert(html.includes('&rarr; 2.0.0'));
  console.log('diffToHtmlList test passed!');
}

testDiffToHtmlList();

function testRenderHtmlTemplate() {
  const template = '<h1>{{title}}</h1>{{dependencies}}{{devDependencies}}';
  const html = renderHtmlTemplate(template, {
    title: 'Test',
    dependencies: '<ul><li>dep</li></ul>',
    devDependencies: '<ul><li>dev</li></ul>'
  });
  assert(html.includes('<h1>Test</h1>'));
  assert(html.includes('<ul><li>dep</li></ul>'));
  assert(html.includes('<ul><li>dev</li></ul>'));
  console.log('renderHtmlTemplate test passed!');
}

testRenderHtmlTemplate();

function testHtmlEscape() {
  assert.strictEqual(htmlEscape('<>&"\''), '&lt;&gt;&amp;&quot;&#39;');
  console.log('htmlEscape test passed!');
}

testHtmlEscape();

// Test the safeName function and filename generation logic
function testSafeNameAndFilename() {
  // Inline safeName logic from compare-packages.js
  function safeName(name) {
    return name.replace(/[^a-zA-Z0-9_-]+/g, '_');
  }
  // Test cases
  assert.strictEqual(safeName('base-project'), 'base-project');
  assert.strictEqual(safeName('target project!'), 'target_project_');
  assert.strictEqual(safeName('foo@1.0.0'), 'foo_1_0_0');
  assert.strictEqual(safeName('foo/bar:baz'), 'foo_bar_baz');

  // Simulate filename creation
  const base = 'base-project';
  const target = 'target-project';
  const timestamp = '2025-07-11T12-34-56-000Z';
  const expected = `report_${base}_vs_${target}_${timestamp}.json`;
  assert.strictEqual(
    `report_${safeName(base)}_vs_${safeName(target)}_${timestamp}.json`,
    expected
  );
  console.log('safeName and filename generation tests passed!');
}

testSafeNameAndFilename();
