const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.startsWith('5-letter-words-starting-with-') && f.endsWith('.html'));

const malformedGridPages = [];

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if there are word-items AFTER the closing </div> of wordGrid
    const gridMatch = content.match(/<div id="wordGrid" class="word-grid">([\s\S]*?)<\/div>([\s\S]*?)(?:<details>|<h2>Internal Navigation<\/h2>|<div class="letter-nav">)/i);
    if (gridMatch) {
        const afterGrid = gridMatch[2];
        if (afterGrid.includes('<div class="word-item">')) {
            malformedGridPages.push(file);
        }
    }
});

console.log('Pages with duplicate/orphan word-items outside #wordGrid container:', malformedGridPages);
