<?php
$sitemapUrl = 'https://www.5letterwordfindertool.com/sitemap.xml';

echo "=== 1. FETCHING LIVE SITEMAP ===\n";
$ch = curl_init($sitemapUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LiveSitemapVerify/1.0');
$xml = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status Code: $httpCode\n";
if ($httpCode !== 200) {
    echo "FAILED HTTP 200 FOR SITEMAP!\n";
    exit;
}

$doc = new DOMDocument();
$validXml = @$doc->loadXML($xml);
echo "XML Parsed Successfully: " . ($validXml ? "YES" : "NO") . "\n";

$xpath = new DOMXPath($doc);
$xpath->registerNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9');

$liveUrls = [];
foreach ($xpath->query('//s:loc') as $loc) {
    $liveUrls[] = trim($loc->textContent);
}

echo "Total URLs in Live Sitemap: " . count($liveUrls) . "\n\n";

echo "=== 2. A-Z COMPLETENESS & FORMAT CHECK ===\n";
$alphabet = range('a', 'z');
$matrix = [];
$allPresent = true;
$hasDuplicates = false;

foreach ($alphabet as $let) {
    $char = strtoupper($let);
    $targetFilename = "5-letter-words-ending-with-{$let}.html";
    $expectedUrl = "https://www.5letterwordfindertool.com/{$targetFilename}";
    
    // Count in live sitemap
    $occurrences = 0;
    foreach ($liveUrls as $u) {
        if ($u === $expectedUrl) $occurrences++;
    }
    
    if ($occurrences === 0) $allPresent = false;
    if ($occurrences > 1) $hasDuplicates = true;
    
    // Fetch live page HTTP status and Canonical
    $ch = curl_init($expectedUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LivePageCheck/1.0');
    $pageHtml = curl_exec($ch);
    $pageCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $pageDoc = new DOMDocument();
    @$pageDoc->loadHTML($pageHtml);
    $pageXpath = new DOMXPath($pageDoc);
    $canonNode = $pageXpath->query('//link[@rel="canonical"]');
    $canonicalUrl = $canonNode->length > 0 ? trim($canonNode->item(0)->getAttribute('href')) : 'MISSING';
    
    $matrix[$char] = [
        'url' => $expectedUrl,
        'inSitemap' => ($occurrences > 0 ? "YES" : "NO"),
        'count' => $occurrences,
        'duplicate' => ($occurrences > 1 ? "YES" : "NO"),
        'pageHttp' => $pageCode,
        'canonicalMatch' => ($canonicalUrl === $expectedUrl ? "YES" : "NO ($canonicalUrl)")
    ];
}

echo "All 26 A-Z Present in Live Sitemap: " . ($allPresent ? "YES (26/26)" : "NO") . "\n";
echo "Duplicates Found: " . ($hasDuplicates ? "YES" : "NO (0)") . "\n\n";

foreach ($matrix as $char => $row) {
    echo "  [$char] Sitemap: {$row['inSitemap']} (Count: {$row['count']}), Page HTTP: {$row['pageHttp']}, Canonical Match: {$row['canonicalMatch']}\n";
}

echo "\n=== 3. EXISTING NON-ENDING-LETTER URL PRESERVATION ===\n";
$nonEndingUrls = [
    'https://www.5letterwordfindertool.com/',
    'https://www.5letterwordfindertool.com/3-letter-word-finder.html',
    'https://www.5letterwordfindertool.com/4-letter-word-finder.html',
    'https://www.5letterwordfindertool.com/6-letter-word-finder.html',
    'https://www.5letterwordfindertool.com/7-letter-word-finder.html',
    'https://www.5letterwordfindertool.com/8-letter-word-finder.html',
    'https://www.5letterwordfindertool.com/about.html',
    'https://www.5letterwordfindertool.com/contact.html',
    'https://www.5letterwordfindertool.com/privacy.html',
    'https://www.5letterwordfindertool.com/game.html',
    'https://www.5letterwordfindertool.com/ai-word-solver'
];

$allNonEndingPreserved = true;
foreach ($nonEndingUrls as $neu) {
    $found = in_array($neu, $liveUrls);
    if (!$found) $allNonEndingPreserved = false;
    echo "  Preserved: $neu => " . ($found ? "YES" : "MISSING") . "\n";
}
echo "All Non-Ending Core URLs Preserved: " . ($allNonEndingPreserved ? "YES" : "NO") . "\n";
