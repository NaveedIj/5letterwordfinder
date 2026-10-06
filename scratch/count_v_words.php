<?php
$content = file_get_contents('words.js');
preg_match_all('/"([a-zA-Z]{5})"/', $content, $matches);
$fiveLetterWords = $matches[1];

$vEnds = array_filter($fiveLetterWords, function($w) {
    return strtolower(substr($w, -1)) === 'v';
});

echo "Total 5-letter words in words.js: " . count($fiveLetterWords) . "\n";
echo "Total 5-letter words ending in V: " . count($vEnds) . "\n";
if (count($vEnds) > 0) {
    print_r($vEnds);
}
