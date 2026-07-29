/**
 * Build 3 / 4 / 6 / 7 / 8 letter finder pages from index.html
 * Refactored for Phase 3.2: Hybrid Pre-Rendering & HTML Parity
 */
const fs = require('fs');
const path = require('path');

// Dynamically import SEO_DATA
let SEO_DATA = {};
try {
    const seoDataPath = path.join(__dirname, 'seo-data.js');
    const seoDataModule = require(seoDataPath);
    if (seoDataModule && seoDataModule.SEO_DATA) {
        SEO_DATA = seoDataModule.SEO_DATA;
    }
} catch (err) {
    console.error("Warning: Could not load seo-data.js module. Pre-rendering may fail.", err);
}

const ORD = { 3: 'Three', 4: 'Four', 6: 'Six', 7: 'Seven', 8: 'Eight' };
const ord = { 3: 'three', 4: 'four', 6: 'six', 7: 'seven', 8: 'eight' };

function buildCharInputs(n) {
    return Array.from({ length: n }, (_, i) => {
        const af = i === 0 ? ' autofocus' : '';
        return `                        <input type="text" class="char-input" maxlength="1" autocomplete="off" spellcheck="false"${af} id="pos${i}" aria-label="Letter position ${i + 1}">`;
    }).join('\n');
}

function buildWrongInputs(n) {
    return Array.from({ length: n }, (_, i) =>
        `                        <input type="text" class="wrong-pos-input" maxlength="2" placeholder="-" autocomplete="off" spellcheck="false" id="w${i}" aria-label="Wrong position letters for slot ${i + 1}">`
    ).join('\n');
}

function generatePreRenderedSeoHtml(dataKey) {
    const data = SEO_DATA[dataKey];
    if (!data) return '';

    let html = `\n            <!-- PRE-RENDERED SEO CONTENT SECTION -->\n            <section class="seo-guide-section" style="margin-top: 4rem;">\n`;
    
    if (data.h1 || data.subheading) {
        html += `                <div class="info-section-header">\n`;
        if (data.h1) html += `                    <h2 class="info-section-title">${data.h1}</h2>\n`;
        if (data.subheading) html += `                    <p class="info-section-sub">${data.subheading}</p>\n`;
        html += `                </div>\n\n`;
    }

    if (data.content && Array.isArray(data.content)) {
        html += `                <div class="info-content">\n`;
        data.content.forEach((section, index) => {
            const colorClass = index % 2 === 0 ? 'blue' : 'purple';
            html += `                    <div class="info-box ${colorClass}">\n                        <h3>${section.title}</h3>\n                        <p>${section.text}</p>\n                    </div>\n`;
        });
        
        if (data.faqs && Array.isArray(data.faqs)) {
            html += `                    <div class="info-box green">\n                        <h3>Frequently Asked Questions</h3>\n`;
            data.faqs.forEach(faq => {
                html += `                        <div class="faq-item">\n                            <strong>${faq.question}</strong>\n                            <p>${faq.answer}</p>\n                        </div>\n`;
            });
            html += `                    </div>\n`;
        }
        html += `                </div>\n`;
    }
    
    html += `            </section>\n`;
    return html;
}

function generateJsonLd(dataKey) {
    const data = SEO_DATA[dataKey];
    if (!data || !data.faqs) return '';

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
            }
        }))
    };
    return `\n    <!-- JSON-LD Schema for SEO -->\n    <script type="application/ld+json">\n    ${JSON.stringify(schema, null, 2)}\n    </script>\n`;
}

const tpl = fs.readFileSync('index.html', 'utf8');

for (const n of [3, 6]) {
    let html = tpl;
    const O = ORD[n];
    const o = ord[n];
    const dataKey = n.toString();
    const data = SEO_DATA[dataKey] || {};

    // 1. Update Body Attributes
    html = html.replace(/<body[^>]*>/, `<body data-word-length="${n}" data-pattern="length" data-seo-strategy="WORDLE_SOLVER" style="--word-len: ${n};">`);

    // 2. Update Basic Metadata & Canonical
    const canonicalUrl = `https://www.5letterwordfindertool.com/${n}-letter-word-finder.html`;
    html = html.replace(
        /<link rel="canonical" href="[^"]*">/,
        `<link rel="canonical" href="${canonicalUrl}">`
    );

    const title = data.title || `${O} Letter Word Finder - Solver &amp; Unscrambler`;
    const description = data.description || `Filter ${o}-letter words with green, yellow, and gray logic, Scrabble scores, and sorting. Runs in your browser-no sign-up.`;
    
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="description"[\s\S]*?content="[^"]*">/, `<meta name="description"\n        content="${description}">`);
    html = html.replace(/<meta name="keywords"\s*content="[^"]*">/, `<meta name="keywords"\n        content="${n} letter word finder, ${o} letter words, word solver, unscrambler">`);

    // Open Graph
    html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`);
    html = html.replace(/<meta property="og:description"[\s\S]*?content="[^"]*">/, `<meta property="og:description"\n        content="${description}">`);
    html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonicalUrl}">`);

    // Twitter
    html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${title}">`);
    html = html.replace(/<meta name="twitter:description"[\s\S]*?content="[^"]*">/, `<meta name="twitter:description"\n        content="${description}">`);

    // JSON-LD Schema
    // 1. Update WebPage entity inside @graph to be page-specific
    html = html.replace(
        /"@type": "WebPage",\s*"@id": "[^"]*",\s*"url": "[^"]*",\s*"name": "[^"]*",\s*"description": "[^"]*"/,
        `"@type": "WebPage",\n          "@id": "${canonicalUrl}#webpage",\n          "url": "${canonicalUrl}",\n          "name": "${title.replace(/"/g, '\\"')}",\n          "description": "${description.replace(/"/g, '\\"')}"`
    );

    // 2. Consolidate FAQPage into @graph entity (replace homepage placeholder FAQ entity inside @graph)
    if (data.faqs && Array.isArray(data.faqs)) {
        const pageFaqEntity = JSON.stringify({
            "@type": "FAQPage",
            "@id": `${canonicalUrl}#faq`,
            "mainEntity": data.faqs.map(f => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.answer
                }
            }))
        }, null, 10).split('\n').map(line => '        ' + line).join('\n').trim();

        html = html.replace(
            /\{\s*"@type": "FAQPage",\s*"@id": "[^"]*#faq",\s*"mainEntity": \[\s*[\s\S]*?\s*\]\s*\}/,
            pageFaqEntity
        );
    }

    // Clean up old standalone JSON-LD FAQ blocks if any present in template
    html = html.replace(/<!-- JSON-LD Schema for SEO -->[\s\S]*?<\/script>\s*/g, '');

    // 3. Update Headings & Tagline
    const h1 = data.h1 || `${O} Letter Word Finder`;
    const tagline = data.tagline || 'Your Secret Weapon for Wordle Wins';
    const subheading = data.subheading || `Same filters as our Wordle helper-tuned for ${o}-letter words.`;
    html = html.replace(/<h1 class="title">[^<]+<\/h1>/, `<h1 class="title">${h1}</h1>`);
    html = html.replace(/<p class="tagline">[^<]+<\/p>/, `<p class="tagline">${tagline}</p>`);
    html = html.replace(/<p class="subtitle">[^<]+<\/p>/, `<p class="subtitle">${subheading}</p>`);

    // 4. Update Filter Grids
    html = html.replace(
        /<div class="pattern-grid" id="patternGrid">[\s\S]*?<\/div>/,
        `<div class="pattern-grid" id="patternGrid">\n${buildCharInputs(n)}\n                    </div>`
    );

    html = html.replace(
        /<div class="wrong-pos-grid" id="wrongPosGrid">[\s\S]*?<\/div>/,
        `<div class="wrong-pos-grid" id="wrongPosGrid">\n${buildWrongInputs(n)}\n                    </div>`
    );

    // 5. Update Footer Branding
    html = html.replace(/<h3 class="footer-logo">[^<]+<\/h3>/, `<h3 class="footer-logo">${O} Letter Word Finder</h3>`);
    // Assuming copyright is in footer-bottom-bar, no need to change it as it is generic "Word Finder Tool" in index.html

    // 6. Navigation Highlighting
    const fname = `${n}-letter-word-finder.html`;
    html = html.replace(/nav-link nav-link--current/g, 'nav-link');
    const navHrefs = ['3-letter-word-finder.html', '4-letter-word-finder.html', '/', '6-letter-word-finder.html', '7-letter-word-finder.html', '8-letter-word-finder.html'];
    const thisHref = n === 5 ? '/' : fname;
    for (const href of navHrefs) {
        if (href === thisHref) {
            html = html.replace(
                new RegExp(`href="${href === '/' ? '/' : href}" class="nav-link"`, 'g'),
                `href="${href === '/' ? '/' : href}" class="nav-link nav-link--current"`
            );
        }
    }

    // 7. Inject Pre-rendered SEO Content safely, replacing index.html templates
    // First, remove the SEO templates and placeholders from index.html copy
    const seoSectionsRegex = /<!-- ======================== SEO CONTENT SECTION ======================== -->[\s\S]*?<\/div><!-- end \.container -->/g;
    
    const parts = html.split('<!-- ======================== SEO CONTENT SECTION ======================== -->');
    if (parts.length > 1) {
        // Strip everything up to </div><!-- end .container -->
        const endContainerIndex = parts[1].indexOf('</div><!-- end .container -->');
        if (endContainerIndex !== -1) {
            const preRenderedHtml = generatePreRenderedSeoHtml(dataKey);
            html = parts[0] + preRenderedHtml + '\n\n        ' + parts[1].substring(endContainerIndex);
        }
    } else {
        // Fallback: inject before end of container if tags not found
        const containerEnd = html.lastIndexOf('</div><!-- end .container -->');
        if (containerEnd !== -1) {
            html = html.substring(0, containerEnd) + generatePreRenderedSeoHtml(dataKey) + '\n        ' + html.substring(containerEnd);
        }
    }
    
    // 8. Clean up results-list malformed HTML just in case
    const malformedResultsListRegex = /<div class="results-list" id="resultsList">\s*<!-- Results generated by JS -->\s*<\/div>(?:\s*<div class="word-item skeleton"><\/div>)*\s*<\/div>/g;
    html = html.replace(malformedResultsListRegex, `<div class="results-list" id="resultsList">\n                        <!-- Results generated by JS -->\n                    </div>`);


    fs.writeFileSync(fname, html, 'utf8');
    console.log(`Wrote pre-rendered HTML to ${fname}`);
}
