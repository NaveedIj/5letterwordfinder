<?php
// Clean up sitemap.xml to have EXACTLY ONE <url> for each A-Z ending-letter page in alphabetical order
$sitemapPath = __DIR__ . '/../sitemap.xml';
$content = file_get_contents($sitemapPath);

// 1. Remove all existing ending-with URLs from content
$pattern = '/  <url>\s*<loc>https:\/\/www\.5letterwordfindertool\.com\/5-letter-words-ending-with-[a-z]\.html<\/loc>\s*<lastmod>.*?<\/lastmod>\s*<\/url>\n?/s';
$cleanContent = preg_replace($pattern, '', $content);

// 2. Build the single clean A-Z block
$alphabet = range('a', 'z');
$azBlock = "";
foreach ($alphabet as $let) {
    $azBlock .= "  <url>\n";
    $azBlock .= "    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-{$let}.html</loc>\n";
    $azBlock .= "    <lastmod>2026-08-19</lastmod>\n";
    $azBlock .= "  </url>\n";
}

// Insert right after 4-letter-word-finder.html
$targetLoc = "<loc>https://www.5letterwordfindertool.com/4-letter-word-finder.html</loc>\n    <lastmod>2026-06-03</lastmod>\n  </url>";
$replacement = $targetLoc . "\n" . rtrim($azBlock);

$finalContent = str_replace($targetLoc, $replacement, $cleanContent);
file_put_contents($sitemapPath, $finalContent);
echo "Sitemap perfectly deduplicated and updated!\n";
