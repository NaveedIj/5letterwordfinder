const { chromium } = require('playwright');

(async () => {
    console.log('=== STARTING BROWSER QA FOR LIVE PRODUCTION ===');
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 } // Mobile viewport initial test
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    console.log('1. Navigating to https://www.5letterwordfindertool.com/');
    const response = await page.goto('https://www.5letterwordfindertool.com/?cb=' + Date.now(), { waitUntil: 'networkidle' });
    console.log(`   HTTP Response Status: ${response.status()}`);

    // H1 check
    const rawH1 = await page.$eval('h1', el => el.textContent.trim());
    console.log(`   Browser DOM H1: "${rawH1}"`);

    // 2. Test Green Position Input (C in slot 1)
    await page.fill('#pos0', 'C');
    await page.waitForTimeout(300);
    const greenResultsCount = await page.textContent('#resultsCount');
    console.log(`   Green Filter (Pos 1 = 'C'): ${greenResultsCount.trim()}`);

    // 3. Test Yellow Input (E in slot 2)
    await page.fill('#w1', 'E');
    await page.waitForTimeout(300);
    const yellowResultsCount = await page.textContent('#resultsCount');
    console.log(`   Yellow Filter (Slot 2 = 'E'): ${yellowResultsCount.trim()}`);

    // 4. Test Gray Exclusion Input (X)
    await page.fill('#excludes', 'X');
    await page.waitForTimeout(300);
    const grayResultsCount = await page.textContent('#resultsCount');
    console.log(`   Gray Filter (Exclude 'X'): ${grayResultsCount.trim()}`);

    // Reset filters
    await page.fill('#pos0', '');
    await page.fill('#w1', '');
    await page.fill('#excludes', '');
    await page.waitForTimeout(300);

    // 5. Test Must Include Input (APPLE - Duplicate P check)
    await page.fill('#mustInclude', 'APPLE');
    await page.waitForTimeout(300);
    const mustIncludeCount = await page.textContent('#resultsCount');
    console.log(`   Must Include ('APPLE'): ${mustIncludeCount.trim()}`);

    // 6. Test Dictionary Toggle to Full
    await page.click('.toggle-item[data-dict="broad"]');
    await page.waitForTimeout(300);
    const broadCount = await page.textContent('#resultsCount');
    console.log(`   Full Dictionary Mode: ${broadCount.trim()}`);

    // 7. Scrabble Sort Test
    await page.selectOption('#sortSelect', 'score-desc');
    await page.waitForTimeout(300);
    const topWord = await page.$eval('.results-list', el => el.children[0]?.textContent || 'NONE');
    console.log(`   Scrabble Sort Top Word: ${topWord.trim()}`);

    // Reset filters
    await page.fill('#mustInclude', '');
    await page.click('.toggle-item[data-dict="strict"]');
    await page.waitForTimeout(300);
    const resetCount = await page.textContent('#resultsCount');
    console.log(`   Reset State Count: ${resetCount.trim()}`);

    // 8. FAQ Accordion Interaction
    const faqs = await page.$$('.faq-item');
    console.log(`   Visible FAQs Count: ${faqs.length}`);
    let faqInteractionPass = true;
    for (let i = 0; i < faqs.length; i++) {
        const isVisible = await faqs[i].isVisible();
        if (!isVisible) faqInteractionPass = false;
    }
    console.log(`   FAQ Interaction Check: ${faqInteractionPass ? 'PASS' : 'FAIL'}`);

    // 9. Mobile Viewport Check
    const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`   Mobile Horizontal Overflow Check (375x667): ${overflow ? 'FAIL (Overflow)' : 'PASS (No Overflow)'}`);

    // 10. Console Errors
    console.log(`   Console Errors Count: ${consoleErrors.length}`);

    await browser.close();
    console.log('=== PLAYWRIGHT BROWSER QA COMPLETE ===');
})();
