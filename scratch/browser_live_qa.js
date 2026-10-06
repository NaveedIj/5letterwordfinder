import { chromium } from 'playwright';

(async () => {
    console.log('=== STARTING BROWSER QA FOR LIVE PRODUCTION ===');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    console.log('1. Navigating to https://www.5letterwordfindertool.com/');
    const response = await page.goto('https://www.5letterwordfindertool.com/', { waitUntil: 'networkidle' });
    console.log(`   HTTP Response Status: ${response.status()}`);

    // 2. DOM Word Count Check
    const statWordCount = await page.textContent('#statWordCount');
    console.log(`2. Rendered #statWordCount DOM value: ${statWordCount.trim()}`);

    // 3. Initial Matches Count
    const initialResultsCount = await page.textContent('#resultsCount');
    console.log(`3. Initial results count text: ${initialResultsCount.trim()}`);

    // 4. Test Green Position Input (C in slot 1)
    await page.fill('#pos0', 'C');
    await page.waitForTimeout(300);
    const greenResultsCount = await page.textContent('#resultsCount');
    console.log(`4. Filtered matches after entering 'C' in Green position 1: ${greenResultsCount.trim()}`);

    // 5. Test Must Include Input (APPLE - Duplicate P check)
    await page.fill('#pos0', '');
    await page.fill('#mustInclude', 'APPLE');
    await page.waitForTimeout(300);
    const mustIncludeCount = await page.textContent('#resultsCount');
    console.log(`5. Filtered matches after entering 'APPLE' into Must Include: ${mustIncludeCount.trim()}`);

    // 6. Test Dictionary Toggle to Full
    await page.click('.toggle-item[data-dict="broad"]');
    await page.waitForTimeout(300);
    const broadCount = await page.textContent('#resultsCount');
    console.log(`6. Matches after toggling to Full Dictionary Mode: ${broadCount.trim()}`);

    // Reset filters
    await page.fill('#mustInclude', '');
    await page.click('.toggle-item[data-dict="strict"]');

    // 7. Visible FAQ Count & Accordion Text
    const visibleFaqs = await page.$$eval('.faq-item', nodes => nodes.map(n => n.innerText.trim()));
    console.log(`7. Total visible FAQs rendered in browser DOM: ${visibleFaqs.length}`);

    // 8. Console Errors Check
    console.log(`8. Browser Console Errors Captured: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
        console.log('   Console Error Details:', consoleErrors);
    } else {
        console.log('   PASSED: 0 console errors during interactive session.');
    }

    await browser.close();
    console.log('=== BROWSER QA COMPLETE ===');
})();
