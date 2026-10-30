const fs = require('fs');
const path = require('path');

// 1. Load word dictionary
const wordsAlphaPath = path.join(__dirname, 'words_alpha.txt');
const allWords = fs.readFileSync(wordsAlphaPath, 'utf8')
    .split(/\r?\n/)
    .map(w => w.trim().toLowerCase())
    .filter(w => w.length > 0);

console.log(`Loaded total dictionary words: ${allWords.length}`);

// Common high-frequency Wordle / Scrabble openers & priority words for better curation
const priorityOpeners = new Set([
    "adieu", "arise", "about", "alert", "apple", "ahead", "agent", "angel", "angry", "amigo", "avoid",
    "baker", "beach", "brain", "bread", "bring", "broad", "brown", "build", "burst", "buyer",
    "cable", "camel", "candy", "cause", "chair", "charm", "chart", "clean", "clear", "crane", "count",
    "dance", "delta", "depth", "dirty", "draft", "drain", "dream", "drive", "drown", "dying",
    "eager", "early", "earth", "eight", "elite", "empty", "enemy", "enter", "equal", "event", "every",
    "fable", "faith", "false", "fault", "fiber", "field", "fight", "final", "first", "flame", "fresh",
    "giant", "glass", "globe", "grace", "grand", "grant", "grape", "graph", "great", "green", "group",
    "habit", "happy", "heart", "heavy", "horse", "hotel", "house", "human", "humor", "hurry",
    "ideal", "image", "imply", "index", "inner", "input", "irony", "issue", "ivory",
    "japan", "jeans", "joint", "judge", "juice", "juicy", "jumbo", "jumpy", "junta",
    "karma", "kayak", "kebab", "khaki", "kiosk", "knack", "kneel", "knife", "knock", "known",
    "label", "labor", "lance", "large", "later", "laugh", "learn", "lemon", "light", "limit", "lucky",
    "magic", "major", "maker", "march", "match", "media", "metal", "model", "money", "month", "music",
    "naive", "naked", "nasty", "naval", "needs", "nerve", "never", "niche", "night", "noble", "noise", "north", "novel", "nurse",
    "ocean", "offer", "often", "onion", "opera", "orbit", "order", "organ", "other", "outer", "ounce", "ozone",
    "paint", "panel", "paper", "party", "peace", "phase", "phone", "piano", "piece", "plant", "point", "power", "price", "prime", "proof", "proud",
    "queen", "query", "quest", "queue", "quick", "quiet", "quilt", "quite", "quota", "quote",
    "radio", "raise", "range", "reach", "react", "ready", "refer", "right", "river", "robot", "round", "route", "royal", "ruler",
    "scale", "scene", "scope", "score", "sense", "shape", "share", "shine", "shock", "short", "sight", "skill", "slate", "smart", "smile", "solid", "sound", "space", "speed", "stage", "stand", "stare", "start", "state", "steam", "steel", "stock", "stone", "store", "story", "style", "sugar", "sweet",
    "table", "taste", "teach", "theme", "there", "thing", "think", "three", "today", "topic", "total", "touch", "tower", "track", "trade", "train", "trend", "trial", "truth", "twice",
    "uncle", "under", "union", "unite", "unity", "until", "upper", "upset", "urban", "usage", "usual",
    "valid", "value", "video", "viral", "virus", "visit", "vital", "vivid", "vocal", "voice",
    "waste", "watch", "water", "wheel", "where", "which", "while", "white", "whole", "world", "worry", "would", "write", "wrong",
    "xenon", "xerox", "xylem",
    "yacht", "yearn", "yeast", "yield", "young", "youth",
    "zebra", "zesty", "zilch", "zonal"
]);

function getCrated5LetterWords(filterFn, maxCount = 150) {
    const matching = allWords.filter(w => w.length === 5 && filterFn(w));
    // Sort priority openers first, then alphabetical
    matching.sort((a, b) => {
        const aPri = priorityOpeners.has(a) ? 1 : 0;
        const bPri = priorityOpeners.has(b) ? 1 : 0;
        if (aPri !== bPri) return bPri - aPri;
        return a.localeCompare(b);
    });
    return matching.slice(0, maxCount);
}

// 2. Build pre-rendered word grid HTML
function renderStaticWordGrid(words) {
    if (!words || words.length === 0) {
        return '<p class="text-muted" style="grid-column: 1/-1; text-align: center;">No words found.</p>';
    }
    return words.map(w => `                        <div class="word-item">${w.toUpperCase()}</div>`).join('\n');
}

// 3. Process 26 Starting Letter Pages (5-letter-words-starting-with-a.html to z.html)
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
let updatedStartingCount = 0;

// Preserve frozen/customized starting letter pages (e.g., M, H, L) unless explicitly requested
const processStarting = process.argv.includes('--all-pages') || process.argv.includes('--starting');

if (processStarting) {
    for (const letter of letters) {
        if (['m', 'h', 'l'].includes(letter) && !process.argv.includes('--force-frozen')) {
            console.log(`Skipping frozen page 5-letter-words-starting-with-${letter}.html`);
            continue;
        }

        const fileName = `5-letter-words-starting-with-${letter}.html`;
        const filePath = path.join(__dirname, fileName);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');

        // Get top curated words starting with letter
        const matchingWords = getCrated5LetterWords(w => w.startsWith(letter), 150);
        const gridHtml = renderStaticWordGrid(matchingWords);

        // Conditional transparency disclaimer
        let disclaimerHtml = '';
        if (matchingWords.length === 150) {
            disclaimerHtml = '\n                    <p class="text-muted" style="margin-top: 1rem; font-size: 0.9rem; text-align: center;">Showing 150 words from our dictionary list. Use the Word Finder tool above to explore more matching words.</p>';
        } else if (matchingWords.length > 0) {
            disclaimerHtml = `\n                    <p class="text-muted" style="margin-top: 1rem; font-size: 0.9rem; text-align: center;">Showing all ${matchingWords.length} matching words from our dictionary list.</p>`;
        }

        // Remove any previously injected disclaimer notice
        content = content.replace(/\s*<p class="text-muted" style="margin-top: 1rem; font-size: 0\.9rem; text-align: center;">[\s\S]*?<\/p>/g, '');

        // Match exact wordGrid container cleanly
        const wordGridRegex = /<div id="wordGrid" class="word-grid">[\s\S]*?<\/div>(?=\s*(?:<h3>|<h2|<section|<\/div>|\$))/;
        if (wordGridRegex.test(content)) {
            content = content.replace(wordGridRegex, `<div id="wordGrid" class="word-grid">\n${gridHtml}\n                    </div>${disclaimerHtml}`);
        }

        // Ensure self-referential canonical URL
        const canonicalUrl = `https://www.5letterwordfindertool.com/5-letter-words-starting-with-${letter}.html`;
        const canonicalRegex = /<link rel="canonical" href="[^"]*">/;
        if (canonicalRegex.test(content)) {
            content = content.replace(canonicalRegex, `<link rel="canonical" href="${canonicalUrl}">`);
        } else {
            content = content.replace('</head>', `    <link rel="canonical" href="${canonicalUrl}">\n</head>`);
        }

        // Ensure robots index, follow
        if (!content.includes('name="robots"')) {
            content = content.replace('</head>', `    <meta name="robots" content="index, follow">\n</head>`);
        }

        // Remove client-side DOMContentLoaded overwrite for wordGrid to prevent layout shift & preserve pre-rendered HTML
        content = content.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/gi, '');

        fs.writeFileSync(filePath, content, 'utf8');
        updatedStartingCount++;
    }
    console.log(`Updated ${updatedStartingCount} starting letter pages with static HTML word grids.`);
} else {
    console.log("Preserving starting letter pages (use --starting or --all-pages to re-generate them).");
}

// 4. Process 26 Ending Letter Pages (e.g., e, s, t, y, z...)
let updatedEndingCount = 0;

for (const letter of letters) {
    const fileName = `5-letter-words-ending-with-${letter}.html`;
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Get top curated words ending with letter
    const matchingWords = getCrated5LetterWords(w => w.endsWith(letter), 150);
    const gridHtml = renderStaticWordGrid(matchingWords);

    // Conditional transparency disclaimer
    let disclaimerHtml = '';
    if (matchingWords.length === 150) {
        disclaimerHtml = '\n                <p class="text-muted" style="margin-top: 1rem; font-size: 0.9rem; text-align: center;">Showing 150 words from our dictionary list. Use the Word Finder tool above to explore more matching words.</p>';
    } else if (matchingWords.length > 0) {
        disclaimerHtml = `\n                <p class="text-muted" style="margin-top: 1rem; font-size: 0.9rem; text-align: center;">Showing all ${matchingWords.length} matching words from our dictionary list.</p>`;
    }

    // Ensure CSS styles for .word-grid and .word-item are present
    if (!content.includes('.word-grid {')) {
        const styleTag = `\n    <style>\n        .word-grid {\n            display: grid;\n            grid-template-columns: repeat(3, 1fr);\n            gap: 1rem;\n            margin: 1.5rem 0;\n            background: rgba(255, 255, 255, 0.05);\n            padding: 1.5rem;\n            border-radius: 12px;\n            border: 1px solid rgba(255, 255, 255, 0.1);\n        }\n        .word-item {\n            font-family: 'Outfit', sans-serif;\n            font-size: 1.1rem;\n            font-weight: 600;\n            letter-spacing: 0.05em;\n            color: var(--text-light);\n            text-align: center;\n            padding: 0.5rem;\n            background: rgba(0, 0, 0, 0.2);\n            border-radius: 6px;\n        }\n        @media (max-width: 600px) {\n            .word-grid {\n                grid-template-columns: repeat(2, 1fr);\n            }\n        }\n    </style>`;
        content = content.replace('<link rel="stylesheet" href="style.css">', `<link rel="stylesheet" href="style.css">${styleTag}`);
    }

    // Build dedicated static card section containing #wordGrid
    const preRenderedSectionHtml = `<!-- PRE-RENDERED SEO CONTENT SECTION -->\n            <section class="card" style="margin-top: 2.5rem; padding: 2rem;">\n                <div class="results-info" style="margin-bottom: 1rem;">\n                    <h2 style="font-size: 1.35rem; font-weight: 700; color: #ffffff; margin: 0;">5-Letter Words Ending in ${letter.toUpperCase()}</h2>\n                </div>\n                <div id="wordGrid" class="word-grid">\n${gridHtml}\n                </div>${disclaimerHtml}\n            </section>\n\n            `;

    // Match the pre-rendered SEO content section block (idempotent replacement)
    const preRenderedBlockRegex = /<!-- PRE-RENDERED SEO CONTENT SECTION -->[\s\S]*?(?=<section class="seo-guide-section" style="margin-top: 4rem;">)/;
    if (preRenderedBlockRegex.test(content)) {
        content = content.replace(preRenderedBlockRegex, preRenderedSectionHtml);
    }

    const canonicalUrl = `https://www.5letterwordfindertool.com/5-letter-words-ending-with-${letter}.html`;
    const canonicalRegex = /<link rel="canonical" href="[^"]*">/;
    if (canonicalRegex.test(content)) {
        content = content.replace(canonicalRegex, `<link rel="canonical" href="${canonicalUrl}">`);
    }

    if (!content.includes('name="robots"')) {
        content = content.replace('</head>', `    <meta name="robots" content="index, follow">\n</head>`);
    }

    content = content.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/gi, '');

    fs.writeFileSync(filePath, content, 'utf8');
    updatedEndingCount++;
}

console.log(`Updated ${updatedEndingCount} ending letter pages with static HTML word grids.`);

// 5. Verify & Update Canonical and Meta for AI Word Solver (ai-word-solver.html)
const aiSolverPath = path.join(__dirname, 'ai-word-solver.html');
if (fs.existsSync(aiSolverPath)) {
    let aiContent = fs.readFileSync(aiSolverPath, 'utf8');
    const aiCanonical = `https://www.5letterwordfindertool.com/ai-word-solver`;
    
    aiContent = aiContent.replace(
        /<link rel="canonical" href="[^"]*">/,
        `<link rel="canonical" href="${aiCanonical}">`
    );

    if (!aiContent.includes('name="robots"')) {
        aiContent = aiContent.replace('</head>', `    <meta name="robots" content="index, follow">\n</head>`);
    }

    fs.writeFileSync(aiSolverPath, aiContent, 'utf8');
    console.log(`Updated ai-word-solver.html canonical and indexability rules.`);
}

console.log("Programmatic SEO Pre-rendering Build Complete!");
