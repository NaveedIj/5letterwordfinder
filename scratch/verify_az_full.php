<?php
$alphabet = range('a', 'z');
$results = [];

foreach ($alphabet as $let) {
    $char = strtoupper($let);
    $url = "https://www.5letterwordfindertool.com/5-letter-words-ending-with-{$let}.html";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) FullAZRegression/1.0');
    $html = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($code !== 200) {
        $results[$char] = ["code" => $code, "pass" => false, "msg" => "HTTP $code"];
        continue;
    }
    
    $doc = new DOMDocument();
    @$doc->loadHTML($html);
    $xpath = new DOMXPath($doc);
    
    $h1 = $xpath->query('//h1');
    $h1Count = $h1->length;
    $h1Text = $h1Count > 0 ? trim($h1->item(0)->textContent) : '';
    
    $body = $xpath->query('//body')->item(0);
    $dataLetter = $body ? $body->getAttribute('data-letter') : '';
    
    $pos4 = $xpath->query('//input[@id="pos4"]')->item(0);
    $pos4Val = $pos4 ? $pos4->getAttribute('value') : '';
    
    $seoGuide = $xpath->query('//*[contains(@class, "seo-guide-section")]');
    $infoContent = $xpath->query('//*[contains(@class, "info-content")]');
    $helpful = $xpath->query('//*[contains(text(), "Helpful Guides")]');
    
    $visibleFaqs = $xpath->query('//details[contains(@class, "faq-item")]');
    $scripts = $xpath->query('//script[@type="application/ld+json"]');
    $jsonFaqCount = 0;
    foreach ($scripts as $s) {
        $json = json_decode($s->textContent, true);
        if (isset($json['@type']) && $json['@type'] === 'FAQPage' && isset($json['mainEntity'])) {
            $jsonFaqCount = count($json['mainEntity']);
        }
    }
    
    $pass = ($code === 200 && $h1Count === 1 && $dataLetter === $char && $pos4Val === $char && $seoGuide->length === 1 && $infoContent->length === 1 && $helpful->length === 0 && $visibleFaqs->length === 6 && $jsonFaqCount === 6);
    
    $results[$char] = [
        "code" => $code,
        "h1" => $h1Text,
        "dataLetter" => $dataLetter,
        "pos4" => $pos4Val,
        "seoGuide" => $seoGuide->length,
        "infoContent" => $infoContent->length,
        "ghost" => $helpful->length,
        "faqVisible" => $visibleFaqs->length,
        "faqJson" => $jsonFaqCount,
        "pass" => $pass
    ];
}

echo json_encode($results, JSON_PRETTY_PRINT);
