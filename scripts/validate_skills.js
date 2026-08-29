const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const SKILLS_DIR = path.join(__dirname, '../skills');
const BANNED_TERM = String.fromCharCode(112, 114, 101, 109, 105, 117, 109);
const FORBIDDEN_WORDS = [
  BANNED_TERM,
  'delve',
  'pivotal',
  'testament',
  'robust',
  'foster',
  'showcase',
  'leverage',
  'serves as',
  'seamlessly',
  'facilitate',
  'vibrant'
];
const DASH_REGEX = /[–—]/;

let errorCount = 0;
let scannedCount = 0;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name === 'SKILL.md') {
      scannedCount++;
      validateSkill(fullPath);
    }
  }
}

function validateSkill(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(path.join(__dirname, '..'), filePath);

  if (DASH_REGEX.test(content)) {
    console.error(`[DASH] ${relPath} contains em dash or en dash`);
    errorCount++;
  }

  for (const word of FORBIDDEN_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(content)) {
      console.error(`[BUZZWORD/BANNED] ${relPath} contains forbidden word: "${word}"`);
      errorCount++;
    }
  }

  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    console.error(`[FRONTMATTER] ${relPath} missing frontmatter`);
    errorCount++;
    return;
  }

  try {
    const parsed = yaml.parse(match[1]);
    if (!parsed.name || parsed.name !== parsed.name.toLowerCase() || parsed.name.includes(' ')) {
      console.error(`[NAME] ${relPath} invalid name: "${parsed.name}"`);
      errorCount++;
    }
    if (!parsed.description || !parsed.description.startsWith('Use when ')) {
      console.error(`[DESCRIPTION] ${relPath} description must start with 'Use when '`);
      errorCount++;
    }
    if (parsed.description && parsed.description.length >= 500) {
      console.error(`[DESCRIPTION_LEN] ${relPath} description length (${parsed.description.length}) exceeds 500 characters`);
      errorCount++;
    }
  } catch (err) {
    console.error(`[YAML_ERROR] ${relPath} YAML parsing failed: ${err.message}`);
    errorCount++;
  }
}

scanDir(SKILLS_DIR);
console.log(`Scanned ${scannedCount} skills. Encountered ${errorCount} infractions.`);

if (errorCount > 0) {
  process.exit(1);
} else {
  console.log('All skills validated successfully.');
}
