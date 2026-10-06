const fs = require('fs');
const path = require('path');

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
let cappedPages = 0;
let uncappedPages = 0;
let cappedNoticesMatched = 0;
let uncappedNoticesMatched = 0;
let errors = [];

function getDictionaryCount(type, letter) {
    const wordsAlphaPath = path.join(__dirname, '..', 'words_alpha.txt');
    const words = fs.readFileSync(wordsAlphaPath, 'utf8').split(/\r?\n/).map(w => w.trim().toLowerCase());
    const matches = words.filter(w => w.length === 5 && (type === 'starting' ? w.startsWith(letter) : w.endsWith(letter)));
    return matches.length;
}

function processPage(file, content, expectedCount) {
    const hasCappedNotice = content.includes('Showing 150 words from our dictionary list. Use the Word Finder tool above to explore more matching words.');
    const hasUncappedNotice = /Showing all \d+ matching words from our dictionary list\./.test(content);
    const gridOccurrences = (content.match(/id="wordGrid"/g) || []).length;

    if (gridOccurrences > 1) {
        errors.push(`Multiple #wordGrid found in ${file}: ${gridOccurrences}`);
    }

    const displayCount = Math.min(expectedCount, 150);

    if (displayCount === 150) {
        cappedPages++;
        if (hasCappedNotice && !hasUncappedNotice) {
            cappedNoticesMatched++;
        } else {
            errors.push(`Notice mismatch in capped file ${file}`);
        }
    } else {
        uncappedPages++;
        if (hasUncappedNotice && !hasCappedNotice) {
            const noticeMatch = content.match(/Showing all (\d+) matching words/);
            if (noticeMatch && parseInt(noticeMatch[1]) === displayCount) {
                uncappedNoticesMatched++;
            } else {
                errors.push(`Uncapped count mismatch in ${file}: notice says ${noticeMatch ? noticeMatch[1] : 'null'}, expected ${displayCount}`);
            }
        } else {
            errors.push(`Notice mismatch in uncapped file ${file}`);
        }
    }
}

letters.forEach(l => {
    ['starting', 'ending'].forEach(type => {
        const file = `5-letter-words-${type}-with-${l}.html`;
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const expectedCount = getDictionaryCount(type, l);
            processPage(file, content, expectedCount);
        } else {
            errors.push(`Missing file ${file}`);
        }
    });
});

console.log(`Total files checked: ${cappedPages + uncappedPages}`);
console.log(`Capped pages (150 words): ${cappedPages} | Capped notices matched: ${cappedNoticesMatched}`);
console.log(`Uncapped pages (<150 words): ${uncappedPages} | Uncapped notices matched: ${uncappedNoticesMatched}`);
console.log(`Total Errors: ${errors.length}`);
if (errors.length > 0) {
    console.log('Errors Detail:', errors);
}
