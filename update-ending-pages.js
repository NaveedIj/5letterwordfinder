const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.startsWith('5-letter-words-ending-with-') && f.endsWith('.html'));

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    const letterMatch = file.match(/ending-with-([a-z])\.html/i);
    if (!letterMatch) return;
    const letter = letterMatch[1].toUpperCase();

    console.log(`Processing ${file} (Letter: ${letter})`);

    // 1. Inject SEO Scripts into head if missing
    if (!html.includes('seoManager.js')) {
        html = html.replace('</head>', '    <!-- SEO Logic -->\n    <script src="seo-data.js" defer></script>\n    <script src="seoManager.js" defer></script>\n</head>');
    }

    // 2. Update Body Attributes
    html = html.replace(/<body([^>]*)>/, (match, attrs) => {
        let newAttrs = attrs;
        if (!attrs.includes('data-pattern')) newAttrs += ' data-pattern="ending"';
        if (!attrs.includes('data-letter')) newAttrs += ` data-letter="${letter}"`;
        if (!attrs.includes('data-seo-strategy')) newAttrs += ' data-seo-strategy="WORDLE_SOLVER"';
        return `<body${newAttrs}>`;
    });

    // 3. Replace hardcoded FAQ section with dynamic container
    // The FAQ section starts with <section class="faq-section" ...> and ends before </div><!-- end .container -->
    const faqRegex = /<section class="faq-section"[\s\S]*?<\/section>/;
    const dynamicSection = `
        <!-- Dynamic SEO Section -->
        <section class="info-section">
            <div class="info-content">
                <!-- Hydrated by seoManager.js -->
            </div>
        </section>`;
    
    if (faqRegex.test(html)) {
        html = html.replace(faqRegex, dynamicSection);
    } else {
        // Fallback: inject before footer or end of main
        html = html.replace('</main>', `${dynamicSection}\n</main>`);
    }

    fs.writeFileSync(file, html, 'utf8');
    console.log(`Updated ${file}`);
});
