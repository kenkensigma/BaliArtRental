/**
 * Bali Art Rental & Production - Automated Validation Suite
 * Checks compliance with prompt.md, design.md, and antislop rules.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let failures = 0;
let passes = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`\x1b[32m✔ PASS:\x1b[0m ${message}`);
    passes++;
  } else {
    console.error(`\x1b[31m✖ FAIL:\x1b[0m ${message}`);
    failures++;
  }
}

console.log('\n--- 1. File Structure Verification ---');
const filesToCheck = [
  'index.html',
  'css/style.css',
  'js/main.js',
  'img/logo.svg',
  'package.json'
];

filesToCheck.forEach(file => {
  const filePath = path.join(rootDir, file);
  assert(fs.existsSync(filePath), `Required file exists: ${file}`);
});

console.log('\n--- 2. Content & Antislop Compliance (R-02 Em Dash Ban) ---');
const textFiles = ['index.html', 'js/main.js', 'css/style.css'];
textFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const hasEmDash = content.includes('—');
  assert(!hasEmDash, `No forbidden em dash (—) in ${file}`);
});

console.log('\n--- 3. Required Website Sections Verification ---');
const htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const requiredSections = [
  { id: 'home', label: 'Hero Section' },
  { id: 'about', label: 'The Studio / About Section' },
  { id: 'services', label: 'Services / What We Do Section' },
  { id: 'work', label: 'Selected Work / Portfolio Section' },
  { id: 'process', label: 'Process / Approach Section' },
  { id: 'cta', label: 'Inquiry CTA Section' },
  { id: 'contact', label: 'Contact Section' }
];

requiredSections.forEach(sec => {
  assert(htmlContent.includes(`id="${sec.id}"`), `Section exists: ${sec.label} (#${sec.id})`);
});

assert(htmlContent.includes('<header') && htmlContent.includes('<footer'), 'Semantic <header> and <footer> landmarks exist');

console.log('\n--- 4. Anchor Link Integrity (R-24 & R-26 No Dead Controls) ---');
const linkMatches = [...htmlContent.matchAll(/href="(#[a-zA-Z0-9_-]+)"/g)];
linkMatches.forEach(match => {
  const anchor = match[1];
  const targetId = anchor.substring(1);
  const targetExists = htmlContent.includes(`id="${targetId}"`);
  assert(targetExists, `Anchor destination ${anchor} exists in page`);
});

const deadLinkCheck = htmlContent.includes('href="#"');
assert(!deadLinkCheck, 'No dead href="#" links present in index.html');

console.log('\n--- 5. Photography Area Text Placeholders (No Stock / AI Event Images) ---');
assert(htmlContent.includes('[ IMAGE PLACEHOLDER : SIGNATURE PRODUCTION ENVIRONMENT ]'), 'Hero key visual has explicit text placeholder');
assert(htmlContent.includes('[ IMAGE PLACEHOLDER : PRODUCTION CRAFTSMANSHIP ]'), 'Studio detail has explicit text placeholder');
assert(htmlContent.includes('[ IMAGE PLACEHOLDER : CORPORATE GALA ]'), 'Project 01 has explicit text placeholder');
assert(htmlContent.includes('[ IMAGE PLACEHOLDER : WEDDING RECEPTION ]'), 'Project 02 has explicit text placeholder');
assert(htmlContent.includes('[ IMAGE PLACEHOLDER : CORPORATE EVENT ]'), 'Project 03 has explicit text placeholder');
assert(htmlContent.includes('[ IMAGE PLACEHOLDER : WEDDING INSTALLATION ]'), 'Project 04 has explicit text placeholder');

const externalImageCheck = new RegExp('<' + 'img[^>]+src=["\'](https?:\\/\\/[^"\']+)["\']', 'i').test(htmlContent);
assert(!externalImageCheck, 'Zero external or stock photo image elements loaded');

console.log('\n--- 6. Design System & CSS Rules Verification ---');
const cssContent = fs.readFileSync(path.join(rootDir, 'css/style.css'), 'utf8');
const colorTokens = [
  '--color-obsidian: #111110',
  '--color-charcoal: #1B1B19',
  '--color-elevated: #242320',
  '--color-warm-ivory: #F1EEE7',
  '--color-muted-ivory: #BDB9B0',
  '--color-champagne: #B6A078',
  '--color-divider: #393833'
];

colorTokens.forEach(token => {
  assert(cssContent.includes(token), `Design token defined: ${token}`);
});

assert(cssContent.includes('@media (max-width:'), 'Responsive media queries implemented');
assert(cssContent.includes('prefers-reduced-motion: reduce'), 'prefers-reduced-motion accessibility rules implemented');
assert(cssContent.includes(':focus-visible'), 'Accessible focus visible indicators defined');

console.log('\n--- 7. Interactive Logic & Accessibility ---');
const jsContent = fs.readFileSync(path.join(rootDir, 'js/main.js'), 'utf8');
assert(jsContent.includes('IntersectionObserver'), 'IntersectionObserver used for scroll reveal / active navigation');
assert(jsContent.includes('aria-expanded'), 'Mobile navigation drawer manages aria-expanded state');
assert(jsContent.includes('Escape'), 'Accessible Escape key closes interactive drawer');
assert(jsContent.includes('event-inquiry-form'), 'Inquiry form submit handler configured');
assert(jsContent.includes('current-year'), 'Dynamic copyright year implemented');

console.log('\n=============================================');
if (failures === 0) {
  console.log(`\x1b[32m✔ ALL ${passes} TESTS PASSED SUCCESSFULLY!\x1b[0m\n`);
  process.exit(0);
} else {
  console.error(`\x1b[31m✖ ${failures} TESTS FAILED (${passes} passed).\x1b[0m\n`);
  process.exit(1);
}
