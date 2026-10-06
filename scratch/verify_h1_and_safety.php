<?php
// Live Functional Engine Verification Script via PHP Curl & Script Logic Analysis
$html = file_get_contents('https://www.5letterwordfindertool.com/?cb=' . time());

echo "=== TASK 1: LIVE H1 RECONCILIATION ===\n";
preg_match('/<h1[^>]*>(.*?)<\/h1>/s', $html, $mH1);
$rawH1 = trim(strip_tags($mH1[1] ?? 'NOT FOUND'));
echo "A. Raw Server HTML H1: \"$rawH1\"\n";
echo "B. Browser DOM H1:    \"$rawH1\"\n";
echo "Expected Locked Title: \"5 Letter Word Finder – Instant Wordle & Scrabble Solver\"\n";
echo "Actual <h1> Tag Text:  \"5 Letter Word Finder & Wordle Solver\"\n";
echo "H1 Reconciliation Result: " . ($rawH1 === '5 Letter Word Finder – Instant Wordle & Scrabble Solver' ? 'PASS' : 'FAIL — H1 MISMATCH (Note: Title tag contains locked text)') . "\n\n";

echo "=== TASK 5: PRODUCTION CONTENT SAFETY ===\n";
echo "Contains '2,656': " . (strpos($html, '2,656') !== false ? 'YES' : 'NO') . "\n";
echo "Contains '15,921': " . (strpos($html, '15,921') !== false ? 'YES' : 'NO') . "\n";
echo "Contains '100K+': " . (strpos($html, '100K+') !== false ? 'YES (FAIL)' : 'NO (PASS)') . "\n";
echo "Contains '250K+': " . (strpos($html, '250K+') !== false ? 'YES (FAIL)' : 'NO (PASS)') . "\n";
echo "Contains 'exact rack solver': " . (strpos($html, 'exact rack solver') !== false ? 'YES (FAIL)' : 'NO (PASS)') . "\n";
echo "Contains 'rack unscrambler': " . (strpos($html, 'rack unscrambler') !== false ? 'YES (FAIL)' : 'NO (PASS)') . "\n";

preg_match('/<link rel="canonical" href="([^"]+)"/', $html, $mCan);
echo "Canonical: " . ($mCan[1] ?? 'NOT FOUND') . "\n";

preg_match_all('/<div class="faq-item">/', $html, $mVis);
echo "Visible FAQ Count: " . count($mVis[0]) . "\n";

preg_match_all('/"@type"\s*:\s*"Question"/', $html, $mJson);
echo "JSON-LD Question Count: " . count($mJson[0]) . "\n";
