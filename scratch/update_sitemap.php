<?php
// Script to safely insert missing 22 ending letter URLs into sitemap.xml in alphabetical order A-Z
$sitemapPath = __DIR__ . '/../sitemap.xml';
$content = file_get_contents($sitemapPath);

// Current ending letter pages in sitemap: E (12-14), S (16-18), T (20-22), Y (24-26)
// We will replace lines 11-26 with a clean, complete, alphabetical list of all 26 ending letter pages (A-Z).
// Standard lastmod date for ending-letter pages: 2026-08-19 (or matching 2026-05-10 / 2026-06-03).

$alphabet = range('a', 'z');
$endingBlock = "";
foreach ($alphabet as $let) {
    $endingBlock .= "  <url>\n";
    $endingBlock .= "    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-{$let}.html</loc>\n";
    $endingBlock .= "    <lastmod>2026-08-19</lastmod>\n";
    $endingBlock .= "  </url>\n";
}

// Find existing block from line 11 (starting with <url> of ending-with-e) to line 26 (ending with </url> of ending-with-y)
$pattern = '/  <url>\s*<loc>https:\/\/www\.5letterwordfindertool\.com\/5-letter-words-ending-with-e\.html<\/loc>.*?<\/url>/s';

// Better targeted replacement: replace from 5-letter-words-ending-with-e.html to ending-with-y.html
$regex = '/  <url>\s*<loc>https:\/\/www\.5letterwordfindertool\.com\/5-letter-words-ending-with-e\.html<\/loc>.*?  <\/url>/s';

if (preg_match($regex, $content, $matches)) {
    $newContent = str_replace($matches[0], rtrim($endingBlock), $content);
    file_put_contents($sitemapPath, $newContent);
    echo "Sitemap successfully updated with all 26 ending-letter pages!\n";
} else {
    echo "ERROR: Regex match failed!\n";
}
