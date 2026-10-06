const fs = require('fs');

const raw = fs.readFileSync('words.js', 'utf8');
// Strip 'const wordList = '
const jsonText = raw.replace(/^const wordList = /, '').trim();
const fullList = JSON.parse(jsonText);

const WORD_LENGTH = 5;
const filtered = fullList.filter(w => w.length === WORD_LENGTH);
const uniqueSet = new Set(filtered);

console.log('1. fullList.length =', fullList.length);
console.log('2. fullList.filter(w => w.length === 5).length =', filtered.length);
console.log('3. WORD_LENGTH =', WORD_LENGTH);
console.log('4. activeList.length (in Full mode) =', filtered.length);
console.log('5. Unique filtered 5-letter count =', uniqueSet.size);
console.log('6. Duplicate count =', filtered.length - uniqueSet.size);
