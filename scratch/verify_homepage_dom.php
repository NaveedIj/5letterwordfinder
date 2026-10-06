<?php
$html = file_get_contents('index.html');
$doc = new DOMDocument();
@$doc->loadHTML($html);
$xpath = new DOMXPath($doc);

$statNode = $xpath->query('//*[@id="statWordCount"]');
$statValue = $statNode->length > 0 ? trim($statNode->item(0)->textContent) : 'MISSING';

echo "=== HOMEPAGE DOM VERIFICATION ===\n";
echo "Rendered #statWordCount value: $statValue\n";

if ($statValue === '2,656') {
    echo "VERIFICATION PASS: #statWordCount is 2,656\n";
} else {
    echo "VERIFICATION FAIL: #statWordCount is $statValue\n";
}
