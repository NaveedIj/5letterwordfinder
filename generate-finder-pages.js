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
        `                    <input type="text" class="wrong-pos-input" maxlength="2" placeholder="–" autocomplete="off" spellcheck="false" id="w${i}" aria-label="Wrong position letters for slot ${i + 1}">`
    ).join('\n');
}

function greenArticle(n, O, o) {
    return `<article class="info-box green">
                    <div class="card-status-bar green"></div>
                    <h2>
                        <div class="info-icon-wrapper green">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <path d="M9 3v18"></path>
                                <path d="M15 3v18"></path>
                                <path d="M3 9h18"></path>
                                <path d="M3 15h18"></path>
                            </svg>
                        </div>
                        ${O}-letter puzzles
                    </h2>
                    <p>Built for crosswords, Spelling Bee–style games, and any puzzle with exactly ${n} letters.</p>
                    <p>For Wordle-style <strong>strict</strong> answers, use the <a href="index.html" style="color: var(--accent-light); font-weight: 600;">5-letter finder</a>.</p>
                </article>`;
}

const tpl = fs.readFileSync('index.html', 'utf8');

for (const n of [3, 4, 6, 7, 8]) {
    let html = tpl;

    html = html.replace(/<body[^>]*>/, `<body data-word-length="${n}" style="--word-len: ${n};">`);

    const O = ORD[n];
    const o = ord[n];

    html = html.replace(
        /<title>[\s\S]*?<\/title>/,
        `<title>${O} Letter Word Finder — Solver &amp; Unscrambler</title>`
    );
    html = html.replace(
        /<meta name="description" content="[^"]*">/,
        `<meta name="description" content="Filter ${o}-letter words with green, yellow, and gray logic, Scrabble scores, and sorting. Runs in your browser—no sign-up.">`
    );
    html = html.replace(
        /<meta name="keywords" content="[^"]*">/,
        `<meta name="keywords" content="${n} letter word finder, ${o} letter words, word solver, unscrambler">`
    );

    html = html.replace(/<h1 class="title">[^<]+<\/h1>/, `<h1 class="title">${O} Letter Word Finder</h1>`);

    html = html.replace(
        /<p class="subtitle">[^<]+<\/p>/,
        `<p class="subtitle">Same filters as our Wordle helper—tuned for ${o}-letter words.</p>`
    );

    html = html.replace(
        /<div class="pattern-grid" id="patternGrid">[\s\S]*?<\/div>/,
        `<div class="pattern-grid" id="patternGrid">\n${buildCharInputs(n)}\n                </div>`
    );

    html = html.replace(
        /<div class="wrong-pos-grid" id="wrongPosGrid">[\s\S]*?<\/div>/,
        `<div class="wrong-pos-grid" id="wrongPosGrid">\n${buildWrongInputs(n)}\n                </div>`
    );

    html = html.replace(
        /<h3 class="footer-logo">[^<]+<\/h3>/,
        `<h3 class="footer-logo">${O} Letter Word Finder</h3>`
    );

    html = html.replace(
        /<p class="footer-copyright">[^<]+<\/p>/,
        `<p class="footer-copyright">&copy; 2026 ${O} Letter Word Finder. All Rights Reserved.</p>`
    );

    html = html.replace(
        /<script src="words\.js"><\/script>\s*\r?\n\s*<script src="script\.js"><\/script>/,
        '<script src="words-by-length.js"></script>\n    <script src="script.js"></script>'
    );

    html = html.replace(
        /<p>The ultimate <strong>5 letter word finder<\/strong> for enthusiasts[^<]*<\/p>\s*<p>Our list includes thousands of five-letter words[^<]*<\/p>/,
        `<p>A fast <strong>${o}-letter word finder</strong> for puzzles, Scrabble-style games, and vocabulary practice.</p>\n                    <p>Our list includes thousands of ${o}-letter English words with live filtering.</p>`
    );

    html = html.replace(
        /<li><strong>Strict Mode:<\/strong> Toggle for official Wordle-only answers\.<\/li>/,
        `<li><strong>Dictionary:</strong> Full ${o}-letter list on this page (Wordle “strict” mode is on the 5-letter finder only).</li>`
    );

    html = html.replace(
        /<article class="info-box green">[\s\S]*?<\/article>/,
        greenArticle(n, O, o)
    );

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

    fs.writeFileSync(fname, html, 'utf8');
    console.log('Wrote', fname);
}
