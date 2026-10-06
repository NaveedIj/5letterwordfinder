<?php
$pages = ['e', 'h', 'i', 'j', 'k', 'l'];

foreach ($pages as $p) {
    $filename = "5-letter-words-ending-with-{$p}.html";
    $path = "c:/laragon/www/5-letter-word-finder/{$filename}";
    $html = file_get_contents($path);

    // 1. Data-letter check
    preg_match('/data-letter="([^"]+)"/', $html, $mLetter);
    $dataLetter = $mLetter[1] ?? 'NONE';

    // 2. Prefilled position 4 check
    preg_match('/id="pos4"[^>]*value="([^"]+)"/', $html, $mPos4);
    $pos4Val = $mPos4[1] ?? 'NONE';

    // 3. Count .seo-guide-section
    $seoGuideCount = substr_count($html, 'class="seo-guide-section"');

    // 4. Count .info-content
    $infoContentCount = substr_count($html, 'class="info-content"');

    // 5. Check Helpful Guides
    $hasHelpfulGuides = (strpos($html, 'Helpful Guides') !== false) ? 'YES' : 'NO';

    // 6. Check exact H1
    preg_match('/<h1[^>]*>(.*?)<\/h1>/s', $html, $mH1);
    $h1Text = isset($mH1[1]) ? trim(strip_tags($mH1[1])) : 'NONE';

    echo "FILE: {$filename}\n";
    echo "  data-letter: {$dataLetter}\n";
    echo "  pos4 value: {$pos4Val}\n";
    echo "  H1 text: {$h1Text}\n";
    echo "  .seo-guide-section count: {$seoGuideCount}\n";
    echo "  .info-content count: {$infoContentCount}\n";
    echo "  Helpful Guides present: {$hasHelpfulGuides}\n";
    echo "-------------------------------------------\n";
}
