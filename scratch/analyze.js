const fs = require('fs');
const path = require('path');

const files = [
    '3-letter-word-finder.html',
    '5-letter-words-starting-with-e.html',
    '5-letter-words-starting-with-i.html',
    '5-letter-words-starting-with-j.html',
    '5-letter-words-starting-with-k.html',
    '5-letter-words-starting-with-p.html',
    '5-letter-words-starting-with-r.html',
    '5-letter-words-starting-with-v.html',
    '5-letter-words-starting-with-x.html',
    '5-letter-words-starting-with-z.html',
    '7-letter-word-finder.html',
    '5-letter-words-starting-with-a.html', // for comparison
    'index.html' // for comparison
];

const basePath = 'c:\\laragon\\www\\5-letter-word-finder';

const results = {};

files.forEach(file => {
    const filePath = path.join(basePath, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Canonical
    const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)">/);
    const canonical = canonicalMatch ? canonicalMatch[1] : null;

    // Robots
    const robotsMatch = content.match(/<meta name="robots" content="([^"]+)">/);
    const robots = robotsMatch ? robotsMatch[1] : null;

    // Organization Schema Count
    const orgMatches = content.match(/"@type"\s*:\s*"Organization"/g) || [];
    
    // FAQPage Schema Count
    const faqMatches = content.match(/"@type"\s*:\s*"FAQPage"/g) || [];

    // seoManager.js included
    const hasSeoManager = content.includes('seoManager.js');

    // Noindex directives
    const hasNoindex = content.toLowerCase().includes('noindex');

    // Approximate word count (strip html tags and count words)
    // we only want to count text inside <body>
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    let wordCount = 0;
    if (bodyMatch) {
        const bodyText = bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        wordCount = bodyText.split(' ').length;
    }

    results[file] = {
        canonical,
        robots,
        orgSchemaCount: orgMatches.length,
        faqSchemaCount: faqMatches.length,
        hasSeoManager,
        hasNoindex,
        wordCount
    };
});

console.log(JSON.stringify(results, null, 2));
