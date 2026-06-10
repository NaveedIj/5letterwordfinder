const fs = require('fs');
const path = require('path');

const dir = 'c:/laragon/www/5-letter-word-finder';

// 1. Get all HTML files in directory
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// 2. Read sitemap
const sitemapPath = path.join(dir, 'sitemap.xml');
let sitemapUrls = [];
if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    if (urlMatches) {
        sitemapUrls = urlMatches.map(m => m.replace(/<\/?loc>/g, '').trim());
    }
}

// Convert sitemap absolute URLs to relative filenames for comparison
const sitemapFiles = sitemapUrls.map(url => {
    let p = url.replace('https://www.5letterwordfindertool.com/', '');
    if (p === '') return 'index.html';
    return p;
});

// 3. Extract all internal links from all HTML files
const inboundLinks = {};
files.forEach(f => {
    inboundLinks[f] = new Set();
});
inboundLinks['index.html'] = new Set(); // ensure index is counted

files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Naive regex to match href="somepage.html"
    // Also matching href="/" for index.html
    const linkRegex = /href=["']([^"']+)["']/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
        let link = match[1].trim();
        // Ignore external links and anchors
        if (link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('#')) {
            if (link.startsWith('https://www.5letterwordfindertool.com/')) {
                link = link.replace('https://www.5letterwordfindertool.com/', '');
            } else {
                continue;
            }
        }
        
        // Normalize
        if (link === '/' || link === '') {
            link = 'index.html';
        }
        // Remove query strings or hashes
        link = link.split('?')[0].split('#')[0];
        
        // Remove leading slash
        if (link.startsWith('/')) {
            link = link.substring(1);
        }

        // If it's empty after removing leading slash (was just "/")
        if (link === '') {
            link = 'index.html';
        }

        // Only count links to local html files
        if (link.endsWith('.html') || link === 'index.html') {
            if (!inboundLinks[link]) {
                inboundLinks[link] = new Set();
            }
            // Add the source file to the set of inbound links
            inboundLinks[link].add(file);
        }
    }
});

// Add files that are in sitemap but maybe missing from directory?
sitemapFiles.forEach(f => {
    if (!inboundLinks[f]) inboundLinks[f] = new Set();
});

// Generate Report Data
const report = [];

Object.keys(inboundLinks).forEach(target => {
    const linksCount = inboundLinks[target].size;
    let issue = '';
    let fix = '';

    const inSitemap = sitemapFiles.includes(target);
    const isHtmlFile = files.includes(target) || target === 'index.html';

    if (!isHtmlFile && inSitemap) {
        issue = 'In sitemap but file does not exist';
        fix = 'Remove from sitemap or create page';
    } else if (linksCount === 0 && inSitemap) {
        issue = 'Orphan page (in sitemap)';
        fix = 'Add internal links from related pages';
    } else if (linksCount === 0 && !inSitemap) {
        issue = 'Orphan page (not in sitemap)';
        fix = 'Add to sitemap & link internally, or delete';
    } else if (linksCount < 3) {
        issue = 'Low internal links (<3)';
        fix = 'Add links from index or letter-nav block';
    } else {
        // No major issue based on link count alone, but we might want to flag specific pages
        issue = 'OK';
        fix = 'None';
    }

    report.push({
        URL: target,
        Links: linksCount,
        Issue: issue,
        Fix: fix
    });
});

console.log(JSON.stringify(report, null, 2));
