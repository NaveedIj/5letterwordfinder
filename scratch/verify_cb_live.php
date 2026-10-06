<?php
$html = file_get_contents('https://www.5letterwordfindertool.com/?cb=' . time());
echo "=== BYPASSED LIVE HOMEPAGE AUDIT ===\n";
echo "HTML Length: " . strlen($html) . "\n";

preg_match('/<h1[^>]*>(.*?)<\/h1>/s', $html, $mH1);
$h1Text = trim(strip_tags($mH1[1] ?? 'NOT FOUND'));
echo "1. H1 Text: $h1Text\n";

preg_match('/id="statWordCount">(.*?)<\/span>/', $html, $mStat);
$statVal = $mStat[1] ?? 'NOT FOUND';
echo "2. #statWordCount: $statVal\n";

$hasCrane = strpos($html, 'CRANE test several different letters') !== false;
echo "3. Has Commit 95bb911 CRANE text: " . ($hasCrane ? 'YES' : 'NO') . "\n";
