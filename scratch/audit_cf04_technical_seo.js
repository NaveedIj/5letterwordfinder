const fs = require('fs');
const path = require('path');

const lengths = [3, 4, 6, 7, 8];
const report = {};

lengths.forEach(n => {
    const file = `${n}-letter-word-finder.html`;
    const jsonFile = path.join('data', `${n}.json`);

    const htmlExists = fs.existsSync(file);
    const jsonExists = fs.existsSync(jsonFile);

    let htmlContent = htmlExists ? fs.readFileSync(file, 'utf8') : '';
    let jsonContent = jsonExists ? JSON.parse(fs.readFileSync(jsonFile, 'utf8')) : [];

    // Check word lengths in JSON dataset
    let invalidLengthCount = 0;
    let duplicateCount = 0;
    const wordSet = new Set();

    jsonContent.forEach(w => {
        if (typeof w !== 'string' || w.length !== n) {
            invalidLengthCount++;
        }
        const lower = w.toLowerCase();
        if (wordSet.has(lower)) {
            duplicateCount++;
        } else {
            wordSet.add(lower);
        }
    });

    // Check Title, H1, Canonical, Schema
    const titleMatch = htmlContent.match(/<title>([^<]*)<\/title>/i);
    const h1Match = htmlContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const canonicalMatch = htmlContent.match(/<link rel="canonical" href="([^"]*)">/i);
    const robotsMatch = htmlContent.match(/<meta name="robots" content="([^"]*)">/i);
    const schemaMatches = htmlContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];

    let validSchemas = 0;
    const parsedSchemas = [];
    schemaMatches.forEach(s => {
        try {
            const clean = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
            const parsed = JSON.parse(clean);
            validSchemas++;
            parsedSchemas.push(parsed['@type'] || 'Unknown');
        } catch (e) {
            parsedSchemas.push('INVALID_JSON');
        }
    });

    // Verify dataset consumption in JS
    const scriptSrcMatch = htmlContent.match(/<script src="([^"]*)">/g) || [];
    const jsFiles = scriptSrcMatch.map(s => s.replace(/<script src="/, '').replace(/">/, ''));

    report[file] = {
        htmlExists,
        jsonFile,
        jsonExists,
        datasetWordCount: jsonContent.length,
        invalidLengthCount,
        duplicateCount,
        title: titleMatch ? titleMatch[1] : null,
        h1: h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : null,
        canonical: canonicalMatch ? canonicalMatch[1] : null,
        robots: robotsMatch ? robotsMatch[1] : null,
        schemasFound: schemaMatches.length,
        validSchemas,
        parsedSchemas,
        jsFiles
    };
});

console.log(JSON.stringify(report, null, 2));
