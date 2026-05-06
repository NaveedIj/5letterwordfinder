/**
 * SEO Data Configuration
 * Scalable foundation for dynamic metadata and content rendering.
 */
const BASE_URL = "https://www.5letterwordfindertool.com"; // Official production domain

/**
 * SEO Tokens: Dynamic variables for placeholder replacement.
 */
const SEO_TOKENS = {
    "wordle": "Wordle",
    "scrabble": "Scrabble",
    "common": "Wordle-friendly",
    "extended": "Full Scrabble dictionary"
};

/**
 * Audience Strategies: Rotating content angles to prevent duplicate footprints.
 */
const SEO_STRATEGIES = {
    "WORDLE_SOLVER": {
        "id": "wordle_solver",
        "intro": "Struggling with your {{pattern}} {{count}}-letter word? You're not alone. When the answer starts with {{letter}}, identifying vowel clusters early is the key to maintaining your streak.",
        "usage_title": "Mastering {{letter}} Position Logic",
        "usage_text": "Use the {{letter}} as your primary anchor. We recommend testing words with high vowel density like {{vowels}} to quickly eliminate or confirm the core structure of your puzzle.",
        "faq_q": "Why is starting with {{letter}} a good Wordle move?",
        "faq_a": "Statistically, {{letter}} appears in approximately {{percentage}}% of common English words. By confirming its position, you prune the possible answer list by over 80%."
    },
    "SCRABBLE_PRO": {
        "id": "scrabble_pro",
        "intro": "Looking for the perfect {{letter}} hook? Our {{count}}-letter word finder helps you locate high-scoring combinations {{pattern}} {{letter}} to dominate the board.",
        "usage_title": "Scoring Big with {{letter}}",
        "usage_text": "Prioritize words that pair {{letter}} with high-value consonants like {{high_value}}. These combinations often land on bonus squares, turning a simple play into a game-winning bingo.",
        "faq_q": "Can I use these {{letter}} words in competitive Scrabble?",
        "faq_a": "Yes. Our extended dictionary includes all valid {{count}}-letter terms recognized by official tournament lists, including rare hooks and high-scoring clusters."
    },
    "VOCAB_EXPLORER": {
        "id": "vocab_explorer",
        "intro": "Expand your vocabulary by exploring {{count}}-letter English words {{pattern}} {{letter}}. Understanding these linguistic patterns improves both your writing and puzzle-solving speed.",
        "usage_title": "Linguistic Patterns of {{letter}}",
        "usage_text": "The letter {{letter}} often leads into common prefixes and suffixes. By studying how {{letter}} interacts with other characters, you'll develop a more intuitive sense for natural word structures.",
        "faq_q": "Are words {{pattern}} {{letter}} common in English?",
        "faq_a": "The letter {{letter}} is one of the most versatile in the alphabet. {{count}}-letter words in this category follow predictable phonetic rules that are essential for language mastery."
    }
};

/**
 * Contextual Internal Linking: Semantically rich anchors for better crawl understanding.
 */
const INTERNAL_LINKS = {
    "3_LETTER": "Explore high-scoring 3-letter Scrabble hooks",
    "4_LETTER": "View common 4-letter word patterns",
    "5_LETTER": "Master 5-letter Wordle strategies",
    "6_LETTER": "Solve complex 6-letter word puzzles",
    "7_LETTER": "Find 7-letter Scrabble Bingos",
    "8_LETTER": "Discover advanced 8-letter word combinations",
    "STARTING_WITH": "Browse words starting with {{letter}}",
    "ENDING_WITH": "Browse words ending with {{letter}}"
};

const SEO_DATA = {
    "3": {
        "title": "3 Letter Word Finder & Solver | Quick Word Results",
        "description": "Find all 3-letter words matching your pattern. Essential for high-scoring Scrabble plays and short-word anagram games. Accurate and free.",
        "canonical": "/3-letter-word-finder.html",
        "h1": "Find 3 Letter Words Instantly",
        "subheading": "The quickest way to find valid 3-letter words for any game or puzzle.",
        "content": [
            {
                "title": "Why Use a 3 Letter Word Finder?",
                "text": "Three-letter words are vital in Scrabble and crosswords, especially when you need to play 'hook' words or fit into tight spaces. Our 3 letter word finder identifies every valid combination from standard dictionaries. If you need something slightly longer, try our <a href='/'>5 letter word finder tool</a> for more options."
            },
            {
                "title": "Boost Your Short-Word Game",
                "text": "Mastering 3-letter words can significantly improve your performance in competitive word gaming. Use our filters to find precisely what you need, whether it's words starting with 'Q' or containing a 'Z'."
            }
        ],
        "faqs": [
            { "question": "What are the highest scoring 3-letter words?", "answer": "Words like ZAX, ZEK, and QIS often yield the highest points in Scrabble due to high-value tiles." },
            { "question": "Are 3-letter words useful in Wordle?", "answer": "While Wordle uses 5-letter words, many 3-letter patterns emerge as you narrow down your guesses." }
        ],
        "patterns": [
            { "label": "3 Letter words starting with A", "query": "?pos0=A" },
            { "label": "3 Letter words ending with E", "query": "?pos2=E" }
        ],
        "guides": [
            { "label": "Solving 3-Letter Crosswords", "link": "#" },
            { "label": "Scrabble Hook Strategies", "link": "#" }
        ]
    },
    "4": {
        "title": "4 Letter Word Finder & Solver | Instant Results",
        "description": "Find all 4-letter words matching your criteria. Perfect for short-word puzzles, Scrabble, and anagrams. Fast, free, and accurate solver.",
        "canonical": "/4-letter-word-finder.html",
        "h1": "Find 4 Letter Words Instantly",
        "subheading": "The ultimate quick-solver for 4-letter word puzzles and games.",
        "content": [
            {
                "title": "Why Use a 4 Letter Word Finder?",
                "text": "Four-letter words are the backbone of many word games. Whether you're dealing with tricky vowels or restrictive consonants, our tool scans thousands of words. For standard Wordle puzzles, we recommend using our <a href='/'>5 letter word finder tool</a>."
            },
            {
                "title": "Master Short Word Puzzles",
                "text": "Short words often require a different strategy. Using our tool, you can filter by exact positions, included letters, or exclusion lists. Use our <a href='3-letter-word-finder.html'>3 letter word finder</a> if you need to find even shorter options for Scrabble."
            }
        ],
        "faqs": [
            { "question": "Are 4-letter words common in Wordle?", "answer": "Standard Wordle uses 5-letter words, but many variants and daily puzzles use 4-letter formats." },
            { "question": "Can I filter by starting letter?", "answer": "Yes, use the first slot in the 'Correct Position' grid to filter words starting with a specific character." }
        ],
        "patterns": [
            { "label": "4 Letter words starting with S", "query": "?pos0=S" },
            { "label": "4 Letter words ending with S", "query": "?pos3=S" }
        ],
        "guides": [
            { "label": "4-Letter Word Lists", "link": "#" },
            { "label": "Advanced Positional Searching", "link": "#" }
        ]
    },
    "5": {
        "title": "5 Letter Word Finder & Wordle Solver | Instant Results",
        "description": "Find all 5 letter words instantly with our advanced word finder tool. Perfect for Wordle, Scrabble, and puzzle games. Fast, accurate, and free.",
        "canonical": "/",
        "h1": "Find 5 Letter Words Instantly",
        "subheading": "Use our powerful word finder tool to solve Wordle, Scrabble, and other word puzzles quickly and easily.",
        "content": [
            {
                "title": "What is this 5 Letter Word Finder?",
                "text": "A 5 letter word finder helps players of popular games like Wordle. By entering known letters and excluded characters, users can narrow down potential words. If you are playing a variant with more letters, check out our <a href='6-letter-word-finder.html'>6 letter word finder</a> for advanced support."
            },
            {
                "title": "How to Use the Wordle Helper",
                "text": "Our tool is optimized for the Wordle experience. Use the 'Correct Position' (Green) inputs for confirmed letters. If you're building a Scrabble Bingo, our <a href='7-letter-word-finder.html'>7 letter word finder</a> is the perfect companion."
            }
        ],
        "patterns": [
            { "label": "5 Letter words starting with A", "query": "?pos0=A" },
            { "label": "5 Letter words ending with E", "query": "?pos4=E" }
        ],
        "guides": [
            { "label": "Top Wordle Starting Words", "link": "#" },
            { "label": "How to Solve Wordle Every Day", "link": "#" }
        ]
    },
    "6": {
        "title": "6 Letter Word Finder & Solver | Advanced Word Search",
        "description": "Find all 6-letter words matching your pattern. Advanced search for Scrabble, Wordle variants, and anagram games. Accurate and free lookup.",
        "canonical": "/6-letter-word-finder.html",
        "h1": "6 Letter Word Finder & Solver",
        "subheading": "Unlock long-form word games with our comprehensive 6-letter search engine.",
        "content": [
            {
                "title": "The Power of 6 Letter Words",
                "text": "Six-letter words offer more complexity and higher scoring potential. Our engine uses a massive dictionary. For Wordle-like constraints, most users prefer the <a href='/'>5 letter word finder tool</a>."
            },
            {
                "title": "Solve Complex Word Ladders",
                "text": "Many advanced word games involve building on existing patterns. If you need bingo-ready words, try our <a href='7-letter-word-finder.html'>7 letter word finder</a>."
            }
        ],
        "faqs": [
            { "question": "How many 6-letter words are in the dictionary?", "answer": "Our database contains over 15,000 valid English 6-letter words recognized by major game dictionaries." },
            { "question": "Can I sort by Scrabble score?", "answer": "Yes, use the sorting dropdown in the sidebar to order results by their Scrabble point value." }
        ],
        "patterns": [
            { "label": "6 Letter words starting with C", "query": "?pos0=C" },
            { "label": "6 Letter words ending with Y", "query": "?pos5=Y" }
        ],
        "guides": [
            { "label": "6-Letter Anagram Strategies", "link": "#" },
            { "label": "Advanced Crossword Solving", "link": "#" }
        ]
    },
    "7": {
        "title": "7 Letter Word Finder & Solver | Solve Word Puzzles Easily",
        "description": "Find 7-letter words instantly. Perfect for Scrabble Bingo, crosswords, and advanced word games. Easy-to-use search with position filters.",
        "canonical": "/7-letter-word-finder.html",
        "h1": "7 Letter Word Finder & Bingo Solver",
        "subheading": "Search through thousands of 7-letter words to find the perfect match for your puzzle.",
        "content": [
            {
                "title": "Find the Perfect 7 Letter Word",
                "text": "Seven-letter words are the 'Holy Grail' for Scrabble players. If you're stuck with even more letters, consider our <a href='8-letter-word-finder.html'>8 letter word finder</a> for larger grids."
            },
            {
                "title": "Strategic Vocabulary Building",
                "text": "Learning 7-letter stems and patterns is a key skill. If you're just starting, practice with the <a href='4-letter-word-finder.html'>4 letter word finder</a> to learn basic positional logic."
            }
        ],
        "faqs": [
            { "question": "What is a 'Bingo' in Scrabble?", "answer": "A Bingo is when a player uses all seven tiles from their rack in a single turn, earning a 50-point bonus." },
            { "question": "Does this tool help with anagrams?", "answer": "Yes, use the 'Must Include' field to enter your tiles and see all possible 7-letter words you can form." }
        ],
        "patterns": [
            { "label": "7 Letter words starting with B", "query": "?pos0=B" },
            { "label": "7 Letter words ending with S", "query": "?pos6=S" }
        ],
        "guides": [
            { "label": "Mastering Scrabble Bingos", "link": "#" },
            { "label": "7-Letter Stem Examples", "link": "#" }
        ]
    },
    "8": {
        "title": "8 Letter Word Finder & Solver | Find Longer Words Fast",
        "description": "Search through thousands of 8-letter words. Perfect for crosswords, advanced puzzles, and Scrabble enthusiasts. Accurate, fast, and free lookup tool.",
        "canonical": "/8-letter-word-finder.html",
        "h1": "8 Letter Word Finder & Solver",
        "subheading": "The ultimate search engine for long-form 8-letter word puzzles.",
        "content": [
            {
                "title": "Advanced 8 Letter Word Search",
                "text": "Finding 8-letter words can be challenging. For common puzzle solving, our <a href='/'>5 letter word finder tool</a> remains the most popular choice."
            },
            {
                "title": "Master Complex Anagrams",
                "text": "Whether you're solving a complex crossword or looking for the perfect bridge, we have you covered. Use our <a href='7-letter-word-finder.html'>7 letter word finder</a> if you need to hit Scrabble Bingos."
            }
        ],
        "faqs": [
            { "question": "How many 8-letter words exist?", "answer": "Our database contains over 25,000 valid 8-letter words recognized by major English dictionaries." },
            { "question": "Can I use position filters for 8 letters?", "answer": "Yes, our grid supports up to 8 exact positions for high-precision word discovery." }
        ],
        "patterns": [
            { "label": "8 Letter words starting with T", "query": "?pos0=T" },
            { "label": "8 Letter words ending with G", "query": "?pos7=G" }
        ],
        "guides": [
            { "label": "8-Letter Puzzle Tips", "link": "#" },
            { "label": "Cracking Long Anagrams", "link": "#" }
        ]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SEO_DATA, BASE_URL };
}
