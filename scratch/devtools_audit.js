const { chromium } = require('playwright');
const fs = require('fs');

async function runDevToolsAudit() {
    const browser = await chromium.launch({ headless: false }); // Real Browser Instance
    const page = await browser.newPage();
    await page.goto('http://localhost/5-letter-word-finder/');
    await page.waitForLoadState('networkidle');

    const artifactDir = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e';

    // Target the Explore More Word Tools heading (.info-section-title)
    const heading = page.locator('#tools-placeholder .info-section-title');

    // STEP 1: Temporary Color Test in DevTools DOM context
    await heading.evaluate(el => el.style.setProperty('color', '#ff0000', 'important'));
    await page.screenshot({ path: `${artifactDir}\\devtools_step1_red_test.png`, fullPage: false });
    
    // Reset back for computed evaluation
    await heading.evaluate(el => el.style.removeProperty('color'));

    // STEP 2: Computed Styles Evaluation
    const computed = await heading.evaluate(el => {
        const cs = window.getComputedStyle(el);
        return {
            color: cs.color,
            webkitTextFillColor: cs.webkitTextFillColor,
            opacity: cs.opacity,
            filter: cs.filter,
            mixBlendMode: cs.mixBlendMode,
            backgroundClip: cs.backgroundClip,
            webkitBackgroundClip: cs.webkitBackgroundClip,
            visibility: cs.visibility,
            display: cs.display,
            transform: cs.transform
        };
    });

    fs.writeFileSync(`${artifactDir}\\devtools_step2_computed.json`, JSON.stringify(computed, null, 2));

    // STEP 3: Parent Chain Ancestor Inspection
    const ancestorChain = await heading.evaluate(el => {
        const ancestors = [];
        let curr = el.parentElement;
        while (curr && curr.tagName !== 'HTML') {
            const cs = window.getComputedStyle(curr);
            const nonDefaultProps = {};
            
            if (cs.opacity !== '1') nonDefaultProps.opacity = cs.opacity;
            if (cs.filter !== 'none') nonDefaultProps.filter = cs.filter;
            if (cs.transform !== 'none') nonDefaultProps.transform = cs.transform;
            if (cs.isolation !== 'auto') nonDefaultProps.isolation = cs.isolation;
            if (cs.mixBlendMode !== 'normal') nonDefaultProps.mixBlendMode = cs.mixBlendMode;
            if (cs.overflow !== 'visible') nonDefaultProps.overflow = cs.overflow;
            if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') nonDefaultProps.backgroundColor = cs.backgroundColor;
            if (cs.backgroundImage !== 'none') nonDefaultProps.backgroundImage = cs.backgroundImage;

            ancestors.push({
                tag: curr.tagName,
                id: curr.id,
                className: curr.className,
                nonDefaultProps
            });
            curr = curr.parentElement;
        }
        return ancestors;
    });

    fs.writeFileSync(`${artifactDir}\\devtools_step3_ancestors.json`, JSON.stringify(ancestorChain, null, 2));

    // STEP 4: DOM Structure Capture
    const domStructure = await page.locator('#tools-placeholder').innerHTML();
    fs.writeFileSync(`${artifactDir}\\devtools_step4_dom.html`, domStructure);

    // STEP 5: Hero Comparison (.title vs .info-section-title)
    const heroH1 = page.locator('.title');
    const heroComputed = await heroH1.evaluate(el => {
        const cs = window.getComputedStyle(el);
        return {
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            color: cs.color,
            webkitTextFillColor: cs.webkitTextFillColor,
            backgroundClip: cs.backgroundClip,
            webkitBackgroundClip: cs.webkitBackgroundClip,
            backgroundImage: cs.backgroundImage,
            lineHeight: cs.lineHeight,
            filter: cs.filter
        };
    });

    fs.writeFileSync(`${artifactDir}\\devtools_step5_comparison.json`, JSON.stringify({
        heroH1: heroComputed,
        sectionHeading: computed
    }, null, 2));

    console.log('DevTools Audit Complete!');
    await browser.close();
}

runDevToolsAudit().catch(console.error);
