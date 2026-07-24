const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const issues = {
    malformedMetaQuotes: [],
    prematureMainCloses: [],
    duplicateDynamicSeoSections: [],
    malformedWordGrids: [],
    duplicateComments: []
};

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. Double closing quotes in meta tags (`">>`)
    if (/content="[^"]*">>/.test(content)) {
        issues.malformedMetaQuotes.push(file);
    }

    // 2. Duplicate commented section headers
    if (content.includes('<!-- ======================== INFO CARDS ======================== -->\n            <!-- ======================== INFO CARDS ======================== -->')) {
        issues.duplicateComments.push(file);
    }

    // 3. Duplicate <section class="info-section"> or dynamic placeholder sections
    const dynamicSeoMatches = content.match(/<section class="info-section">/g);
    if (dynamicSeoMatches && dynamicSeoMatches.length > 1) {
        issues.duplicateDynamicSeoSections.push({ file, count: dynamicSeoMatches.length });
    }

    // 4. Premature </main> tag before container finishes
    const mainPos = content.indexOf('</main>');
    const footerPos = content.indexOf('<footer');
    const containerPos = content.lastIndexOf('</div><!-- end .container -->');
    if (mainPos !== -1 && footerPos !== -1 && mainPos < containerPos) {
        issues.prematureMainCloses.push(file);
    }

    // 5. Malformed word grid (word items outside #wordGrid)
    const gridIndex = content.indexOf('<div id="wordGrid"');
    if (gridIndex !== -1) {
        const afterGridHeader = content.substring(gridIndex);
        // Find end of #wordGrid container (before FAQs or Internal Navigation)
        const nextSectionIndex = afterGridHeader.search(/<h3>|<h2>Internal Navigation<\/h2>|<div class="letter-nav">/i);
        if (nextSectionIndex !== -1) {
            const gridAndAfter = afterGridHeader.substring(0, nextSectionIndex);
            const gridEndIndex = gridAndAfter.lastIndexOf('</div>');
            const afterGridEnd = gridAndAfter.substring(gridEndIndex + 6);
            if (afterGridEnd.includes('<div class="word-item">')) {
                issues.malformedWordGrids.push(file);
            }
        }
    }
});

console.log(JSON.stringify(issues, null, 2));
