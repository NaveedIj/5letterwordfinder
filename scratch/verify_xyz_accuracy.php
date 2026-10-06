<?php
$content = file_get_contents('words.js');
preg_match_all('/"([a-zA-Z]{5})"/', $content, $matches);
$fiveLetterWords = array_flip(array_map('strtolower', $matches[1]));

$checks = [
    'X' => ['AFFIX', 'ADMIX', 'RELAX', 'BORAX', 'ADDAX', 'INDEX', 'ANNEX', 'DETOX'],
    'Y' => ['ABBEY', 'AGONY', 'EVERY', 'EMPTY', 'DAILY', 'STORY'],
    'Z' => ['BLITZ', 'FRITZ', 'ABUZZ', 'FRIZZ', 'HAFIZ', 'GROSZ']
];

echo "=== ACCURACY RECHECK AGAINST WORDS.JS ===\n";
foreach ($checks as $letter => $words) {
    echo "--- LETTER $letter ---\n";
    foreach ($words as $w) {
        $lower = strtolower($w);
        $len = strlen($w);
        $endsWith = str_ends_with($lower, strtolower($letter));
        $inDict = isset($fiveLetterWords[$lower]);
        
        $pass = ($len === 5 && $endsWith && $inDict);
        echo "  Word '$w': Length=$len, EndsWith$letter=" . ($endsWith ? "YES" : "NO") . ", InWordsJs=" . ($inDict ? "YES" : "NO") . " => " . ($pass ? "PASS" : "FAIL") . "\n";
    }
}
