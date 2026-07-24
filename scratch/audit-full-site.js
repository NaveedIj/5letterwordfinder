const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const auditResults = {
    duplicateIds: [],
    gitConflictMarkers: [],
    unclosedTags: [],
    escapedOrphanSymbols: [],
    developerArtifacts: [],
    brokenCanonicalRobots: [],
    duplicateComments: []
};

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. Conflict markers
    if (content.includes('<<<<<<<') || content.includes('>>>>>>>') || /^=======\s*$/m.test(content)) {
        auditResults.gitConflictMarkers.push(file);
    }

    // 2. Orphan symbols / curly braces / debug text
    if (content.includes('{{{') || content.includes('}}}') || content.includes('console.log(')) {
        auditResults.developerArtifacts.push(file);
    }

    // 3. Duplicate Comments
    if (content.includes('<!-- ======================== INFO CARDS ======================== -->\n            <!-- ======================== INFO CARDS ======================== -->')) {
        auditResults.duplicateComments.push(file);
    }

    // 4. Duplicate IDs
    const ids = [];
    const idMatches = content.matchAll(/id="([^"]+)"/g);
    for (const match of idMatches) {
        const id = match[1];
        if (ids.includes(id)) {
            auditResults.duplicateIds.push({ file, id });
        } else {
            ids.push(id);
        }
    }

    // 5. Canonical & Robots check
    const hasCanonical = /<link rel="canonical" href="[^"]*">/i.test(content);
    const hasRobots = /<meta name="robots" content="[^"]*">/i.test(content);
    if (!hasCanonical || !hasRobots) {
        auditResults.brokenCanonicalRobots.push({ file, hasCanonical, hasRobots });
    }
});

console.log(JSON.stringify(auditResults, null, 2));
