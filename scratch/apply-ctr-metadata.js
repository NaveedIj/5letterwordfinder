const fs = require('fs');
const path = require('path');

const metaMap = {
    'index.html': {
        title: '5 Letter Word Finder – Instant Wordle & Scrabble Solver',
        desc: 'Find 5-letter words instantly with our free Word Finder. Filter by letter positions, misplaced letters, and excluded tiles to solve daily Wordle & Scrabble puzzles fast.',
        ogTitle: '5 Letter Word Finder – Instant Wordle & Scrabble Solver',
        ogDesc: 'Find 5-letter words instantly with our free Word Finder. Filter by letter positions, misplaced letters, and excluded tiles to solve daily Wordle & Scrabble puzzles fast.',
        twTitle: '5 Letter Word Finder – Instant Wordle & Scrabble Solver',
        twDesc: 'Find 5-letter words instantly with our free Word Finder. Filter by letter positions, misplaced letters, and excluded tiles to solve daily Wordle & Scrabble puzzles fast.'
    },
    '3-letter-word-finder.html': {
        title: '3 Letter Word Finder – Fast Scrabble Hooks & Puzzle Solver',
        desc: 'Unscramble 3-letter words instantly. Discover high-scoring Scrabble hooks like ZAX, QIS, and JEU to maximize points and narrow down daily puzzle options.',
        ogTitle: '3 Letter Word Finder – Fast Scrabble Hooks & Puzzle Solver',
        ogDesc: 'Unscramble 3-letter words instantly. Discover high-scoring Scrabble hooks like ZAX, QIS, and JEU to maximize points and narrow down daily puzzle options.',
        twTitle: '3 Letter Word Finder – Fast Scrabble Hooks & Puzzle Solver',
        twDesc: 'Unscramble 3-letter words instantly. Discover high-scoring Scrabble hooks like ZAX, QIS, and JEU to maximize points and narrow down daily puzzle options.'
    },
    '4-letter-word-finder.html': {
        title: '4 Letter Word Finder – Essential Roots & Scrabble Solver',
        desc: 'Find all valid 4-letter words with position filters. Perfect for Scrabble hooks, anagram solving, crossword clues, and building 5-letter Wordle stems.',
        ogTitle: '4 Letter Word Finder – Essential Roots & Scrabble Solver',
        ogDesc: 'Find all valid 4-letter words with position filters. Perfect for Scrabble hooks, anagram solving, crossword clues, and building 5-letter Wordle stems.',
        twTitle: '4 Letter Word Finder – Essential Roots & Scrabble Solver',
        twDesc: 'Find all valid 4-letter words with position filters. Perfect for Scrabble hooks, anagram solving, crossword clues, and building 5-letter Wordle stems.'
    },
    '6-letter-word-finder.html': {
        title: '6 Letter Word Finder – Advanced Anagram & Pattern Solver',
        desc: 'Solve 6-letter word puzzles easily using prefix, suffix, and position filters. Master complex anagrams, crossword grid extensions, and Scrabble board plays.',
        ogTitle: '6 Letter Word Finder – Advanced Anagram & Pattern Solver',
        ogDesc: 'Solve 6-letter word puzzles easily using prefix, suffix, and position filters. Master complex anagrams, crossword grid extensions, and Scrabble board plays.',
        twTitle: '6 Letter Word Finder – Advanced Anagram & Pattern Solver',
        twDesc: 'Solve 6-letter word puzzles easily using prefix, suffix, and position filters. Master complex anagrams, crossword grid extensions, and Scrabble board plays.'
    },
    '7-letter-word-finder.html': {
        title: '7 Letter Word Finder – Scrabble Bingo & Unscramble Solver',
        desc: 'Generate valid 7-letter words instantly. Discover 50-point Scrabble Bingo options, solve tricky crosswords, and unscramble anagrams with smart position controls.',
        ogTitle: '7 Letter Word Finder – Scrabble Bingo & Unscramble Solver',
        ogDesc: 'Generate valid 7-letter words instantly. Discover 50-point Scrabble Bingo options, solve tricky crosswords, and unscramble anagrams with smart position controls.',
        twTitle: '7 Letter Word Finder – Scrabble Bingo & Unscramble Solver',
        twDesc: 'Generate valid 7-letter words instantly. Discover 50-point Scrabble Bingo options, solve tricky crosswords, and unscramble anagrams with smart position controls.'
    },
    '8-letter-word-finder.html': {
        title: '8 Letter Word Finder – Grandmaster Puzzle & Bingo Solver',
        desc: 'Search 8-letter words through floating board tiles. Hook through existing letters to score massive Scrabble points and solve complex crossword puzzles fast.',
        ogTitle: '8 Letter Word Finder – Grandmaster Puzzle & Bingo Solver',
        ogDesc: 'Search 8-letter words through floating board tiles. Hook through existing letters to score massive Scrabble points and solve complex crossword puzzles fast.',
        twTitle: '8 Letter Word Finder – Grandmaster Puzzle & Bingo Solver',
        twDesc: 'Search 8-letter words through floating board tiles. Hook through existing letters to score massive Scrabble points and solve complex crossword puzzles fast.'
    },
    'ai-word-solver.html': {
        title: 'AI Word Solver – Instant Pattern & Anagram Resolver',
        desc: 'Solve Wordle, Scrabble, Crossword, and Hangman puzzles using smart AI pattern matching. Filter by green, yellow, and excluded letters for instant answers.',
        ogTitle: 'AI Word Solver – Instant Pattern & Anagram Resolver',
        ogDesc: 'Solve Wordle, Scrabble, Crossword, and Hangman puzzles using smart AI pattern matching. Filter by green, yellow, and excluded letters for instant answers.',
        twTitle: 'AI Word Solver – Instant Pattern & Anagram Resolver',
        twDesc: 'Solve Wordle, Scrabble, Crossword, and Hangman puzzles using smart AI pattern matching. Filter by green, yellow, and excluded letters for instant answers.'
    }
};

// Also optimize starting and ending letter pages to ensure Twitter tags and clean, CTR-focused metadata
const startingLetterTitles = {
    'a': '5 Letter Words Starting With A – Vowel Openers & Answers',
    'b': '5 Letter Words Starting With B – High-Value Scrabble Picks',
    'c': '5 Letter Words Starting With C – Essential Wordle Openers',
    'd': '5 Letter Words Starting With D – Top Anagram & Puzzle Picks',
    'e': '5 Letter Words Starting With E – Vowel Starters & Solutions',
    'f': '5 Letter Words Starting With F – Scrabble & Wordle Answers',
    'g': '5 Letter Words Starting With G – Common Guesses & Answers',
    'h': '5 Letter Words Starting With H – Fast Wordle & Puzzle Picks',
    'i': '5 Letter Words Starting With I – Vowel Patterns & Answers',
    'j': '5 Letter Words Starting With J – High-Scoring J Tiles',
    'k': '5 Letter Words Starting With K – Key Scrabble & Puzzle Words',
    'l': '5 Letter Words Starting With L – Popular Wordle Starters',
    'm': '5 Letter Words Starting With M – Top Answers & Solutions',
    'n': '5 Letter Words Starting With N – Essential Consonant Words',
    'o': '5 Letter Words Starting With O – Vowel Openers & Answers',
    'p': '5 Letter Words Starting With P – Proven Openers & Scrabble Words',
    'q': '5 Letter Words Starting With Q – High-Scoring Q Solutions',
    'r': '5 Letter Words Starting With R – Top Rated Wordle Openers',
    's': '5 Letter Words Starting With S – Ultimate Wordle Starters',
    't': '5 Letter Words Starting With T – Top Consonant Openers',
    'u': '5 Letter Words Starting With U – Vowel Starter Words',
    'v': '5 Letter Words Starting With V – Rare Consonant Solutions',
    'w': '5 Letter Words Starting With W – Winning Plays & Answers',
    'x': '5 Letter Words Starting With X – High-Value X Tile Plays',
    'y': '5 Letter Words Starting With Y – Winning Vowel-Y Openers',
    'z': '5 Letter Words Starting With Z – High-Scoring Z Tile Words'
};

const endingLetterTitles = {
    'e': '5 Letter Words Ending in E – Ultimate Silent-E Strategy',
    's': '5 Letter Words Ending in S – Plural Rules & Base Words',
    't': '5 Letter Words Ending in T – Past-Tense Verbs & Anchors',
    'y': '5 Letter Words Ending in Y – Top Adjectives & Solutions'
};

let updatedCount = 0;

const rootDir = path.join(__dirname, '..');

for (const [file, meta] of Object.entries(metaMap)) {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
    content = content.replace(/<meta name="description"\s+content="[^"]*"/i, `<meta name="description"\n        content="${meta.desc}">`);
    
    // Update or inject OG & Twitter
    if (content.includes('property="og:title"')) {
        content = content.replace(/<meta property="og:title"\s+content="[^"]*"/i, `<meta property="og:title" content="${meta.ogTitle}">`);
    }
    if (content.includes('property="og:description"')) {
        content = content.replace(/<meta property="og:description"\s+content="[^"]*"/i, `<meta property="og:description"\n        content="${meta.ogDesc}">`);
    }
    if (content.includes('name="twitter:title"')) {
        content = content.replace(/<meta name="twitter:title"\s+content="[^"]*"/i, `<meta name="twitter:title" content="${meta.twTitle}">`);
    }
    if (content.includes('name="twitter:description"')) {
        content = content.replace(/<meta name="twitter:description"\s+content="[^"]*"/i, `<meta name="twitter:description"\n        content="${meta.twDesc}">`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
}

// Update starting letter pages
for (const [ltr, title] of Object.entries(startingLetterTitles)) {
    const file = `5-letter-words-starting-with-${ltr}.html`;
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    const desc = `Browse valid 5-letter words starting with ${ltr.toUpperCase()}. Discover high-frequency Wordle openers, Scrabble tile plays, and positional patterns to solve daily puzzles fast.`;
    
    content = content.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
    content = content.replace(/<meta name="description"\s+content="[^"]*"/i, `<meta name="description" content="${desc}">`);
    content = content.replace(/<meta property="og:title"\s+content="[^"]*"/i, `<meta property="og:title" content="${title}">`);
    content = content.replace(/<meta property="og:description"\s+content="[^"]*"/i, `<meta property="og:description" content="${desc}">`);

    // Ensure twitter tags exist
    if (!content.includes('name="twitter:title"')) {
        const twTags = `    <meta name="twitter:card" content="summary_large_image">\n    <meta name="twitter:title" content="${title}">\n    <meta name="twitter:description" content="${desc}">\n    <meta name="twitter:image" content="https://www.5letterwordfindertool.com/preview.png">\n`;
        content = content.replace('</head>', `${twTags}</head>`);
    } else {
        content = content.replace(/<meta name="twitter:title"\s+content="[^"]*"/i, `<meta name="twitter:title" content="${title}">`);
        content = content.replace(/<meta name="twitter:description"\s+content="[^"]*"/i, `<meta name="twitter:description" content="${desc}">`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
}

// Update ending letter pages
for (const [ltr, title] of Object.entries(endingLetterTitles)) {
    const file = `5-letter-words-ending-with-${ltr}.html`;
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    const desc = `Browse valid 5-letter words ending in ${ltr.toUpperCase()}. Master key English suffix patterns, silent-E rules, and positional logic to solve Wordle & Scrabble puzzles.`;

    content = content.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
    content = content.replace(/<meta name="description"\s+content="[^"]*"/i, `<meta name="description" content="${desc}">`);
    content = content.replace(/<meta property="og:title"\s+content="[^"]*"/i, `<meta property="og:title" content="${title}">`);
    content = content.replace(/<meta property="og:description"\s+content="[^"]*"/i, `<meta property="og:description" content="${desc}">`);

    if (!content.includes('name="twitter:title"')) {
        const twTags = `    <meta name="twitter:card" content="summary_large_image">\n    <meta name="twitter:title" content="${title}">\n    <meta name="twitter:description" content="${desc}">\n    <meta name="twitter:image" content="https://www.5letterwordfindertool.com/preview.png">\n`;
        content = content.replace('</head>', `${twTags}</head>`);
    } else {
        content = content.replace(/<meta name="twitter:title"\s+content="[^"]*"/i, `<meta name="twitter:title" content="${title}">`);
        content = content.replace(/<meta name="twitter:description"\s+content="[^"]*"/i, `<meta name="twitter:description" content="${desc}">`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
}

console.log(`Successfully optimized CTR metadata across ${updatedCount} HTML pages.`);
