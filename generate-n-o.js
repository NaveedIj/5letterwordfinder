const fs = require('fs');

const templateStr = fs.readFileSync('5-letter-words-starting-with-a.html', 'utf8');

function buildPage(letter, seoData) {
    let html = templateStr;
    const Letter = letter.toUpperCase();
    
    // 1. Title & Meta
    html = html.replace(/<title>.*?<\/title>/, `<title>${seoData.title}</title>`);
    html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${seoData.description}">`);
    html = html.replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="https://www.5letterwordfindertool.com/5-letter-words-starting-with-${letter}.html">`);
    html = html.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${seoData.title}">`);
    html = html.replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${seoData.description}">`);
    html = html.replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="https://www.5letterwordfindertool.com/5-letter-words-starting-with-${letter}.html">`);
    
    // 2. Remove dynamic SEO script logic
    html = html.replace(/<!-- SEO Logic \(Phase 3 Hardened\) -->\s*<script src="seo-data\.js" defer><\/script>\s*<script src="seoManager\.js" defer><\/script>/, '');

    // 3. Inject JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": seoData.faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
    };
    html = html.replace('</head>', `    <!-- JSON-LD Schema for SEO -->\n    <script type="application/ld+json">\n    ${JSON.stringify(jsonLd, null, 2)}\n    </script>\n</head>`);

    // 4. Update body data-letter
    html = html.replace(/data-letter="A"/, `data-letter="${Letter}"`);
    
    // 5. Update header H1
    html = html.replace(/<h1 class="title">.*?<\/h1>/, `<h1 class="title">${seoData.h1}</h1>`);
    html = html.replace(/<p class="subtitle">.*?<\/p>/, `<p class="subtitle">${seoData.subtitle}</p>`);

    // 6. Replace info section with static HTML
    let staticHtml = `
            <div class="info-content">
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 2rem; border-left: 3px solid var(--accent); padding-left: 1rem;">
                    <p style="margin: 0; margin-bottom: 0.25rem;"><strong>Last Updated:</strong> June 2026</p>
                    <p style="margin: 0;"><strong>Editorial Note:</strong> The word lists and patterns discussed in this guide are generated from standard English dictionary sources universally accepted in competitive word games and vocabulary tools.</p>
                </div>
`;
    
    seoData.sections.forEach((sec, i) => {
        const color = ['blue', 'purple', 'green'][i % 3];
        staticHtml += `                <div class="info-box ${color}">\n                    <h3>${sec.title}</h3>\n                    ${sec.html}\n                </div>\n`;
    });

    staticHtml += `                <div class="info-box blue">
                    <h3>Related Letter Combinations and Word Patterns</h3>
                    <p>Broaden your strategic vocabulary by exploring these related word lists:</p>
                    <div class="letter-grid-internal" style="margin-top: 1rem;">
                        <a href="5-letter-words-starting-with-a.html" title="5 Letter Words Starting With A">Starting With A</a>
                        <a href="5-letter-words-starting-with-e.html" title="5 Letter Words Starting With E">Starting With E</a>
                        <a href="5-letter-words-starting-with-s.html" title="5 Letter Words Starting With S">Starting With S</a>
                        <a href="4-letter-word-finder.html" title="4 Letter Word Finder">4 Letter Word Finder</a>
                        <a href="6-letter-word-finder.html" title="6 Letter Word Finder">6 Letter Word Finder</a>
                    </div>
                </div>\n`;

    // FAQs section
    staticHtml += `                <div class="info-box green">\n                    <h3>Frequently Asked Questions</h3>\n`;
    seoData.faqs.forEach(f => {
        staticHtml += `                    <div class="faq-item">\n                        <strong>${f.q}</strong>\n                        <p>${f.a}</p>\n                    </div>\n`;
    });
    staticHtml += `                </div>\n            </div>`;
    
    html = html.replace(/<div class="info-content">\s*<!-- Hydrated by seoManager\.js -->\s*<\/div>/, staticHtml);
    
    // 7. Update active letter link
    html = html.replace(/class="letter-link active">A<\/a>/, `class="letter-link ">A</a>`);
    html = html.replace(new RegExp(`class="letter-link ">${Letter}</a>`), `class="letter-link active">${Letter}</a>`);

    // 8. Update H2 list title
    html = html.replace(/<h2>List of 5 Letter Words Starting With A<\/h2>/, `<h2>List of 5 Letter Words Starting With ${Letter}</h2>`);
    
    // 9. Update JS letter variable
    html = html.replace(/const letter = 'a';/, `const letter = '${letter}';`);

    fs.writeFileSync(`5-letter-words-starting-with-${letter}.html`, html, 'utf8');
    console.log(`Generated ${letter}.html`);
}

const nData = {
    title: "5 Letter Words Starting With N - Word Finder Tool",
    description: "Discover 5 letter words starting with N. Use our dynamic list and Word Finder Tool to solve your Wordle puzzles quickly and efficiently.",
    h1: "5 Letter Words Starting With N",
    subtitle: "Discover the best 5 letter words starting with N to win your next word game.",
    sections: [
        {
            title: "The Power of 5 Letter Words Starting With N",
            html: "<p>The letter N is a widely used consonant in the English language, making it a very common starting letter for 5-letter words. It connects effortlessly with almost every vowel, providing a great starting point when you are trying to figure out the structure of your Wordle puzzle.</p><p>Because it is frequently paired with common vowels, guessing a word starting with N gives you a statistical advantage in uncovering the core vowels of the hidden word. Whether you are playing Wordle, Scrabble, or any other word game, understanding the common words starting with N is a powerful tool to have in your vocabulary arsenal.</p>"
        },
        {
            title: "Common Patterns Found in 5 Letter Words Starting With N",
            html: "<p>Words starting with N often follow predictable vowel combinations:</p><ul class=\"clean-list\"><li><strong>The NE- Pattern:</strong> Very common, featuring words like NEVER, NERVE, NEEDS, and NEIGH.</li><li><strong>The NO- Pattern:</strong> Highly frequent, with staples like NORTH, NOBLE, NOVEL, and NOISE.</li><li><strong>The NA- Pattern:</strong> Includes everyday words such as NAVAL, NAIVE, NAKED, and NASTY.</li><li><strong>The NI- Pattern:</strong> Features words like NIGHT, NINJA, NINTH, and NICHE.</li><li><strong>The NU- Pattern:</strong> Less common but includes NURSE, NUMBS, and NULLS.</li></ul>"
        },
        {
            title: "Most Useful 5 Letter Words Starting With N",
            html: "<p>If you have confirmed that your word starts with an N, these are excellent strategic choices:</p><ul class=\"clean-list\"><li><strong>NIGHT:</strong> Tests the 'IGH' pattern and the common letter T.</li><li><strong>NORTH:</strong> Great for testing the 'OR' combination and the letters T and H.</li><li><strong>NEVER:</strong> Useful for testing the double E and the letter R.</li><li><strong>NOISE:</strong> An exceptional word for testing three common vowels (O, I, E) and the letter S.</li><li><strong>NAIVE:</strong> Tests three vowels (A, I, E) and the letter V.</li></ul>"
        },
        {
            title: "Wordle Strategy Using N Words",
            html: "<p>When your first tile turns green with an N, your primary goal is to identify the following vowel. Using a word like NOISE or NAIVE is an incredibly strong follow-up play because it rapidly tests the most common vowels that pair with N.</p><p>Once you identify the vowel, look at common endings. Many N-words end in E (NOBLE, NERVE) or T (NIGHT, NORTH). Identifying the vowel and the ending consonant will often leave you with only one or two possible solutions.</p>"
        },
        {
            title: "Scrabble Strategy Using N Words",
            html: "<p>In Scrabble, the N tile is worth 1 point. It is a highly versatile 'glue' letter that can be used to hook onto existing words or extend them. Because N is so common, it is easy to play in parallel to other words to score multiple times in a single turn.</p><p>Look for opportunities to combine an N-word with high-value tiles. For example, playing NINJA utilizes the 8-point J, while NAVAL utilizes the 4-point V.</p>"
        },
        {
            title: "How to Use This Word List Effectively",
            html: "<p>Use our dynamic Word Finder Tool to filter the possibilities:</p><ul class=\"clean-list\"><li><strong>Must Include:</strong> Enter any yellow letters you've found into the 'Must include' input to narrow down the list.</li><li><strong>Excluded:</strong> Enter all your gray letters into the 'Excluded' input to instantly remove invalid words.</li><li><strong>Sort:</strong> Use the sorting options to organize words alphabetically or by their Scrabble point value.</li></ul>"
        }
    ],
    faqs: [
        { q: "How many 5-letter words start with N?", a: "There are over 200 valid 5-letter words starting with N in standard English dictionaries." },
        { q: "What is the best 5-letter word starting with N for Wordle?", a: "NOISE is widely considered one of the best choices because it tests three highly common vowels (O, I, E) alongside the common consonant S." },
        { q: "What are the most common second letters after N?", a: "Vowels (E, O, A, I, U) are the most common second letters, as N rarely forms initial consonant clusters." },
        { q: "Are there 5-letter words starting with double N?", a: "No, there are no valid 5-letter words in standard English dictionaries that begin with a double N." },
        { q: "What is a high-scoring 5-letter word starting with N in Scrabble?", a: "NINJA is an excellent choice, scoring 12 base points due to the high-value J tile." }
    ]
};

const oData = {
    title: "5 Letter Words Starting With O - Word Finder Tool",
    description: "Discover 5 letter words starting with O. Use our dynamic list and Word Finder Tool to solve your Wordle puzzles quickly and efficiently.",
    h1: "5 Letter Words Starting With O",
    subtitle: "Discover the best 5 letter words starting with O to win your next word game.",
    sections: [
        {
            title: "The Power of 5 Letter Words Starting With O",
            html: "<p>Starting a 5-letter word with the vowel O presents a unique scenario in word games. Because O is one of the most common vowels, having it in the first position immediately narrows down the structure of the word. Words starting with O frequently alternate vowels and consonants, making them somewhat predictable once the first letter is known.</p><p>In games like Wordle, finding an O in the first slot is a strong signal to start testing common consonants that follow it, such as R, U, N, and T.</p>"
        },
        {
            title: "Common Patterns Found in 5 Letter Words Starting With O",
            html: "<p>Words starting with O often follow specific vowel-consonant groupings:</p><ul class=\"clean-list\"><li><strong>The OU- Pattern:</strong> Very frequent, featuring words like OUNCE, OUTER, OUTGO, and OUTDO.</li><li><strong>The OR- Pattern:</strong> Extremely common in words like ORDER, ORGAN, ORBIT, and ORTHO.</li><li><strong>The OP- Pattern:</strong> Includes words like OPERA, OPTIC, OPINE, and OPIUM.</li><li><strong>The OF- Pattern:</strong> Found in words like OFTEN, OFFER, and OFFAL.</li><li><strong>The OT- Pattern:</strong> Features words like OTHER, OTTER, and OUGHT.</li></ul>"
        },
        {
            title: "Most Useful 5 Letter Words Starting With O",
            html: "<p>When you need to test letters after discovering an initial O, consider these strategic choices:</p><ul class=\"clean-list\"><li><strong>OUTER:</strong> Tests the highly common U, T, E, and R, making it incredibly effective for uncovering the remaining structure.</li><li><strong>OTHER:</strong> Tests T, H, E, and R, which are some of the most frequent consonants and vowels in English.</li><li><strong>ORGAN:</strong> Excellent for testing the common 'AN' ending along with R and G.</li><li><strong>ONION:</strong> Useful for checking for double O's and double N's.</li><li><strong>OUNCE:</strong> Tests U, N, C, and E, providing a solid mix of vowels and consonants.</li></ul>"
        },
        {
            title: "Wordle Strategy Using O Words",
            html: "<p>If your first guess reveals a green O in the first position, your next move should focus on identifying the immediate following letter. Words like OUTER and OTHER are fantastic second guesses because they deploy a barrage of high-frequency letters (T, E, R, U, H).</p><p>Keep an eye out for double letters. Words starting with O sometimes feature a double consonant in the middle (OFFER, OTTER) or double O's (ONION, OZONE). Identifying these patterns early will save you valuable guesses.</p>"
        },
        {
            title: "Scrabble Strategy Using O Words",
            html: "<p>In Scrabble, the O tile is worth 1 point. While not a high scorer itself, words starting with O are excellent for utilizing high-value consonants. For instance, playing OZONE utilizes the 10-point Z tile, and OXYGEN utilizes the 8-point X and 4-point Y.</p><p>Look for opportunities to place these high-value tiles on Double or Triple Letter Score squares to maximize your points.</p>"
        },
        {
            title: "How to Use This Word List Effectively",
            html: "<p>Use our dynamic Word Finder Tool to filter the possibilities:</p><ul class=\"clean-list\"><li><strong>Must Include:</strong> Enter any yellow letters you've found into the 'Must include' input to narrow down the list.</li><li><strong>Excluded:</strong> Enter all your gray letters into the 'Excluded' input to instantly remove invalid words.</li><li><strong>Sort:</strong> Use the sorting options to organize words alphabetically or by their Scrabble point value.</li></ul>"
        }
    ],
    faqs: [
        { q: "How many 5-letter words start with O?", a: "There are approximately 150 valid 5-letter words starting with O in standard English dictionaries." },
        { q: "What is the best 5-letter word starting with O for Wordle?", a: "OUTER and OTHER are widely considered some of the best choices because they test incredibly common letters like T, E, R, and U or H." },
        { q: "What are the most common second letters after O?", a: "Consonants like R, U, P, F, and T are very common second letters in words starting with O." },
        { q: "Are there 5-letter words starting with double O?", a: "Words starting with double O are extremely rare and typically not found in standard 5-letter word lists. Examples like OOMPH exist but are uncommon." },
        { q: "What is a high-scoring 5-letter word starting with O in Scrabble?", a: "OXYGEN is an exceptionally high-scoring word, netting 16 base points due to the X and Y tiles." }
    ]
};

buildPage('n', nData);
buildPage('o', oData);
