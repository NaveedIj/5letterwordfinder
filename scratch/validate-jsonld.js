const fs = require('fs');

console.log("=== STEP 1: VALIDATING JSON-LD BLOCKS ===");

['3-letter-word-finder.html', '6-letter-word-finder.html'].forEach(filename => {
    console.log(`\nValidating ${filename}:`);
    const content = fs.readFileSync(filename, 'utf8');
    const matches = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    
    matches.forEach((block, idx) => {
        const jsonText = block.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '').trim();
        try {
            const parsed = JSON.parse(jsonText);
            console.log(`  [Block ${idx + 1}] JSON.parse SUCCESS! Types contained:`, 
                parsed['@graph'] ? parsed['@graph'].map(e => e['@type']).join(', ') : parsed['@type']);
        } catch (err) {
            console.error(`  [Block ${idx + 1}] JSON.parse FAILED:`, err.message);
        }
    });
});
