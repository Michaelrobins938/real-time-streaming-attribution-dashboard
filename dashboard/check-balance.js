const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');

let braceDepth = 0;
let parenDepth = 0;
let divDepth = 0;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
    if (char === '{') braceDepth++;
    if (char === '}') braceDepth--;
    if (char === '(') parenDepth++;
    if (char === ')') parenDepth--;
    
    if (braceDepth < 0) {
        const line = content.substring(0, i).split('\n').length;
        console.log(`Error: Negative brace depth at line ${line}`);
        break;
    }
    
    if (parenDepth < 0) {
        const line = content.substring(0, i).split('\n').length;
        console.log(`Error: Negative paren depth at line ${line}`);
        break;
    }
}

console.log(`Final brace depth: ${braceDepth}`);
console.log(`Final paren depth: ${parenDepth}`);
