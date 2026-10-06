<?php
$urls = [
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-s.html',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-t.html',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-u.html',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-v.html',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-w.html'
];

foreach ($urls as $url) {
    echo "===========================================\n";
    echo "VERIFYING LIVE: $url\n";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LiveQA/1.0');
    $html = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "  HTTP Code: $httpCode\n";
    if ($httpCode !== 200) {
        echo "  FAILED HTTP 200!\n";
        continue;
    }
    
    $doc = new DOMDocument();
    @$doc->loadHTML($html);
    $xpath = new DOMXPath($doc);
    
    // 1. Title
    $titles = $xpath->query('//title');
    echo "  Title: " . ($titles->length > 0 ? trim($titles->item(0)->textContent) : "MISSING") . "\n";
    
    // 2. Canonical
    $canonicals = $xpath->query('//link[@rel="canonical"]');
    echo "  Canonical: " . ($canonicals->length > 0 ? $canonicals->item(0)->getAttribute('href') : "MISSING") . "\n";
    
    // 3. Robots
    $robots = $xpath->query('//meta[@name="robots"]');
    echo "  Robots: " . ($robots->length > 0 ? $robots->item(0)->getAttribute('content') : "MISSING") . "\n";
    
    // 4. H1
    $h1s = $xpath->query('//h1');
    echo "  H1 count: " . $h1s->length . "\n";
    if ($h1s->length > 0) {
        echo "  H1 text: " . trim($h1s->item(0)->textContent) . "\n";
    }
    
    // 5. body data-letter
    $body = $xpath->query('//body')->item(0);
    echo "  body data-letter: " . ($body ? $body->getAttribute('data-letter') : "MISSING") . "\n";
    
    // 6. #pos4 value
    $pos4 = $xpath->query('//input[@id="pos4"]')->item(0);
    echo "  #pos4 value: " . ($pos4 ? $pos4->getAttribute('value') : "MISSING") . "\n";
    
    // 7. Structural Counts
    $seoGuide = $xpath->query('//*[contains(@class, "seo-guide-section")]');
    $infoContent = $xpath->query('//*[contains(@class, "info-content")]');
    $helpful = $xpath->query('//*[contains(text(), "Helpful Guides")]');
    echo "  .seo-guide-section count: " . $seoGuide->length . "\n";
    echo "  .info-content count: " . $infoContent->length . "\n";
    echo "  Helpful Guides count: " . $helpful->length . "\n";
    
    // 8. FAQ Parity
    $visibleFaqs = $xpath->query('//details[contains(@class, "faq-item")]');
    $scripts = $xpath->query('//script[@type="application/ld+json"]');
    $jsonFaqCount = 0;
    $hasOrg = false; $hasApp = false; $hasBreadcrumb = false;
    foreach ($scripts as $s) {
        $json = json_decode($s->textContent, true);
        if (isset($json['@type'])) {
            if ($json['@type'] === 'FAQPage' && isset($json['mainEntity'])) {
                $jsonFaqCount = count($json['mainEntity']);
            }
            if ($json['@type'] === 'Organization') $hasOrg = true;
            if ($json['@type'] === 'WebApplication') $hasApp = true;
            if ($json['@type'] === 'BreadcrumbList') $hasBreadcrumb = true;
        }
    }
    echo "  FAQ 1:1 Match (Visible " . $visibleFaqs->length . " vs JSON " . $jsonFaqCount . "): " . ($visibleFaqs->length === $jsonFaqCount && $jsonFaqCount === 6 ? "PASS" : "FAIL") . "\n";
    echo "  Schemas present: FAQPage(" . ($jsonFaqCount > 0 ? "YES" : "NO") . ") Organization(" . ($hasOrg ? "YES" : "NO") . ") WebApplication(" . ($hasApp ? "YES" : "NO") . ") BreadcrumbList(" . ($hasBreadcrumb ? "YES" : "NO") . ")\n";
    
    // 9. Specific word checks
    $htmlLower = strtolower($html);
    if (str_contains($url, '-u.html')) {
        echo "  U-check (guru/kudu absent): " . (!str_contains($htmlLower, 'guru') && !str_contains($htmlLower, 'kudu') ? "PASS" : "FAIL") . "\n";
        echo "  U-check (adieu/bayou present): " . (str_contains($htmlLower, 'adieu') && str_contains($htmlLower, 'bayou') ? "PASS" : "FAIL") . "\n";
    }
    if (str_contains($url, '-v.html')) {
        echo "  V-check (spiev/brav absent): " . (!str_contains($htmlLower, 'spiev') && !str_contains($htmlLower, 'brav') ? "PASS" : "FAIL") . "\n";
    }
    if (str_contains($url, '-w.html')) {
        echo "  W-check (shraw absent): " . (!str_contains($htmlLower, 'shraw') ? "PASS" : "FAIL") . "\n";
        echo "  W-check (allow/elbow/arrow present): " . (str_contains($htmlLower, 'allow') && str_contains($htmlLower, 'elbow') && str_contains($htmlLower, 'arrow') ? "PASS" : "FAIL") . "\n";
    }
}
