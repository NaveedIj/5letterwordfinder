const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.startsWith('5-letter-words-starting-with-') && f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Extract all words from word-item elements
    const wordMatches = content.match(/<div class="word-item">([^<]+)(?:<\/div>)?/gi);
    if (!wordMatches) return;

    const wordsSet = new Set();
    wordMatches.forEach(m => {
        const clean = m.replace(/<[^>]+>/g, '').trim();
        if (clean && clean.length === 5 && /^[A-Z]+$/.test(clean)) {
            wordsSet.add(clean);
        }
    });

    const uniqueWords = Array.from(wordsSet);
    if (uniqueWords.length === 0) return;

    // Construct clean grid HTML
    const gridInner = uniqueWords.map(w => `                        <div class="word-item">${w}</div>`).join('\n');
    const newGridHtml = `<div id="wordGrid" class="word-grid">\n${gridInner}\n                    </div>`;

    // Replace the entire old section between "List of 5 Letter Words" / "List of 5-Letter Words" and the next structural heading/tag
    const gridStartRegex = /(<h2[^>]*>List of 5[\s\S]*?<\/h2>\s*)([\s\S]*?)(<h3>|\n\s*<h2>|<details>|<div style=|<p style=)/i;

    const match = content.match(gridStartRegex);
    if (match) {
        const heading = match[1];
        const rest = match[3];
        const updatedBlock = `${heading}${newGridHtml}\n                    ${rest}`;
        content = content.replace(match[0], updatedBlock);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned word grid for: ${file} (${uniqueWords.length} unique words)`);
    } else {
        console.log(`Grid match failed for: ${file}`);
    }
});
