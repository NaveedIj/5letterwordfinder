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
        "intro": "Identifying a {{count}}-letter word {{pattern}} <strong>{{letter}}</strong> requires a balance of vowel-hunting and consonant elimination. In competitive Wordle play, {{letter}} acts as a critical anchor that can narrow down thousands of possibilities to just a few dozen strategic choices.",
        "usage_title": "Positional Strategy for {{letter}}",
        "usage_text": "When the solution is {{pattern}} {{letter}}, we recommend testing <strong>{{vowels}}</strong> first. Statistically, this reveals the core structure of the word faster than random guessing. Pay close attention to {{count}}-letter patterns that pair {{letter}} with high-frequency companions like R, S, or T.",
        "faq_q": "Why is {{letter}} a powerful position for Wordle answers?",
        "faq_a": "The letter {{letter}} appears in approximately {{percentage}}% of common solutions. By pinning its position early, you can often solve the daily puzzle in 3 guesses or fewer."
    },
    "SCRABBLE_PRO": {
        "id": "scrabble_pro",
        "intro": "Mastering the {{count}}-letter board requires knowing your {{letter}} hooks. Whether you are looking for words {{pattern}} {{letter}} or high-value combinations, our tool identifies the most efficient scoring paths.",
        "usage_title": "Maximizing Point Value with {{letter}}",
        "usage_text": "Prioritize words that utilize {{high_value}}. In professional Scrabble play, securing a bonus square with a {{count}}-letter word {{pattern}} {{letter}} can result in a 30+ point lead in a single turn.",
        "faq_q": "Are these {{letter}} words legal in tournament play?",
        "faq_a": "Yes. Our extended dictionary matches official tournament word lists, ensuring every word {{pattern}} {{letter}} is valid for competitive play."
    },
    "VOCAB_EXPLORER": {
        "id": "vocab_explorer",
        "intro": "Linguistic analysis of {{count}}-letter words {{pattern}} {{letter}} reveals fascinating phonetic trends. Studying these structures improves both your writing speed and your intuitive grasp of English morphology.",
        "usage_title": "Phonetic Patterns of {{letter}}",
        "usage_text": "The letter {{letter}} often interacts with common prefixes and suffixes in {{count}}-letter words. Mastering these clusters makes it easier to recognize complex terms in crosswords and literature.",
        "faq_q": "How common are {{count}}-letter words {{pattern}} {{letter}}?",
        "faq_a": "They represent a significant portion of the English lexicon. Understanding {{letter}} clusters is a foundational step for advanced vocabulary building."
    }
};

/**
 * Contextual Internal Linking: Semantically rich anchors for better crawl understanding.
 */
const INTERNAL_LINKS = {
    "3_LETTER": "Find high-scoring Scrabble hooks",
    "4_LETTER": "View common 4-letter patterns",
    "5_LETTER": "Master 5-letter Wordle strategies",
    "6_LETTER": "Solve complex 6-letter puzzles",
    "7_LETTER": "Discover 7-letter Scrabble Bingos",
    "8_LETTER": "View advanced 8-letter combinations",
    "STARTING_WITH": "Explore vowel-heavy Wordle patterns starting with {{letter}}",
    "ENDING_WITH": "Browse common ending-letter strategies for {{letter}}"
};

const SEO_DATA = {
    "3": {
        "title": "3 Letter Words - Fast Scrabble & Wordle Picks",
        "description": "Find all 3-letter words for Scrabble and Wordle elimination. Discover high-scoring hooks like ZAX and QIS to maximize your points and narrow down guesses.",
        "canonical": "/3-letter-word-finder.html",
        "h1": "Find 3 Letter Words Fast",
        "subheading": "Compact word list for Scrabble hooks and quick puzzle elimination.",
        "content": [
            {
                "title": "Mastering Scrabble Hooks",
                "text": "Three-letter words are the 'connectors' of the Scrabble board. Using high-value tiles like <strong>X, Q, and Z</strong> in short words can net you massive points without opening up the board to your opponent. For example, <strong>ZAX</strong> is a tournament favorite that effectively uses the Z hook."
            },
            {
                "title": "Fast Wordle Pattern Testing",
                "text": "While Wordle uses 5-letter words, testing 3-letter stems can help you isolate vowel clusters and consonant stems like <strong>STR</strong> or <strong>ING</strong>. Use our tool to find short words that help you eliminate letters quickly in early rounds."
            }
        ],
        "faqs": [
            { "question": "What are the best 3-letter words for Scrabble?", "answer": "Focus on high-value characters. ZAX, ZEK, and QIS are excellent because they utilize high-point tiles in a compact, easy-to-play format." },
            { "question": "How do 3-letter words help in Wordle?", "answer": "They are perfect for testing letter-position logic. If you suspect a 'TH' or 'SH' cluster, finding short words with those stems can confirm their presence." }
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
                "title": "Top Wordle Solving Strategies",
                "text": "Success in Wordle depends on your opening move. Start with high-entropy words like <strong>CRANE</strong>, <strong>SLATE</strong>, or <strong>STARE</strong> to eliminate common consonants. If you prefer vowel hunting, <strong>ADIEU</strong> or <strong>AUDIO</strong> can quickly reveal the word's skeleton."
            },
            {
                "title": "Vowel vs. Consonant Balance",
                "text": "Most 5-letter English words contain at least two vowels. If your first guess reveals no vowels, focus on 'Y' as a proxy or test 'O' and 'I' immediately. High-frequency consonants like R, S, T, L, and N should be your secondary priority."
            },
            {
                "title": "Advanced Pattern Recognition",
                "text": "Watch for common letter clusters. Many 5-letter words end in <strong>-ER</strong>, <strong>-ING</strong>, or <strong>-ED</strong>. Identifying these patterns early allows you to focus your remaining guesses on the variable prefix letters."
            }
        ],
        "faqs": [
            { "question": "What is the best starting word for Wordle?", "answer": "Mathematically, 'CRANE' and 'SLATE' are among the best because they use high-frequency letters in their most common positions." },
            { "question": "How do I find words with specific letters?", "answer": "Use our 'Must Include' filter. If you need two of the same letter (like two E's), simply enter 'EE' in that field." },
            { "question": "Can I use this for Scrabble?", "answer": "Yes. Switch the dictionary toggle to 'Full' to see all valid competitive Scrabble words, including rare 5-letter hooks." }
        ],
        "patterns": [
            { "label": "5 Letter words starting with A", "query": "?pos0=A" },
            { "label": "5 Letter words ending with E", "query": "?pos4=E" }
        ],
        "guides": [
            { "label": "Vowel-Heavy Wordle Openings", "link": "#" },
            { "label": "High-Scoring Scrabble Hooks", "link": "#" },
            { "label": "Common Ending-Letter Strategies", "link": "#" }
        ]
    },
    "5-starting-a": {
        "title": "5 Letter Words Starting with A | Wordle Strategy Guide",
        "description": "Discover 5-letter words starting with A. Learn why A is a powerful starting vowel and how to use it to solve Wordle faster.",
        "h1": "5 Letter Words Starting with A",
        "subheading": "Master your opening move with these A-starting words.",
        "content": [
            {
                "title": "The Power of the 'A' Start",
                "text": "Starting with <strong>A</strong> is a classic Wordle strategy. Vowels are the skeleton of any word, and since 'A' is the second most common vowel, confirming its position early eliminates thousands of possibilities. High-frequency 'A' starts include <strong>ADIEU</strong> and <strong>ALIVE</strong>."
            },
            {
                "title": "Consonant Pairings with A",
                "text": "When your word starts with A, it is often followed by L, R, or S. Words like <strong>ALERT</strong>, <strong>ARISE</strong>, and <strong>ASSET</strong> are excellent second-turn guesses if you've confirmed the initial A."
            }
        ],
        "faqs": [
            { "question": "Is 'ADIEU' a good starting word?", "answer": "Yes, 'ADIEU' is popular because it tests four vowels at once, helping you map out the word's structure immediately." },
            { "question": "What are common A-starting patterns?", "answer": "Many 5-letter words starting with A follow the A-C-V-C-C pattern (like ABORT) or A-V-C-V-C (like ALIVE)." }
        ]
    },
    "5-ending-e": {
        "title": "5 Letter Words Ending in E | Wordle Solver Tips",
        "description": "Browse 5-letter words ending with E. Understand the 'Silent E' pattern and improve your Wordle winning streak.",
        "h1": "5 Letter Words Ending with E",
        "subheading": "Solve 'Ending in E' puzzles with expert linguistic patterns.",
        "content": [
            {
                "title": "The Silent E Mastery",
                "text": "A huge percentage of 5-letter English words end in <strong>E</strong>. This is often a 'Silent E' that modifies the preceding vowel's sound. Words like <strong>CRANE</strong>, <strong>SLATE</strong>, and <strong>THEME</strong> are prime examples of this structural necessity."
            },
            {
                "title": "Common E-Ending Suffixes",
                "text": "In Wordle, if you see a green E in the fifth slot, consider if the word is a simple noun or an infinitive verb. Patterns like <strong>-ARE</strong>, <strong>-IRE</strong>, and <strong>-ONE</strong> are extremely frequent in the official answer list."
            }
        ],
        "faqs": [
            { "question": "Why does Wordle have so many words ending in E?", "answer": "E is the most frequent letter in English. Its role in vowel modification makes it a staple for 5-letter word construction." },
            { "question": "What is the best guess for a word ending in E?", "answer": "If you know it ends in E, try testing R, S, T, and L in the 2nd and 4th positions, as in 'STARE' or 'PLATE'." }
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
    },
    "5-starting-s": {
        "title": "5 Letter Words Starting With S - Common Wordle Patterns",
        "description": "Discover 5-letter words starting with S. Learn high-frequency Wordle openers like SLATE and how to navigate consonant clusters like ST, SH, and SP effectively.",
        "canonical": "/5-letter-words-starting-with-s.html",
        "h1": "5 Letter Words Starting With S",
        "subheading": "Master the most common starting letter in Wordle with strategic S-openers.",
        "content": [
            {
                "title": "The Dominance of Starting S",
                "text": "The letter <strong>S</strong> is the most frequent starting character in the Wordle lexicon. This makes it both a blessing and a curse; while it's easy to find matches, you need a strategy to narrow down the choices. Openers like <strong>SLATE</strong> are popular because they test high-frequency vowels alongside the S anchor."
            },
            {
                "title": "Navigating S-Consonant Clusters",
                "text": "When you know a word starts with S, pay attention to clusters. <strong>ST, SH, and SP</strong> are extremely common. If your tool reveals a yellow T, testing <strong>ST-</strong> patterns early can save you multiple turns. However, beware of 'trap' words like <strong>SASSY</strong> that use rare double-consonant patterns."
            }
        ],
        "faqs": [
            { "question": "What is the best S-starting word for Wordle?", "answer": "SLATE and STARE are statistically among the best openers. They combine the common starting S with the most frequent vowels and consonants." },
            { "question": "Are S-starting words common in Scrabble?", "answer": "Absolutely. S is versatile for building hooks, though it only scores 1 point. Its value lies in board connection and pluralization." }
        ]
    },
    "5-ending-e": {
        "title": "Words Ending in E - Silent-E Wordle Strategy",
        "description": "Find 5-letter words ending in E. Master silent-E patterns and vowel-consonant balancing with expert Wordle strategies and examples like CRANE.",
        "canonical": "/5-letter-words-ending-with-e.html",
        "h1": "5 Letter Words Ending in E",
        "subheading": "Master the linguistic anchor of 5-letter words: The Silent-E.",
        "content": [
            {
                "title": "Silent-E Strategic Importance",
                "text": "The letter <strong>E</strong> is the most common ending for 5-letter English words, often functioning as a 'Silent-E' that modifies the preceding vowel. In Wordle, confirming an E at the end early on (as in <strong>CRANE</strong>) dramatically narrows the possibilities for the internal vowel structure."
            },
            {
                "title": "Vowel-Consonant Balancing",
                "text": "Words ending in E often follow a Consonant-Vowel-Consonant-Vowel pattern. When you secure the ending E, your next priority should be testing high-frequency vowels like A and I. This prevents you from wasting guesses on words that don't fit the natural phonetic flow of English suffix patterns."
            }
        ],
        "faqs": [
            { "question": "Why are so many Wordle answers ending in E?", "answer": "English morphology relies heavily on E for verb endings, adjectives, and silent-E structures. It is the most statistically likely ending for any 5-letter word." },
            { "question": "Is CRANE a good word for E-ending searches?", "answer": "Yes, CRANE is one of the top-rated Wordle openers specifically because it tests for the common E-ending while also checking high-value consonants like R and N." }
        ]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SEO_DATA, BASE_URL };
}
