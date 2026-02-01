const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');

console.log('Reading page.tsx...');
let content = fs.readFileSync(filePath, 'utf8');

// Find and fix the JSX structure issues
console.log('Analyzing JSX structure...');

// Split into lines to help with debugging
const lines = content.split('\n');

// Look for the section around line 780-781 where the issue is
console.log('\n=== Lines 775-785 ===');
for (let i = 774; i < Math.min(785, lines.length); i++) {
    console.log(`Line ${i+1}: ${lines[i]}`);
}

// Check for the missing closing div after the InfoPanel
// The InfoPanel at line 770-778 is missing a closing div
const infoPanelPattern = /(\s*\/>)\s*(<\/div>)?\s*(<\/div>)?/g;
let match;
let infoPanelLines = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('InfoPanel') && lines[i].includes('title="Security & System Health"')) {
        console.log(`\n=== Found Security InfoPanel at line ${i+1} ===`);
        // Show context
        for (let j = Math.max(0, i-2); j < Math.min(lines.length, i+15); j++) {
            console.log(`Line ${j+1}: ${lines[j]}`);
        }
        break;
    }
}

// The issue is that the right panel div (starting line 646) doesn't close properly
// We need to add the missing closing div before </main>
console.log('\n=== Fixing JSX structure ===');

// Find the line before </main> and add missing </div>
const mainCloseIndex = content.indexOf('</main>');
if (mainCloseIndex !== -1) {
    const beforeMain = content.substring(0, mainCloseIndex);
    const afterMain = content.substring(mainCloseIndex);

    // Check if we need to add closing divs
    // Count opening vs closing divs in the right panel section
    // Right panel starts around line 646 with: <div className="col-span-12 lg:col-span-4
    // It needs to close at least 2 divs before </main>

    // Look for the pattern where we're missing a closing div
    // The right panel has nested divs that aren't all closed

    // Find the last InfoPanel in the right panel and ensure it has proper closing
    const securityPanelEnd = content.indexOf('value="Protects sensitive user data');
    if (securityPanelEnd !== -1) {
        // Find where this InfoPanel ends
        const infoPanelEndRegex = /value="Protects sensitive user data[^"]*"[^>]*\/>/g;
        const matches = [...content.matchAll(infoPanelEndRegex)];
        const lastMatch = matches[matches.length - 1];

        if (lastMatch && lastMatch.index !== undefined) {
            const endOfInfoPanel = lastMatch.index + lastMatch[0].length;
            const afterInfoPanel = content.substring(endOfInfoPanel, endOfInfoPanel + 500);

            console.log('\n=== Content after Security InfoPanel ===');
            console.log(afterInfoPanel);

            // Check if there's a missing </div>
            if (!afterInfoPanel.includes('</div>')) {
                console.log('\n*** FOUND: Missing </div> after Security InfoPanel ***');
                console.log('Will add </div> before </main>');

                // Add the missing closing div
                const fixedContent = content.replace(
                    /(<\/footer>)/,
                    '</main>\n\n            $1'
                );
                fs.writeFileSync(filePath, fixedContent, 'utf8');
                console.log('✅ Fixed! Added missing </div> before </main>');
                return;
            }
        }
    }
}

// If the simple fix didn't work, let's try to count divs more carefully
console.log('\n=== Attempting comprehensive fix ===');

// Find the right panel section (starts after the charts)
const rightPanelStart = content.indexOf('{/* Right Panel: Alerts & Health */}');
const rightPanelEnd = content.indexOf('</main>');

if (rightPanelStart !== -1 && rightPanelEnd !== -1) {
    const rightPanelContent = content.substring(rightPanelStart, rightPanelEnd);

    // Count divs
    const openDivs = (rightPanelContent.match(/<div[^>]*>/g) || []).length;
    const closeDivs = (rightPanelContent.match(/<\/div>/g) || []).length;

    console.log(`Right panel: ${openDivs} opening divs, ${closeDivs} closing divs`);
    console.log(`Missing ${openDivs - closeDivs} closing div(s)`);

    if (openDivs > closeDivs) {
        const missingCloses = openDivs - closeDivs;
        const missingDivs = '</div>\n            '.repeat(missingCloses);

        // Insert the missing closing divs before </main>
        const fixedContent = content.replace(
            /(<\/main>)/,
            missingDivs + '$1'
        );

        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`✅ Fixed! Added ${missingCloses} missing closing div(s) before </main>`);
    } else {
        console.log('❓ Div counts look balanced. The issue might be elsewhere.');
    }
} else {
    console.log('❓ Could not find right panel section');
}
