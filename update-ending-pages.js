/**
 * Update Specific Priority SEO Landing Pages
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

// Priority Batch 1 Pages
const targetFiles = [
    '5-letter-words-starting-with-s.html',
    '5-letter-words-ending-with-e.html'
];

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


targetFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file} - Not found.`);
        return;
    }
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Determine letter and pattern
    let letter = '';
    let pattern = '';
    let dataKey = '';
    
    if (file.includes('ending-with-')) {
        const match = file.match(/ending-with-([a-z])\.html/i);
        if (match) {
            letter = match[1].toUpperCase();
            pattern = 'ending';
            dataKey = `5-ending-${letter.toLowerCase()}`;
        }
    } else if (file.includes('starting-with-')) {
        const match = file.match(/starting-with-([a-z])\.html/i);
        if (match) {
            letter = match[1].toUpperCase();
            pattern = 'starting';
            dataKey = `5-starting-${letter.toLowerCase()}`;
        }
    }

    console.log(`Processing ${file} (Letter: ${letter}, Pattern: ${pattern})`);

    // 1. Inject SEO Scripts into head if missing
    if (!html.includes('seoManager.js')) {
        html = html.replace('</head>', '    <!-- SEO Logic -->\n    <script src="seo-data.js" defer></script>\n    <script src="seoManager.js" defer></script>\n</head>');
    }

    // 2. Update Body Attributes safely
    html = html.replace(/<body([^>]*)>/, (match, attrs) => {
        let newAttrs = attrs;
        // Strip existing to avoid duplicates, then re-add
        newAttrs = newAttrs.replace(/\s*data-pattern="[^"]*"/g, '');
        newAttrs = newAttrs.replace(/\s*data-letter="[^"]*"/g, '');
        newAttrs = newAttrs.replace(/\s*data-seo-strategy="[^"]*"/g, '');
        
        newAttrs += ` data-pattern="${pattern}" data-letter="${letter}" data-seo-strategy="WORDLE_SOLVER"`;
        return `<body${newAttrs}>`;
    });

    // 3. Clean up the malformed results list (remove skeletons and extra div)
    const malformedRegex = /<div class="results-list" id="resultsList">\s*<!-- Results generated by JS -->\s*<\/div>(?:\s*<div class="word-item skeleton"><\/div>)*\s*<\/div>/g;
    const cleanResultsList = `<div class="results-list" id="resultsList">\n                        <!-- Results generated by JS -->\n                    </div>`;
    html = html.replace(malformedRegex, cleanResultsList);

    // 4. Remove all legacy SEO sections to ensure absolute idempotence and no duplication
    // We target everything between the end of the main-grid and </main>
    const parts = html.split('</main>');
    if (parts.length > 1) {
        let beforeMain = parts[0];
        
        // Find where the main grid actually ends (after the results-card section and its closing div)
        // Let's be very careful: </section>\n            </div>
        const endOfMainGridRegex = /<\/section>\s*<\/div>\s*<!--/g;
        // Actually, let's just strip known SEO containers
        const knownContainers = [
            /<!-- UNIQUE FAQ SECTION - STANDALONE FULL WIDTH -->[\s\S]*?(?=<\/main>)/,
            /<!-- Dynamic SEO Section -->[\s\S]*?(?=<\/main>)/g,
            /<section class="seo-guide-section"[\s\S]*?(?=<\/main>)/,
            /<!-- PRE-RENDERED SEO CONTENT SECTION -->[\s\S]*?(?=<\/main>)/
        ];
        
        knownContainers.forEach(regex => {
            beforeMain = beforeMain.replace(regex, '');
        });
        
        // Also strip stray closing divs that might be left behind before </main>
        // Clean up any extra whitespace and isolated </div>s at the end of beforeMain
        beforeMain = beforeMain.replace(/(<\/div>\s*)+$/, '</div>\n');

        // Inject new SEO HTML
        const newSeoHtml = generatePreRenderedSeoHtml(dataKey);
        html = beforeMain + newSeoHtml + '\n    </main>' + parts[1];
    }

    // 5. Inject JSON-LD Schema
    html = html.replace(/<!-- JSON-LD Schema for SEO -->[\s\S]*?<\/script>\s*/g, ''); // Remove existing
    const jsonLd = generateJsonLd(dataKey);
    if (jsonLd) {
        html = html.replace('</head>', `${jsonLd}</head>`);
    }

    // 6. Update Meta Titles and Descriptions
    const data = SEO_DATA[dataKey] || {};
    if (data.title) html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${data.title}</title>`);
    if (data.description) html = html.replace(/<meta name="description"[\s\S]*?content="[^"]*">/, `<meta name="description"\n        content="${data.description}">`);
    if (data.canonical) html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="https://www.5letterwordfindertool.com${data.canonical}">`);

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Updated ${file} successfully.`);
});
