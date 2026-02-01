const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');

console.log('Reading page.tsx...');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Looking for return statement with extra whitespace...');

// Find the return statement
const returnMatch = content.match(/return\s*\(\s*\n\s*<div/);
if (returnMatch) {
    console.log('Found return statement structure that might have issues');
    // The issue is likely the blank line or formatting around the return
}

// Fix the return statement - remove extra whitespace after (
content = content.replace(
    /return\s*\(\s*\n\s*<div/,
    'return (\n        <div'
);

console.log('Fixed return statement formatting');

// Also check for any double closing divs
// Look for </div> followed immediately by another </div> with same indentation
content = content.replace(
    /(<\/div>\s*<\/div>\s*<\/div>\s*<\/main>)/,
    '</div>\n            </main>'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ JSX formatting fixed!');
