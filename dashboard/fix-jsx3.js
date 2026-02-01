const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');

console.log('=== JSX Structure Fixer ===\n');
let content = fs.readFileSync(filePath, 'utf8');

// First, let's understand the current structure
const lines = content.split('\n');

console.log('Analyzing div structure...');
console.log('Finding main tag...');
let mainOpenLine = -1;
let mainCloseLine = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<main className="ml-28 p-10 relative">')) {
        mainOpenLine = i + 1;
        console.log(`  ✅ <main> opened at line ${mainOpenLine}`);
    }
    if (lines[i].includes('</main>')) {
        mainCloseLine = i + 1;
        console.log(`  ✅ </main> closed at line ${mainCloseLine}`);
    }
}

console.log(`\nMain span: line ${mainOpenLine} to line ${mainCloseLine}`);

// Now let's examine what's between the right panel InfoPanels and </main>
console.log('\nLooking for Security InfoPanel...');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('title="Security & System Health"')) {
        console.log(`  Found at line ${i + 1}`);
        // Show next 15 lines
        console.log('\n  Next 15 lines after Security InfoPanel:');
        for (let j = i; j < Math.min(lines.length, i + 15); j++) {
            console.log(`  Line ${j+1}: ${lines[j]}`);
        }
        break;
    }
}

// The issue is likely that we need to count the nested div structure in the right panel
// Let's trace through it carefully
console.log('\n=== Tracing right panel div structure ===');

// Find right panel opening
let rightPanelOpen = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('{/* Right Panel: Alerts & Health */}')) {
        rightPanelOpen = i;
        console.log(`Right panel starts at line ${i + 1}`);
        break;
    }
}

if (rightPanelOpen !== -1) {
    let depth = 0;
    console.log('\nDiv depth tracking after right panel starts:');
    for (let i = rightPanelOpen; i < Math.min(rightPanelOpen + 150, lines.length); i++) {
        const line = lines[i];
        const opens = (line.match(/<div/g) || []).length;
        const closes = (line.match(/<\/div>/g) || []).length;

        if (opens > 0 || closes > 0) {
            const oldDepth = depth;
            depth += opens - closes;
            console.log(`Line ${i+1}: opens=${opens}, closes=${closes}, depth: ${oldDepth} → ${depth}`);
            console.log(`  ${line.trim()}`);
        }

        if (line.includes('</main>')) {
            console.log(`\n📍 Reached </main> at depth ${depth}`);
            if (depth > 0) {
                console.log(`❌ ERROR: Main is closing while there are ${depth} unclosed div(s)!`);
                console.log('\n=== FIXING ===');

                // We need to add the missing closing divs before </main>
                const missingDivs = '</div>\n            '.repeat(depth);

                // Find </main> and add missing divs before it
                content = content.replace(
                    /<\/main>/,
                    missingDivs + '</main>'
                );

                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Fixed! Added ${depth} missing closing div(s) before </main>`);
                return;
            }
        }
    }
}

console.log('\n❓ Could not automatically fix. Manual inspection needed.');
