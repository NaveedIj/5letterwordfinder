const fs = require('fs');
const path = require('path');

const samplePairs = ['a', 'b', 'm', 's', 'z'];

function stripHtml(html) {
    return html
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getTokens(text) {
    return text.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 1);
}

function jaccardSimilarity(tokensA, tokensB) {
    const setA = new Set(tokensA);
    const setB = new Set(tokensB);
    let intersection = 0;
    setA.forEach(t => { if (setB.has(t)) intersection++; });
    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : (intersection / union);
}

console.log('=== CF-07 STARTING vs ENDING DIFFERENTIATION FORENSIC ANALYSIS ===\n');

samplePairs.forEach(letter => {
    const startFile = `5-letter-words-starting-with-${letter}.html`;
    const endFile = `5-letter-words-ending-with-${letter}.html`;

    const startPath = path.join(__dirname, '..', startFile);
    const endPath = path.join(__dirname, '..', endFile);

    if (!fs.existsSync(startPath) || !fs.existsSync(endPath)) return;

    const startRaw = fs.readFileSync(startPath, 'utf8');
    const endRaw = fs.readFileSync(endPath, 'utf8');

    // Title / H1
    const startH1Match = startRaw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const endH1Match = endRaw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const startH1 = startH1Match ? stripHtml(startH1Match[1]) : '';
    const endH1 = endH1Match ? stripHtml(endH1Match[1]) : '';

    // Meta Description
    const startMetaMatch = startRaw.match(/<meta name="description" content="([^"]*)">/i);
    const endMetaMatch = endRaw.match(/<meta name="description" content="([^"]*)">/i);
    const startMeta = startMetaMatch ? startMetaMatch[1] : '';
    const endMeta = endMetaMatch ? endMetaMatch[1] : '';

    const startWordsCount = (startRaw.match(/class="word-item"/g) || []).length;
    const endWordsCount = (endRaw.match(/class="word-item"/g) || []).length;
    const startWords = (startRaw.match(/<div class="word-item">([^<]+)<\/div>/g) || []).map(w => w.replace(/<[^>]+>/g, '').trim());
    const endWords = (endRaw.match(/<div class="word-item">([^<]+)<\/div>/g) || []).map(w => w.replace(/<[^>]+>/g, '').trim());

    const wordSetA = new Set(startWords);
    let wordOverlap = 0;
    endWords.forEach(w => { if (wordSetA.has(w)) wordOverlap++; });

    // Prose Comparison (Non-Grid)
    const startTextNonGrid = stripHtml(startRaw.replace(/<div id="wordGrid"[\s\S]*?<\/div>/gi, ''));
    const endTextNonGrid = stripHtml(endRaw.replace(/<div id="wordGrid"[\s\S]*?<\/div>/gi, ''));

    const nonGridJaccard = jaccardSimilarity(getTokens(startTextNonGrid), getTokens(endTextNonGrid));
    const fullJaccard = jaccardSimilarity(getTokens(stripHtml(startRaw)), getTokens(stripHtml(endRaw)));

    console.log(`Letter [${letter.toUpperCase()}]`);
    console.log(`  Starting H1:    "${startH1}"`);
    console.log(`  Ending H1:      "${endH1}"`);
    console.log(`  Starting Meta:  "${startMeta.substring(0, 75)}..."`);
    console.log(`  Ending Meta:    "${endMeta.substring(0, 75)}..."`);
    console.log(`  Grid Count:     Starting: ${startWordsCount} | Ending: ${endWordsCount}`);
    console.log(`  Shared Words:   ${wordOverlap} words overlapping in pre-rendered grids`);
    console.log(`  Prose Jaccard:  Full Text: ${(fullJaccard * 100).toFixed(2)}% | Non-Grid Prose: ${(nonGridJaccard * 100).toFixed(2)}%`);
    console.log('--------------------------------------------------\n');
});
