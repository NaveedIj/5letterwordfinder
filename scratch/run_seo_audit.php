<?php
// Read sitemap.xml
$sitemapXml = file_get_contents('sitemap.xml');
$sitemapDoc = new DOMDocument();
@$sitemapDoc->loadXML($sitemapXml);
$sitemapXpath = new DOMXPath($sitemapDoc);
$sitemapXpath->registerNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9');

$sitemapUrls = [];
foreach ($sitemapXpath->query('//s:loc') as $loc) {
    $sitemapUrls[] = trim($loc->textContent);
}

// Read index.html for homepage links
$indexHtml = file_get_contents('index.html');
$indexDoc = new DOMDocument();
@$indexDoc->loadHTML($indexHtml);
$indexXpath = new DOMXPath($indexDoc);
$indexLinks = [];
foreach ($indexXpath->query('//a[@href]') as $a) {
    $indexLinks[] = trim($a->getAttribute('href'));
}

$alphabet = range('a', 'z');
$audit = [];

foreach ($alphabet as $let) {
    $char = strtoupper($let);
    $fileName = "5-letter-words-ending-with-{$let}.html";
    $expectedUrl = "https://www.5letterwordfindertool.com/{$fileName}";
    
    // 1. Sitemap Presence
    $inSitemap = in_array($expectedUrl, $sitemapUrls);
    
    // 2. Read local file for DOM audit
    $localPath = __DIR__ . "/../{$fileName}";
    $fileContent = file_get_contents($localPath);
    $doc = new DOMDocument();
    @$doc->loadHTML($fileContent);
    $xpath = new DOMXPath($doc);
    
    // Canonical
    $canonQuery = $xpath->query('//link[@rel="canonical"]');
    $canonicalUrl = $canonQuery->length > 0 ? trim($canonQuery->item(0)->getAttribute('href')) : 'MISSING';
    
    // Robots
    $robotsQuery = $xpath->query('//meta[@name="robots"]');
    $robotsVal = $robotsQuery->length > 0 ? trim($robotsQuery->item(0)->getAttribute('content')) : 'MISSING';
    
    // Related Tools links inside this file
    $relatedLinks = [];
    foreach ($xpath->query('//div[contains(@class, "info-box")]/h3[contains(text(), "Related Word Tools")]/following-sibling::ul//a') as $a) {
        $relatedLinks[] = trim($a->getAttribute('href'));
    }
    
    // Count incoming internal links across ALL 26 HTML files + index.html
    $incomingCount = 0;
    $mainSources = [];
    
    // Check index.html
    if (in_array($fileName, $indexLinks) || in_array("/{$fileName}", $indexLinks)) {
        $incomingCount++;
        $mainSources[] = 'Homepage (index.html)';
    }
    
    // Check other 26 pages
    foreach ($alphabet as $otherLet) {
        $otherFile = "5-letter-words-ending-with-{$otherLet}.html";
        $otherContent = file_get_contents(__DIR__ . "/../{$otherFile}");
        if (str_contains($otherContent, $fileName)) {
            $incomingCount++;
            if (!in_array('Related Tools Footer/Body', $mainSources)) {
                $mainSources[] = 'Ending-Letter Cluster';
            }
        }
    }
    
    // H1 check
    $h1 = $xpath->query('//h1');
    $h1Text = $h1->length > 0 ? trim($h1->item(0)->textContent) : 'MISSING';
    
    // Data attributes
    $body = $xpath->query('//body')->item(0);
    $dataLetter = $body ? $body->getAttribute('data-letter') : '';
    $pos4 = $xpath->query('//input[@id="pos4"]')->item(0);
    $pos4Val = $pos4 ? $pos4->getAttribute('value') : '';
    
    // Section counts
    $seoGuideCount = $xpath->query('//*[contains(@class, "seo-guide-section")]')->length;
    $infoContentCount = $xpath->query('//*[contains(@class, "info-content")]')->length;
    $ghostCount = $xpath->query('//*[contains(text(), "Helpful Guides")]')->length;
    
    // FAQs
    $visibleFaqs = $xpath->query('//details[contains(@class, "faq-item")]')->length;
    $jsonFaqCount = 0;
    foreach ($xpath->query('//script[@type="application/ld+json"]') as $s) {
        $json = json_decode($s->textContent, true);
        if (isset($json['@type']) && $json['@type'] === 'FAQPage' && isset($json['mainEntity'])) {
            $jsonFaqCount = count($json['mainEntity']);
        }
    }
    
    // Content duplication check (calculate text length of info-content)
    $infoNode = $xpath->query('//*[contains(@class, "info-content")]')->item(0);
    $infoText = $infoNode ? trim($infoNode->textContent) : '';
    
    $audit[$char] = [
        'file' => $fileName,
        'sitemap' => $inSitemap ? 'INCLUDED' : 'MISSING',
        'canonical' => $canonicalUrl,
        'canonicalMatch' => ($canonicalUrl === $expectedUrl),
        'robots' => $robotsVal,
        'indexable' => ($robotsVal === 'index, follow'),
        'incomingLinks' => $incomingCount,
        'mainSources' => implode(', ', array_unique($mainSources)),
        'relatedToolsLinksCount' => count($relatedLinks),
        'h1' => $h1Text,
        'dataLetter' => $dataLetter,
        'pos4' => $pos4Val,
        'seoGuideCount' => $seoGuideCount,
        'infoContentCount' => $infoContentCount,
        'ghostCount' => $ghostCount,
        'visibleFaqs' => $visibleFaqs,
        'jsonFaqs' => $jsonFaqCount,
        'faqParity' => ($visibleFaqs === 6 && $jsonFaqCount === 6),
        'infoLength' => strlen($infoText)
    ];
}

echo json_encode([
    'totalSitemapUrls' => count($sitemapUrls),
    'audit' => $audit
], JSON_PRETTY_PRINT);
