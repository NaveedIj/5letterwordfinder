<?php
$xml = file_get_contents('sitemap.xml');
$doc = new DOMDocument();
@$doc->loadXML($xml);
$xpath = new DOMXPath($doc);
$xpath->registerNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9');

$urls = [];
foreach ($xpath->query('//s:loc') as $loc) {
    $urls[] = trim($loc->textContent);
}

$alphabet = range('a', 'z');
$endingUrlsInSitemap = [];
foreach ($alphabet as $let) {
    $u = "https://www.5letterwordfindertool.com/5-letter-words-ending-with-{$let}.html";
    if (in_array($u, $urls)) {
        $endingUrlsInSitemap[] = strtoupper($let);
    }
}

echo "=== SITEMAP ANALYSIS ===\n";
echo "Total URLs in sitemap.xml: " . count($urls) . "\n";
echo "Ending letter pages PRESENT in sitemap.xml (" . count($endingUrlsInSitemap) . "): " . implode(", ", $endingUrlsInSitemap) . "\n";

$missing = array_diff(array_map('strtoupper', $alphabet), $endingUrlsInSitemap);
echo "Ending letter pages MISSING from sitemap.xml (" . count($missing) . "): " . implode(", ", $missing) . "\n";
