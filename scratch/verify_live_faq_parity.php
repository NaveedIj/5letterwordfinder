<?php
$html = file_get_contents('https://www.5letterwordfindertool.com/');

// Extract JSON-LD FAQs
preg_match('/<script type="application\/ld\+json">(.*?)<\/script>/s', $html, $mJson);
$jsonObj = json_decode($mJson[1] ?? '{}', true);

$faqGraph = null;
if (isset($jsonObj['@graph'])) {
    foreach ($jsonObj['@graph'] as $node) {
        if (($node['@type'] ?? '') === 'FAQPage') {
            $faqGraph = $node['mainEntity'] ?? [];
            break;
        }
    }
}

echo "=== FAQ JSON-LD PARITY AUDIT ===\n";
echo "JSON-LD FAQ Node Count: " . count($faqGraph ?? []) . "\n";

// Extract Visible FAQs
preg_match_all('/<div class="faq-item">\s*<strong>(.*?)<\/strong>\s*<p>(.*?)<\/p>\s*<\/div>/s', $html, $mVis, PREG_SET_ORDER);
echo "Visible HTML FAQ Count: " . count($mVis) . "\n\n";

echo "=== 1-TO-1 FAQ PARITY RESULTS ===\n";
for ($i = 0; $i < count($mVis); $i++) {
    $qVis = trim(strip_tags($mVis[$i][1]));
    $aVis = trim(strip_tags($mVis[$i][2]));
    
    $qJson = trim($faqGraph[$i]['name'] ?? '');
    $aJson = trim($faqGraph[$i]['acceptedAnswer']['text'] ?? '');
    
    $qMatch = ($qVis === $qJson);
    $aMatch = ($aVis === $aJson);
    
    echo "FAQ " . ($i + 1) . ":\n";
    echo "  Visible Question: $qVis\n";
    echo "  JSON-LD Question: $qJson\n";
    echo "  Question Parity Match: " . ($qMatch ? 'YES' : 'NO') . "\n";
    echo "  Answer Parity Match: " . ($aMatch ? 'YES' : 'NO') . "\n\n";
}
