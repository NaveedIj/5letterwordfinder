const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('FILENAME'.padEnd(42) + ' | LDs | FAQs | Graph | WebApp | Bread | EmptyInfo');
console.log('-'.repeat(85));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const matches = content.match(/<script\s+type=["']application\/ld\+json["']>(.*?)<\/script>/gs) || [];
  let faqCount = 0, graphCount = 0, webAppCount = 0, orgCount = 0, breadCount = 0;
  matches.forEach(m => {
    if (m.includes('FAQPage')) faqCount++;
    if (m.includes('@graph')) graphCount++;
    if (m.includes('WebApplication')) webAppCount++;
    if (m.includes('Organization')) orgCount++;
    if (m.includes('BreadcrumbList')) breadCount++;
  });
  const emptyInfo = content.includes('Hydrated by seoManager.js');
  console.log(f.padEnd(42) + ' | ' + String(matches.length).padStart(3) + ' | ' + String(faqCount).padStart(4) + ' | ' + String(graphCount).padStart(5) + ' | ' + String(webAppCount).padStart(6) + ' | ' + String(breadCount).padStart(5) + ' | ' + emptyInfo);
});
