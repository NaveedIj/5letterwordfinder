<?php
$yUrl = 'https://www.5letterwordfindertool.com/5-letter-words-ending-with-y.html';
$zUrl = 'https://www.5letterwordfindertool.com/5-letter-words-ending-with-z.html';

echo "=== 1. VERIFYING LIVE Y PAGE ===\n";
$ch = curl_init($yUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LiveZFixCheck/1.0');
$yHtml = curl_exec($ch);
$yCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $yCode\n";
if ($yCode !== 200) {
    echo "FAILED Y HTTP 200!\n";
    exit;
}

$yDoc = new DOMDocument();
@$yDoc->loadHTML($yHtml);
$yXpath = new DOMXPath($yDoc);

$zLinksInY = $yXpath->query('//div[contains(@class, "info-box")]/h3[contains(text(), "Related Word Tools")]/following-sibling::ul//a[@href="5-letter-words-ending-with-z.html"]');
echo "Z Link in Y Related Tools: " . ($zLinksInY->length === 1 ? "FOUND (1/1)" : "MISSING (Count: " . $zLinksInY->length . ")") . "\n";
if ($zLinksInY->length > 0) {
    echo "Anchor Text: " . trim($zLinksInY->item(0)->textContent) . "\n";
    echo "Href: " . trim($zLinksInY->item(0)->getAttribute('href')) . "\n";
}

echo "\n=== 2. VERIFYING LIVE Z PAGE ===\n";
$ch = curl_init($zUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LiveZFixCheck/1.0');
$zHtml = curl_exec($ch);
$zCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $zCode\n";
if ($zCode !== 200) {
    echo "FAILED Z HTTP 200!\n";
    exit;
}

$zDoc = new DOMDocument();
@$zDoc->loadHTML($zHtml);
$zXpath = new DOMXPath($zDoc);

$h1 = $zXpath->query('//h1');
$body = $zXpath->query('//body')->item(0);
$pos4 = $zXpath->query('//input[@id="pos4"]')->item(0);
$canon = $zXpath->query('//link[@rel="canonical"]');
$robots = $zXpath->query('//meta[@name="robots"]');
$faqs = $zXpath->query('//details[contains(@class, "faq-item")]');

echo "H1: " . ($h1->length > 0 ? trim($h1->item(0)->textContent) : "MISSING") . "\n";
echo "Canonical: " . ($canon->length > 0 ? trim($canon->item(0)->getAttribute('href')) : "MISSING") . "\n";
echo "Robots: " . ($robots->length > 0 ? trim($robots->item(0)->getAttribute('content')) : "MISSING") . "\n";
echo "body data-letter: " . ($body ? $body->getAttribute('data-letter') : "MISSING") . "\n";
echo "#pos4 value: " . ($pos4 ? $pos4->getAttribute('value') : "MISSING") . "\n";
echo "Visible FAQs: " . $faqs->length . "\n";
