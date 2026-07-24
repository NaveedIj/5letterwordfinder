const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Fix double closing quotes in meta tags (`">>`)
    content = content.replace(/content="([^"]*)">>/g, 'content="$1">');

    // 2. Fix duplicate comment headers
    content = content.replace(/<!-- ======================== INFO CARDS ======================== -->\s*<!-- ======================== INFO CARDS ======================== -->/g, '<!-- ======================== INFO CARDS ======================== -->');

    // 3. Fix premature </main> in 5-letter-words-ending-with-e.html
    if (file === '5-letter-words-ending-with-e.html') {
        const mainCloseIndex = content.indexOf('</main>');
        const containerCloseIndex = content.indexOf('</div><!-- end .container -->');
        if (mainCloseIndex !== -1 && containerCloseIndex !== -1 && mainCloseIndex < containerCloseIndex) {
            content = content.replace('</main>', '');
            content = content.replace('</div><!-- end .container -->', '</div><!-- end .container -->\n    </main>');
        }
    }

    // 4. Fix duplicate dynamic SEO sections in ending-with-s/t/y
    const duplicateDynamicPattern = /<!-- Dynamic SEO Section -->\s*<section class="info-section">\s*<div class="info-content">\s*<!-- Hydrated by seoManager\.js -->\s*<\/div>\s*<\/section>\s*<\/div>\s*<!-- Dynamic SEO Section -->\s*<section class="info-section">\s*<div class="info-content">\s*<!-- Hydrated by seoManager\.js -->\s*<\/div>\s*<\/section>/g;
    
    content = content.replace(duplicateDynamicPattern, `<!-- Dynamic SEO Section -->
        <section class="info-section">
            <div class="info-content">
                <!-- Hydrated by seoManager.js -->
            </div>
        </section>`);

    // 5. Fix malformed word grids (word items spilling outside #wordGrid)
    if (file.startsWith('5-letter-words-starting-with-')) {
        const gridRegex = /(<div id="wordGrid" class="word-grid">)([\s\S]*?)(<\/div>\s*)([\s\S]*?)(<details>|<h2>Internal Navigation<\/h2>|<div class="letter-nav">)/i;
        const match = content.match(gridRegex);
        if (match && match[4].includes('<div class="word-item">')) {
            const openTag = match[1];
            const insideGrid = match[2];
            const spilledContent = match[4];
            const endMarker = match[5];
            
            // Reassemble so all word-items are inside wordGrid
            const fixedBlock = `${openTag}${insideGrid}${spilledContent}\n        </div>\n        ${endMarker}`;
            content = content.replace(match[0], fixedBlock);
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${file}`);
    }
});
