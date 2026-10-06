const fs = require('fs');
const path = require('path');

const pagesPath = 'C:/Users/dell/.gemini/antigravity/brain/f361e4b6-991a-4638-bcaa-1a2ec56524e0/.user_uploaded/media_1787787050503.csv';
const queriesPath = 'C:/Users/dell/.gemini/antigravity/brain/f361e4b6-991a-4638-bcaa-1a2ec56524e0/.user_uploaded/media_1787787056578.csv';
const countriesPath = 'C:/Users/dell/.gemini/antigravity/brain/f361e4b6-991a-4638-bcaa-1a2ec56524e0/.user_uploaded/media_1787787033691.csv';
const dateChartPath = 'C:/Users/dell/.gemini/antigravity/brain/e6c789ed-b8a7-4ab6-8534-a5a459397537/.user_uploaded/media_1787335609339.csv';

function parseCsv(file) {
    if (!fs.existsSync(file)) return null;
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(l => l.trim().length > 0);
    return lines.map(l => l.split(',').map(c => c.replace(/^"|"$/g, '').trim()));
}

console.log('=== 1. GSC PAGES PERFORMANCE MATRIX ===\n');
const pages = parseCsv(pagesPath);
if (pages) {
    console.log(sprintf("%-65s | %-6s | %-6s | %-6s | %-7s | %-7s | %-7s | %-6s | %-6s | %-6s", 
        "URL", "Clicks", "PrevCl", "ClChg", "Imp", "PrevImp", "ImpChg", "Pos", "PrevPos", "Class"));
    console.log('-'.repeat(140));

    pages.slice(1).forEach(r => {
        const url = r[0];
        const clicks = parseInt(r[1]) || 0;
        const prevClicks = parseInt(r[2]) || 0;
        const clickChg = clicks - prevClicks;

        const imp = parseInt(r[3]) || 0;
        const prevImp = parseInt(r[4]) || 0;
        const impChg = imp - prevImp;

        const ctr = r[5];
        const pos = parseFloat(r[7]) || 0;
        const prevPos = parseFloat(r[8]) || 0;

        let classification = 'E — NO DATA';
        if (pos > 0 && pos <= 10) {
            classification = (imp >= 50 || clicks > 0) ? 'A — STRONG' : 'B — PROMISING';
        } else if (pos > 10 && pos <= 20) {
            classification = 'B — PROMISING';
        } else if (imp > 0) {
            classification = 'C — TESTING / EARLY';
        } else if (prevImp > 0) {
            classification = 'D — WEAK / DECLINING';
        }

        console.log(sprintf("%-65s | %-6d | %-6d | %-6d | %-7d | %-7d | %-7d | %-6.2f | %-6.2f | %-15s",
            url.substring(0, 65), clicks, prevClicks, clickChg, imp, prevImp, impChg, pos, prevPos, classification));
    });
}

function sprintf(format, ...args) {
    let i = 0;
    return format.replace(/%-?(\d+)?(\.\d+)?(s|d|f)/g, (match, width, precision, type) => {
        let val = args[i++];
        if (type === 'f' && precision) {
            val = val.toFixed(parseInt(precision.substring(1)));
        }
        val = String(val);
        if (width) {
            const w = parseInt(width);
            if (val.length < w) {
                val = match.startsWith('%-') ? val.padEnd(w) : val.padStart(w);
            }
        }
        return val;
    });
}

console.log('\n=== 2. COUNTRY DISTRIBUTION (TOP 10) ===\n');
const countries = parseCsv(countriesPath);
if (countries) {
    countries.slice(1, 11).forEach(r => {
        console.log(`Country: ${r[0]} | Clicks: ${r[1]} (Prev: ${r[2]}) | Imp: ${r[3]} (Prev: ${r[4]}) | Pos: ${r[7]}`);
    });
}
