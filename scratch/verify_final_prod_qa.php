<?php
$cb = time();
$url = 'https://www.5letterwordfindertool.com/?cb=' . $cb;
$html = file_get_contents($url);

echo "=== TASK 1: RAW PRODUCTION HTML H1 ===\n";
preg_match('/<h1[^>]*>(.*?)<\/h1>/s', $html, $mH1);
$rawH1 = trim(strip_tags($mH1[1] ?? 'NOT FOUND'));
$expectedH1 = '5 Letter Word Finder – Instant Wordle & Scrabble Solver';

// Normalize HTML entities for comparison
$normalizedRawH1 = html_entity_decode($rawH1, ENT_QUOTES | ENT_HTML5, 'UTF-8');

echo "Raw Server H1: \"$rawH1\"\n";
echo "Normalized Raw H1: \"$normalizedRawH1\"\n";
echo "Expected H1: \"$expectedH1\"\n";
echo "Task 1 Status: " . ($normalizedRawH1 === $expectedH1 ? "PASS" : "FAIL") . "\n\n";

echo "=== TASK 3: CORE FACTUAL CHECKS ===\n";
preg_match('/id="statWordCount">(.*?)<\/span>/', $html, $mStat);
$statVal = $mStat[1] ?? 'NOT FOUND';
echo "#statWordCount: $statVal (Expected: 2,656) -> " . ($statVal === '2,656' ? 'PASS' : 'FAIL') . "\n";
echo "15,921 Present: " . (strpos($html, '15,921') !== false ? 'PASS' : 'FAIL') . "\n\n";

echo "=== TASK 4: FAQ PARITY CHECK ===\n";
preg_match_all('/<div class="faq-item">\s*<strong>(.*?)<\/strong>\s*<p>(.*?)<\/p>\s*<\/div>/s', $html, $mVis, PREG_SET_ORDER);
preg_match('/<script type="application\/ld\+json">(.*?)<\/script>/s', $html, $mJson);
$jsonObj = json_decode($mJson[1] ?? '{}', true);

$faqGraph = [];
if (isset($jsonObj['@graph'])) {
    foreach ($jsonObj['@graph'] as $node) {
        if (($node['@type'] ?? '') === 'FAQPage') {
            $faqGraph = $node['mainEntity'] ?? [];
            break;
        }
    }
}

echo "Visible FAQ Count: " . count($mVis) . " (Expected: 8)\n";
echo "JSON-LD FAQ Count: " . count($faqGraph) . " (Expected: 8)\n";

$faqParityPass = true;
if (count($mVis) === 8 && count($faqGraph) === 8) {
    for ($i = 0; $i < 8; $i++) {
        $qV = trim(strip_tags($mVis[$i][1]));
        $aV = trim(strip_tags($mVis[$i][2]));
        $qJ = trim($faqGraph[$i]['name'] ?? '');
        $aJ = trim($faqGraph[$i]['acceptedAnswer']['text'] ?? '');
        if ($qV !== $qJ || $aV !== $aJ) $faqParityPass = false;
    }
} else {
    $faqParityPass = false;
}
echo "100% FAQ Parity Status: " . ($faqParityPass ? 'PASS' : 'FAIL') . "\n\n";

echo "=== TASK 5: SEO / SAFETY CHECK ===\n";
preg_match('/<link rel="canonical" href="([^"]+)"/', $html, $mCan);
$can = $mCan[1] ?? 'NOT FOUND';
echo "Canonical: $can (Expected: https://www.5letterwordfindertool.com/) -> " . ($can === 'https://www.5letterwordfindertool.com/' ? 'PASS' : 'FAIL') . "\n";

$forbiddenFound = false;
$forbiddenTerms = ['100K+', '250K+', 'exact rack solver', 'rack unscrambler', 'perfectly satisfying user expectations'];
foreach ($forbiddenTerms as $term) {
    if (strpos($html, $term) !== false) {
        echo "FORBIDDEN TERM FOUND: \"$term\"\n";
        $forbiddenFound = true;
    }
}
echo "Forbidden Terms Safety Status: " . (!$forbiddenFound ? 'PASS' : 'FAIL') . "\n";
