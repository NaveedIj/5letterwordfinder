const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
    const descMatch = content.match(/<meta name="description"\s+content="([^"]*)"/i);
    const ogTitleMatch = content.match(/<meta property="og:title"\s+content="([^"]*)"/i);
    const ogDescMatch = content.match(/<meta property="og:description"\s+content="([^"]*)"/i);
    const twTitleMatch = content.match(/<meta name="twitter:title"\s+content="([^"]*)"/i);
    const twDescMatch = content.match(/<meta name="twitter:description"\s+content="([^"]*)"/i);

    console.log(`=== ${file} ===`);
    console.log(`Title: ${titleMatch ? titleMatch[1].trim() : 'NONE'}`);
    console.log(`Desc:  ${descMatch ? descMatch[1].trim() : 'NONE'}`);
    console.log(`OG Title: ${ogTitleMatch ? ogTitleMatch[1].trim() : 'NONE'}`);
    console.log(`OG Desc:  ${ogDescMatch ? ogDescMatch[1].trim() : 'NONE'}`);
    console.log(`TW Title: ${twTitleMatch ? twTitleMatch[1].trim() : 'NONE'}`);
    console.log(`TW Desc:  ${twDescMatch ? twDescMatch[1].trim() : 'NONE'}`);
    console.log('');
});
