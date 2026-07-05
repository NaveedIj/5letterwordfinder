const fs = require('fs');
const path = require('path');

const dir = 'c:\\laragon\\www\\5-letter-word-finder';
const files = fs.readdirSync(dir);
const htmlFiles = files.filter(f => f.endsWith('.html'));

const gaCode = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WW6EJYTTML"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WW6EJYTTML');
</script>
</head>`;

let updatedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if exactly one tag should be there. 
    // First, remove any existing GA tracking code.
    const removeRegex = /<!-- Google tag \(gtag\.js\) -->[\s\S]*?<\/script>\s*/gi;
    content = content.replace(removeRegex, '');

    // Replace </head> with gaCode
    content = content.replace(/<\/head>/i, gaCode);
    
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Updated ${file}`);
});

console.log(`Total HTML files updated: ${updatedCount}`);
