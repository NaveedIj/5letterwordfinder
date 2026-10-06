<?php
$raw = file_get_contents('words.js');
$text = trim($raw);
$text = preg_replace('/^const wordList = /', '', $text);
$text = rtrim($text, ';');

$json = json_decode($text, true);

$filtered = array_values(array_filter($json, function($w) {
    return strlen($w) === 5;
}));

$unique = array_unique($filtered);

echo "1. fullList.length = " . count($json) . PHP_EOL;
echo "2. fullList.filter(w => w.length === WORD_LENGTH).length = " . count($filtered) . PHP_EOL;
echo "3. WORD_LENGTH = 5" . PHP_EOL;
echo "4. activeList.length (immediately after switching to Full mode) = " . count($filtered) . PHP_EOL;
echo "5. Unique filtered 5-letter count = " . count($unique) . PHP_EOL;
echo "6. Duplicate count = " . (count($filtered) - count($unique)) . PHP_EOL;
