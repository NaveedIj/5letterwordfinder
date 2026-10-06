const fs = require('fs');

const gscQueriesPath = 'C:/Users/dell/.gemini/antigravity/brain/f361e4b6-991a-4638-bcaa-1a2ec56524e0/.user_uploaded/media_1787787056578.csv';
const raw = fs.readFileSync(gscQueriesPath, 'utf8');
const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);

const queries = [];
for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 9) {
        const query = parts[0].trim();
        const clicks = parseInt(parts[1]) || 0;
        const impressions = parseInt(parts[3]) || 0;
        const ctr = parts[5].trim();
        const pos = parseFloat(parts[7]) || 0;
        queries.push({ query, clicks, impressions, ctr, pos });
    }
}

console.log(`Parsed total queries: ${queries.length}`);

const categories = {
    'Core 5-letter': [],
    'Wordle Solver / Helper': [],
    'Starting-letter PSEO': [],
    'Ending-letter PSEO': [],
    'Length-specific (3,4,6,7,8)': [],
    'AI / Pattern / Anagram': [],
    'Scrabble Solver': [],
    'Play Wordle Game': [],
    'Brand / Navigational': [],
    'Other / Uncategorized': []
};

queries.forEach(q => {
    const str = q.query.toLowerCase();
    if (/starting with|starts with|start with|beginning with|begins with|starts|start/.test(str)) {
        categories['Starting-letter PSEO'].push(q);
    } else if (/ending with|ends with|end with|ending in|ends in|ending|ends/.test(str)) {
        categories['Ending-letter PSEO'].push(q);
    } else if (/\b(3|4|6|7|8)\b/.test(str)) {
        categories['Length-specific (3,4,6,7,8)'].push(q);
    } else if (/ai|pattern|anagram|crossword|hangman|wildcard/.test(str)) {
        categories['AI / Pattern / Anagram'].push(q);
    } else if (/scrabble/.test(str)) {
        categories['Scrabble Solver'].push(q);
    } else if (/play wordle|wordle game|online wordle/.test(str)) {
        categories['Play Wordle Game'].push(q);
    } else if (/wordle/.test(str)) {
        categories['Wordle Solver / Helper'].push(q);
    } else if (/5 letter|five letter|5-letter|five-letter|5 word|five word|5 letter|5letter/.test(str)) {
        categories['Core 5-letter'].push(q);
    } else if (/5letterwordfinder|word finder tool/.test(str)) {
        categories['Brand / Navigational'].push(q);
    } else {
        categories['Other / Uncategorized'].push(q);
    }
});

console.log('\n=== QUERY INTENT CATEGORY SUMMARY ===\n');
Object.keys(categories).forEach(cat => {
    const list = categories[cat];
    const totalImp = list.reduce((acc, x) => acc + x.impressions, 0);
    const totalClicks = list.reduce((acc, x) => acc + x.clicks, 0);
    const avgPos = list.length > 0 ? (list.reduce((acc, x) => acc + x.pos, 0) / list.length).toFixed(2) : '0.00';
    console.log(`[${cat}] -> Count: ${list.length} | Clicks: ${totalClicks} | Impressions: ${totalImp} | Avg Pos: ${avgPos}`);
});

console.log('\n=== TOP 5 QUERIES PER CATEGORY ===\n');
Object.keys(categories).forEach(cat => {
    console.log(`--- ${cat} ---`);
    categories[cat].slice(0, 5).forEach(q => {
        console.log(`  "${q.query}" | Clicks: ${q.clicks} | Imp: ${q.impressions} | Pos: ${q.pos}`);
    });
});
