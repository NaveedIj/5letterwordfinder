<?php
$files = [
    '5-letter-words-ending-with-x.html',
    '5-letter-words-ending-with-y.html',
    '5-letter-words-ending-with-z.html'
];

foreach ($files as $f) {
    echo "===========================================\n";
    echo "AUDITING PROTOTYPE: $f\n";
    $content = file_get_contents($f);
    
    $doc = new DOMDocument();
    @$doc->loadHTML($content);
    $xpath = new DOMXPath($doc);
    
    // 1. Data letter
    $body = $xpath->query('//body')->item(0);
    $dataLetter = $body ? $body->getAttribute('data-letter') : 'NONE';
    echo "  body data-letter: $dataLetter\n";
    
    // 2. pos4
    $pos4 = $xpath->query('//input[@id="pos4"]')->item(0);
    $pos4Val = $pos4 ? $pos4->getAttribute('value') : 'NONE';
    echo "  #pos4 value: $pos4Val\n";
    
    // 3. H1
    $h1s = $xpath->query('//h1');
    echo "  H1 count: " . $h1s->length . "\n";
    if ($h1s->length > 0) {
        echo "  H1 text: " . trim($h1s->item(0)->textContent) . "\n";
    }
    
    // 4. .seo-guide-section
    $seoSections = $xpath->query('//*[contains(@class, "seo-guide-section")]');
    echo "  .seo-guide-section count: " . $seoSections->length . "\n";
    
    // 5. .info-content
    $infoContents = $xpath->query('//*[contains(@class, "info-content")]');
    echo "  .info-content count: " . $infoContents->length . "\n";
    
    // 6. Ghost content / Helpful Guides
    $helpful = $xpath->query('//*[contains(text(), "Helpful Guides")]');
    echo "  Helpful Guides count: " . $helpful->length . "\n";
    
    // 7. FAQs visible vs JSON-LD
    $visibleFaqs = $xpath->query('//details[contains(@class, "faq-item")]');
    echo "  Visible FAQ count: " . $visibleFaqs->length . "\n";
    
    // Extract JSON-LD FAQPage
    $scripts = $xpath->query('//script[@type="application/ld+json"]');
    $jsonFaqCount = 0;
    foreach ($scripts as $s) {
        $json = json_decode($s->textContent, true);
        if (isset($json['@type']) && $json['@type'] === 'FAQPage' && isset($json['mainEntity'])) {
            $jsonFaqCount = count($json['mainEntity']);
        }
    }
    echo "  JSON-LD FAQ count: " . $jsonFaqCount . "\n";
    echo "  FAQ 1:1 Match: " . ($visibleFaqs->length === $jsonFaqCount && $jsonFaqCount === 6 ? "YES (6/6)" : "NO") . "\n";
}
