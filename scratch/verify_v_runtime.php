<?php
// Simulate script.js logic for 5-letter-words-ending-with-v.html
$wordsJs = file_get_contents(__DIR__ . '/../words.js');
preg_match_all('/"([a-zA-Z]{5})"/', $wordsJs, $matches);
$all5LetterWords = $matches[1];

// 1. Full list (words.js)
$vEndingFull = array_filter($all5LetterWords, function($w) {
    return strtolower(substr($w, -1)) === 'v';
});

// 2. Strict Wordle dictionary (if seo-data.js or strict dictionary is active)
// Check seo-data.js to see if strict list is populated for V
$seoDataContent = file_get_contents(__DIR__ . '/../seo-data.js');

echo "=== V RUNTIME AUDIT ===\n";
echo "1. Exact matching 5-letter words ending in V in broad words.js (" . count($vEndingFull) . " words):\n";
echo implode(", ", array_map('strtoupper', $vEndingFull)) . "\n\n";

if (str_contains($seoDataContent, '"V":')) {
    echo "2. seo-data.js defines custom strict list for V.\n";
} else {
    echo "2. seo-data.js does NOT define custom strict list for V.\n";
}
