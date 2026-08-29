const fs = require('fs');
const path = require('path');
const assert = require('assert');

function countHtmlFiles(dirPath) {
  let count = 0;
  if (!fs.existsSync(dirPath)) return 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      count += countHtmlFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      count++;
    }
  }
  return count;
}

function runTests() {
  console.log('Running site build verification tests...');
  const siteDir = path.join(__dirname, '..', '_site');
  const indexHtmlPath = path.join(siteDir, 'index.html');

  assert(fs.existsSync(siteDir), '_site/ directory does not exist');
  assert(fs.existsSync(indexHtmlPath), '_site/index.html does not exist');

  const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

  assert(indexContent.includes('--color-void: #000000;'), 'Missing CSS token --color-void: #000000;');
  assert(indexContent.includes('--color-electric-iris: #8052ff;'), 'Missing CSS token --color-electric-iris: #8052ff;');
  assert(indexContent.includes('--color-saffron-spark: #ffb829;'), 'Missing CSS token --color-saffron-spark: #ffb829;');
  assert(indexContent.includes('Inter'), "Missing Google Font 'Inter'");
  assert(indexContent.includes('constellation-canvas'), "Missing element with id/class 'constellation-canvas'");
  assert(indexContent.includes('search-input'), "Missing 'search-input'");
  assert(indexContent.includes('filter-btn'), "Missing 'filter-btn'");
  assert(indexContent.includes('empty-state'), "Missing 'empty-state'");

  const htmlCount = countHtmlFiles(siteDir);
  assert(htmlCount >= 40, `Expected at least 40 .html files, found ${htmlCount}`);

  console.log('All site build verification tests passed!');
}

try {
  runTests();
} catch (err) {
  console.error('Test verification failed:', err.message);
  process.exit(1);
}
