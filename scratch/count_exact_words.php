<?php
// Exact counting script
$fullContent = file_get_contents('words.js');
preg_match_all('/"([a-z]{5})"/', $fullContent, $matchesFull);
$uniqueFull5 = array_unique($matchesFull[1]);

$jsonContent = file_get_contents('data/wordle-common.json');
preg_match_all('/"([a-z]{5})"/', $jsonContent, $matchesCommon);
$uniqueCommon5 = array_unique($matchesCommon[1]);

echo "Unique 5-letter words in words.js (fullList): " . count($uniqueFull5) . "\n";
echo "Unique 5-letter words in data/wordle-common.json (commonList): " . count($uniqueCommon5) . "\n";
