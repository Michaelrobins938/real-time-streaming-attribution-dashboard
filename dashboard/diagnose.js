const fs = require('fs');

const filePath = './src/app/page.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find all tags and their positions
const openTags = [];
const closeTags = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Find opening tags (not self-closing)
    const openMatches = line.match(/<(?!\/)([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g);
    if (openMatches) {
        for (const match of openMatches) {
            // Skip self-closing tags
            if (!match.includes('/>')) {
                openTags.push({ line: i + 1, tag: match.replace(/<([^\s>]+).*/, '$1'), full: match });
            }
        }
    }
    
    // Find closing tags
    const closeMatches = line.match(/<\/([a-zA-Z][a-zA-Z0-9]*)>/g);
    if (closeMatches) {
        for (const match of closeMatches) {
            closeTags.push({ line: i + 1, tag: match.replace(/<\/([^>]+)>/, '$1'), full: match });
        }
    }
}

// Track unmatched tags
const stack = [];
const errors = [];

for (const open of openTags) {
    stack.push(open);
}

for (const close of closeTags) {
    if (stack.length === 0) {
        errors.push({ line: close.line, message: `Unexpected closing </${close.tag}> with no matching opening` });
    } else {
        const last = stack[stack.length - 1];
        if (last.tag === close.tag) {
            stack.pop();
        } else {
            errors.push({ line: close.line, message: `Expected </${last.tag}> but found </${close.tag}>` });
        }
    }
}

// Remaining items in stack are unclosed
for (const item of stack) {
    errors.push({ line: item.line, message: `Tag <${item.tag}> opened at line ${item.line} has no closing tag` });
}

if (errors.length > 0) {
    console.log('=== ERRORS FOUND ===');
    for (const err of errors) {
        console.log(`Line ${err.line}: ${err.message}`);
    }
    
    // Try to fix
    console.log('\n=== ATTEMPTING TO FIX ===');
    
    let fixedContent = content;
    
    // Fix 1: Add missing closing tag for the root div
    const mainClose = content.indexOf('</main>');
    const footerClose = content.indexOf('</footer>');
    const contentAfterMainClose = content.substring(mainClose, footerClose);
    
    // Check if footer is inside the root div
    if (!contentAfterMainClose.includes('<footer')) {
        // Footer is outside - need to fix
        console.log('Footer appears to be outside main content div');
        
        // Remove the problematic structure and rebuild
        fixedContent = content.replace(
            /<\/footer>\s*<\/div>/,
            '</footer>'
        );
        
        // Add the closing div after the footer closing
        const lastReturn = fixedContent.lastIndexOf('return (\n');
        const closingParen = fixedContent.indexOf(');', lastReturn);
        
        if (closingParen > 0) {
            const before = fixedContent.substring(0, closingParen);
            const after = fixedContent.substring(closingParen);
            
            // Add closing </div> just before );
            fixedContent = before + '</div>\n        ' + after;
        }
    }
    
    fs.writeFileSync(filePath, fixedContent);
    console.log('✅ File written with fixes');
} else {
    console.log('✅ All tags are properly matched!');
}
