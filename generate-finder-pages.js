/**
 * Build 3 / 4 / 6 / 7 / 8 letter finder pages from index.html
 * Run: node generate-finder-pages.js
 */
const fs = require('fs');

const ORD = { 3: 'Three', 4: 'Four', 6: 'Six', 7: 'Seven', 8: 'Eight' };
const ord = { 3: 'three', 4: 'four', 6: 'six', 7: 'seven', 8: 'eight' };

function buildCharInputs(n) {
    return Array.from({ length: n }, (_, i) => {
        const af = i === 0 ? ' autofocus' : '';
        return `                    <input type="text" class="char-input" maxlength="1" autocomplete="off" spellcheck="false"${af} id="pos${i}" aria-label="Letter position ${i + 1}">`;
    }).join('\n');
}

function buildWrongInputs(n) {
    return Array.from({ length: n }, (_, i) =>
        `                    <input type="text" class="wrong-pos-input" maxlength="2" placeholder="-" autocomplete="off" spellcheck="false" id="w${i}" aria-label="Wrong position letters for slot ${i + 1}">`
    ).join('\n');
}

const tpl = fs.readFileSync('index.html', 'utf8');

for (const n of [3, 4, 6, 7, 8]) {
    let html = tpl;

    // 1. Update Body Attributes for SEO Hydration
    html = html.replace(/<body[^>]*>/, `<body data-word-length="${n}" data-pattern="length" data-seo-strategy="WORDLE_SOLVER" style="--word-len: ${n};">`);

    const O = ORD[n];
    const o = ord[n];

    // 2. Update Basic Metadata
    html = html.replace(
        /<title>[\s\S]*?<\/title>/,
        `<title>${O} Letter Word Finder - Solver &amp; Unscrambler</title>`
    );
    html = html.replace(
        /<meta name="description" content="[^"]*">/,
        `<meta name="description" content="Filter ${o}-letter words with green, yellow, and gray logic, Scrabble scores, and sorting. Runs in your browser-no sign-up.">`
    );
    html = html.replace(
        /<meta name="keywords" content="[^"]*">/,
        `<meta name="keywords" content="${n} letter word finder, ${o} letter words, word solver, unscrambler">`
    );

    // 3. Update Headings
    html = html.replace(/<h1 class="title">[^<]+<\/h1>/, `<h1 class="title">${O} Letter Word Finder</h1>`);
    html = html.replace(
        /<p class="subtitle">[^<]+<\/p>/,
        `<p class="subtitle">Same filters as our Wordle helper-tuned for ${o}-letter words.</p>`
    );

    // 4. Update Filter Grids
    html = html.replace(
        /<div class="pattern-grid" id="patternGrid">[\s\S]*?<\/div>/,
        `<div class="pattern-grid" id="patternGrid">\n${buildCharInputs(n)}\n                </div>`
    );

    html = html.replace(
        /<div class="wrong-pos-grid" id="wrongPosGrid">[\s\S]*?<\/div>/,
        `<div class="wrong-pos-grid" id="wrongPosGrid">\n${buildWrongInputs(n)}\n                </div>`
    );

    // 5. Update Footer Branding
    html = html.replace(
        /<h3 class="footer-logo">[^<]+<\/h3>/,
        `<h3 class="footer-logo">${O} Letter Word Finder</h3>`
    );
    html = html.replace(
        /<p class="footer-copyright">[^<]+<\/p>/,
        `<p class="footer-copyright">&copy; 2026 ${O} Letter Word Finder. All Rights Reserved.</p>`
    );

    // 6. Update Script Inclusion
    html = html.replace(
        /<script src="\.\/words\.js"><\/script>\s*\r?\n\s*<script src="\.\/script\.js"><\/script>/,
        '<script src="words-by-length.js"></script>\n    <script src="script.js"></script>'
    );

    // 7. Navigation Highlighting
    const fname = `${n}-letter-word-finder.html`;
    html = html.replace(/nav-link nav-link--current/g, 'nav-link');

    const navHrefs = [3, 4, 5, 6, 7, 8].map(
        len => (len === 5 ? 'index.html' : `${len}-letter-word-finder.html`)
    );
    const thisHref = fname;
    for (const href of navHrefs) {
        if (href === thisHref) {
            html = html.replace(
                new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" class="nav-link"`, 'g'),
                `href="${href}" class="nav-link nav-link--current"`
            );
            break;
        }
    }

    // 8. Clean up index-specific SEO content to allow hydration
    // We keep the container .info-content but let seoManager.js fill it.
    // If we want a fallback, we can leave the index content there.

    fs.writeFileSync(fname, html, 'utf8');
    console.log('Wrote', fname);
}
