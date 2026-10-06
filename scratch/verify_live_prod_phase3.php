<?php
$html = file_get_contents('https://www.5letterwordfindertool.com/');
echo "=== LIVE PRODUCTION HOMEPAGE AUDIT ===\n";
echo "HTML Length: " . strlen($html) . "\n";

// 1. H1
preg_match('/<h1[^>]*>(.*?)<\/h1>/s', $html, $mH1);
$h1Text = trim(strip_tags($mH1[1] ?? 'NOT FOUND'));
echo "1. H1 Text: $h1Text\n";
echo "   Match Expected: " . ($h1Text === '5 Letter Word Finder – Instant Wordle & Scrabble Solver' ? 'YES' : 'NO') . "\n";

// 2. Stat Word Count
preg_match('/id="statWordCount">(.*?)<\/span>/', $html, $mStat);
$statVal = $mStat[1] ?? 'NOT FOUND';
echo "2. #statWordCount: $statVal\n";
echo "   Match Expected (2,656): " . ($statVal === '2,656' ? 'YES' : 'NO') . "\n";

// 3. Full dictionary figure
$has15921 = strpos($html, '15,921') !== false;
echo "3. Contains '15,921': " . ($has15921 ? 'YES' : 'NO') . "\n";

// 4. Visible FAQs
preg_match_all('/<div class="faq-item">/', $html, $mFaq);
$visibleFaqCount = count($mFaq[0]);
echo "4. Visible FAQ Count: $visibleFaqCount (Expected 8: " . ($visibleFaqCount === 8 ? 'YES' : 'NO') . ")\n";

// 5. JSON-LD FAQs
preg_match_all('/"@type"\s*:\s*"Question"/', $html, $mJsonFaq);
$jsonFaqCount = count($mJsonFaq[0]);
echo "5. JSON-LD Question Count: $jsonFaqCount (Expected 8: " . ($jsonFaqCount === 8 ? 'YES' : 'NO') . ")\n";

// 6. Forbidden terms check
$has100k = strpos($html, '100K+') !== false;
$has250k = strpos($html, '250K+') !== false;
$hasRack = strpos($html, 'exact rack solver') !== false;
echo "6. Forbidden Terms Found:\n";
echo "   - '100K+': " . ($has100k ? 'YES (FAIL)' : 'NO (PASS)') . "\n";
echo "   - '250K+': " . ($has250k ? 'YES (FAIL)' : 'NO (PASS)') . "\n";
echo "   - 'exact rack solver': " . ($hasRack ? 'YES (FAIL)' : 'NO (PASS)') . "\n";

// 7. Canonical URL
preg_match('/<link rel="canonical" href="([^"]+)"/', $html, $mCan);
$canonical = $mCan[1] ?? 'NOT FOUND';
echo "7. Canonical URL: $canonical\n";
echo "   Match Expected: " . ($canonical === 'https://www.5letterwordfindertool.com/' ? 'YES' : 'NO') . "\n";

// 8. Commit text verification (Phase 3A.4 micro-copy check)
$hasCraneMicro = strpos($html, 'Starting guesses like CRANE test several different letters at once, helping narrow down the remaining candidate list.') !== false;
echo "8. Micro-copy Verification (CRANE Refinement Present): " . ($hasCraneMicro ? 'YES' : 'NO') . "\n";
