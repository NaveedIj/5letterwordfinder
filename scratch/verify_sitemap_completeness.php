<?php
$xml = file_get_contents('sitemap.xml');

// 1. XML Validation
$doc = new DOMDocument();
$valid = @$doc->loadXML($xml);

echo "=== 1. XML VALIDATION ===\n";
echo "XML Parsed Successfully: " . ($valid ? "YES" : "NO") . "\n";

// 2. A-Z Completeness & Duplication Check
$xpath = new DOMXPath($doc);
$xpath->registerNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9');

$sitemapUrls = [];
foreach ($xpath->query('//s:loc') as $loc) {
    $sitemapUrls[] = trim($loc->textContent);
}

$alphabet = range('a', 'z');
$matrix = [];
$allPresent = true;
$hasDuplicates = false;

foreach ($alphabet as $let) {
    $char = strtoupper($let);
    $fileName = "5-letter-words-ending-with-{$let}.html";
    $expectedUrl = "https://www.5letterwordfindertool.com/{$fileName}";
    
    // Count occurrences in sitemap
    $count = 0;
    foreach ($sitemapUrls as $u) {
        if ($u === $expectedUrl) $count++;
    }
    
    if ($count === 0) $allPresent = false;
    if ($count > 1) $hasDuplicates = true;
    
    // Check local HTML file canonical
    $localContent = file_get_contents($fileName);
    $localDoc = new DOMDocument();
    @$localDoc->loadHTML($localContent);
    $localXpath = new DOMXPath($localDoc);
    $canonNode = $localXpath->query('//link[@rel="canonical"]');
    $canonicalUrl = $canonNode->length > 0 ? trim($canonNode->item(0)->getAttribute('href')) : 'MISSING';
    
    $matrix[$char] = [
        'url' => $expectedUrl,
        'presentInSitemap' => ($count > 0 ? "YES" : "NO"),
        'occurrences' => $count,
        'duplicate' => ($count > 1 ? "YES" : "NO"),
        'canonicalMatch' => ($canonicalUrl === $expectedUrl ? "YES" : "NO ($canonicalUrl)")
    ];
}

echo "\n=== 2. A-Z COMPLETENESS & CANONICAL MATCH ===\n";
echo "All 26 Present: " . ($allPresent ? "YES (26/26)" : "NO") . "\n";
echo "Duplicates Found: " . ($hasDuplicates ? "YES" : "NO (0)") . "\n\n";

foreach ($matrix as $char => $row) {
    echo "  [$char] Sitemap: {$row['presentInSitemap']} (Count: {$row['occurrences']}), Duplicate: {$row['duplicate']}, Canonical Match: {$row['canonicalMatch']}\n";
}
