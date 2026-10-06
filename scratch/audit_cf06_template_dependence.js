const fs = require('fs');
const path = require('path');

const sampleLetters = ['a', 'b', 'm', 's', 'z'];
const startingFiles = sampleLetters.map(l => `5-letter-words-starting-with-${l}.html`);
const endingFiles = sampleLetters.map(l => `5-letter-words-ending-with-${l}.html`);
const allSampleFiles = [...startingFiles, ...endingFiles];

function stripHtmlTags(html) {
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

function tokenOverlapRatio(tokensTarget, tokensBase) {
    const setBase = new Set(tokensBase);
    let overlap = 0;
    tokensTarget.forEach(t => { if (setBase.has(t)) overlap++; });
    return tokensTarget.length === 0 ? 0 : (overlap / tokensTarget.length);
}

const fileDetails = {};
const validStartingFiles = [];
const validEndingFiles = [];

startingFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) return;
    validStartingFiles.push(file);

    const rawHtml = fs.readFileSync(filePath, 'utf8');
    const fullText = stripHtmlTags(rawHtml);
    const fullTokens = getTokens(fullText);

    // Extract wordGrid contents
    const gridMatch = rawHtml.match(/<div id="wordGrid"[^>]*>([\s\S]*?)<\/div>/i);
    const gridHtml = gridMatch ? gridMatch[1] : '';
    const gridText = stripHtmlTags(gridHtml);
    const gridTokens = getTokens(gridText);
    const wordCount = (gridHtml.match(/<div class="word-item">/g) || []).length;

    // Extract text outside wordGrid
    const textWithoutGrid = stripHtmlTags(rawHtml.replace(/<div id="wordGrid"[\s\S]*?<\/div>/gi, ''));
    const nonGridTokens = getTokens(textWithoutGrid);

    fileDetails[file] = {
        file,
        rawLength: rawHtml.length,
        fullTextLength: fullText.length,
        wordCount,
        gridTokensCount: gridTokens.length,
        nonGridTokensCount: nonGridTokens.length,
        totalTokensCount: fullTokens.length,
        fullTokens,
        nonGridTokens,
        gridTokens
    };
});

endingFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) return;
    validEndingFiles.push(file);

    const rawHtml = fs.readFileSync(filePath, 'utf8');
    const fullText = stripHtmlTags(rawHtml);
    const fullTokens = getTokens(fullText);

    const gridMatch = rawHtml.match(/<div id="wordGrid"[^>]*>([\s\S]*?)<\/div>/i);
    const gridHtml = gridMatch ? gridMatch[1] : '';
    const gridText = stripHtmlTags(gridHtml);
    const gridTokens = getTokens(gridText);
    const wordCount = (gridHtml.match(/<div class="word-item">/g) || []).length;

    const textWithoutGrid = stripHtmlTags(rawHtml.replace(/<div id="wordGrid"[\s\S]*?<\/div>/gi, ''));
    const nonGridTokens = getTokens(textWithoutGrid);

    fileDetails[file] = {
        file,
        rawLength: rawHtml.length,
        fullTextLength: fullText.length,
        wordCount,
        gridTokensCount: gridTokens.length,
        nonGridTokensCount: nonGridTokens.length,
        totalTokensCount: fullTokens.length,
        fullTokens,
        nonGridTokens,
        gridTokens
    };
});

console.log('=== CF-06 Quantitative Evidence Analysis ===\n');

// 1. Cross-comparison within Starting-Letter Pages
console.log('--- Starting-Letter Pages Similarity (Non-Grid Text Only) ---');
for (let i = 0; i < validStartingFiles.length; i++) {
    for (let j = i + 1; j < validStartingFiles.length; j++) {
        const fileA = validStartingFiles[i];
        const fileB = validStartingFiles[j];
        const simFull = jaccardSimilarity(fileDetails[fileA].fullTokens, fileDetails[fileB].fullTokens);
        const simNonGrid = jaccardSimilarity(fileDetails[fileA].nonGridTokens, fileDetails[fileB].nonGridTokens);
        console.log(`${fileA} vs ${fileB} -> Full Jaccard: ${(simFull * 100).toFixed(2)}% | Non-Grid Jaccard: ${(simNonGrid * 100).toFixed(2)}%`);
    }
}

console.log('\n--- Ending-Letter Pages Similarity (Non-Grid Text Only) ---');
for (let i = 0; i < validEndingFiles.length; i++) {
    for (let j = i + 1; j < validEndingFiles.length; j++) {
        const fileA = validEndingFiles[i];
        const fileB = validEndingFiles[j];
        const simFull = jaccardSimilarity(fileDetails[fileA].fullTokens, fileDetails[fileB].fullTokens);
        const simNonGrid = jaccardSimilarity(fileDetails[fileA].nonGridTokens, fileDetails[fileB].nonGridTokens);
        console.log(`${fileA} vs ${fileB} -> Full Jaccard: ${(simFull * 100).toFixed(2)}% | Non-Grid Jaccard: ${(simNonGrid * 100).toFixed(2)}%`);
    }
}

console.log('\n--- Starting vs Ending Pages Similarity (e.g. Starting-A vs Ending-A) ---');
sampleLetters.forEach(l => {
    const startF = `5-letter-words-starting-with-${l}.html`;
    const endF = `5-letter-words-ending-with-${l}.html`;
    if (fileDetails[startF] && fileDetails[endF]) {
        const simFull = jaccardSimilarity(fileDetails[startF].fullTokens, fileDetails[endF].fullTokens);
        const simNonGrid = jaccardSimilarity(fileDetails[startF].nonGridTokens, fileDetails[endF].nonGridTokens);
        console.log(`${startF} vs ${endF} -> Full Text Jaccard: ${(simFull * 100).toFixed(2)}% | Non-Grid Jaccard: ${(simNonGrid * 100).toFixed(2)}%`);
    }
});

console.log('\n--- Page Summary Table Data ---');
const allValidFiles = [...validStartingFiles, ...validEndingFiles];
allValidFiles.forEach(f => {
    const d = fileDetails[f];
    const dataSharePct = d.totalTokensCount > 0 ? ((d.gridTokensCount / d.totalTokensCount) * 100).toFixed(1) : '0.0';
    console.log(`${f} | Total Tokens: ${d.totalTokensCount} | Data Grid Tokens: ${d.gridTokensCount} (${dataSharePct}%) | Word Count: ${d.wordCount}`);
});
