<?php
$content = file_get_contents('words.js');
preg_match_all('/"([a-zA-Z]{5})"/', $content, $matches);
$fiveLetterWords = array_map('strtolower', $matches[1]);

function getEndingWords($letter, $words) {
    return array_values(array_filter($words, function($w) use ($letter) {
        return str_ends_with($w, strtolower($letter));
    }));
}

$xWords = getEndingWords('x', $fiveLetterWords);
$yWords = getEndingWords('y', $fiveLetterWords);
$zWords = getEndingWords('z', $fiveLetterWords);

echo "=== WORDS.JS DATASET EXTRACTION ===\n";
echo "1. Total 5-letter words ending in X: " . count($xWords) . "\n";
echo "   Sample X words: " . implode(", ", array_slice(array_map('strtoupper', $xWords), 0, 20)) . "\n\n";

echo "2. Total 5-letter words ending in Y: " . count($yWords) . "\n";
echo "   Sample Y words: " . implode(", ", array_slice(array_map('strtoupper', $yWords), 0, 20)) . "\n\n";

echo "3. Total 5-letter words ending in Z: " . count($zWords) . "\n";
echo "   Sample Z words: " . implode(", ", array_slice(array_map('strtoupper', $zWords), 0, 20)) . "\n";
