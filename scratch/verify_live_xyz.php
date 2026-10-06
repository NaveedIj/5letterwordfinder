<?php
$urls = [
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-x.html' => 'X',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-y.html' => 'Y',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-z.html' => 'Z'
];

foreach ($urls as $url => $letter) {
    echo "===========================================\n";
    echo "VERIFYING LIVE PROD: $url\n";
    
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
    
    // 1. Title & Meta
    $titles = $xpath->query('//title');
    $metas = $xpath->query('//meta[@name="description"]');
    echo "  Title: " . ($titles->length > 0 ? trim($titles->item(0)->textContent) : "MISSING") . "\n";
    echo "  Meta description: " . ($metas->length > 0 ? trim($metas->item(0)->getAttribute('content')) : "MISSING") . "\n";
    
    // 2. Canonical & Robots
    $canonicals = $xpath->query('//link[@rel="canonical"]');
    $robots = $xpath->query('//meta[@name="robots"]');
    echo "  Canonical: " . ($canonicals->length > 0 ? $canonicals->item(0)->getAttribute('href') : "MISSING") . "\n";
    echo "  Robots: " . ($robots->length > 0 ? $robots->item(0)->getAttribute('content') : "MISSING") . "\n";
    
    // 3. H1 & DOM Attributes
    $h1s = $xpath->query('//h1');
    $body = $xpath->query('//body')->item(0);
    $pos4 = $xpath->query('//input[@id="pos4"]')->item(0);
    echo "  H1 count: " . $h1s->length . " (" . ($h1s->length > 0 ? trim($h1s->item(0)->textContent) : "") . ")\n";
    echo "  body data-letter: " . ($body ? $body->getAttribute('data-letter') : "MISSING") . "\n";
    echo "  #pos4 value: " . ($pos4 ? $pos4->getAttribute('value') : "MISSING") . "\n";
    
    // 4. Structural Counts
    $seoGuide = $xpath->query('//*[contains(@class, "seo-guide-section")]');
    $infoContent = $xpath->query('//*[contains(@class, "info-content")]');
    $helpful = $xpath->query('//*[contains(text(), "Helpful Guides")]');
    echo "  .seo-guide-section count: " . $seoGuide->length . "\n";
    echo "  .info-content count: " . $infoContent->length . "\n";
    echo "  Helpful Guides count: " . $helpful->length . "\n";
    
    // 5. FAQ Parity & Schemas
    $visibleFaqs = $xpath->query('//details[contains(@class, "faq-item")]');
    $scripts = $xpath->query('//script[@type="application/ld+json"]');
    $jsonFaqCount = 0; $hasOrg = false; $hasApp = false; $hasBreadcrumb = false;
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
    
    // 6. Content word checks
    $htmlLower = strtolower($html);
    if ($letter === 'X') {
        $xTargets = ['affix', 'admix', 'relax', 'borax', 'addax', 'index', 'annex', 'detox'];
        $xCheck = true;
        foreach ($xTargets as $tw) {
            if (!str_contains($htmlLower, $tw)) { $xCheck = false; echo "  Missing target word: $tw\n"; }
        }
        echo "  X Target Words Present: " . ($xCheck ? "PASS" : "FAIL") . "\n";
    }
    if ($letter === 'Y') {
        $yTargets = ['abbey', 'agony', 'every', 'empty', 'daily', 'story'];
        $yCheck = true;
        foreach ($yTargets as $tw) {
            if (!str_contains($htmlLower, $tw)) { $yCheck = false; echo "  Missing target word: $tw\n"; }
        }
        echo "  Y Target Words Present: " . ($yCheck ? "PASS" : "FAIL") . "\n";
    }
    if ($letter === 'Z') {
        $zTargets = ['blitz', 'fritz', 'abuzz', 'frizz', 'hafiz', 'grosz'];
        $zCheck = true;
        foreach ($zTargets as $tw) {
            if (!str_contains($htmlLower, $tw)) { $zCheck = false; echo "  Missing target word: $tw\n"; }
        }
        echo "  Z Target Words Present: " . ($zCheck ? "PASS" : "FAIL") . "\n";
    }
}
