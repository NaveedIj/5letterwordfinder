<?php
$html = file_get_contents('https://www.5letterwordfindertool.com/5-letter-words-ending-with-v.html');
echo "Searching for spiev in live V HTML: " . (str_contains(strtolower($html), 'spiev') ? 'FOUND' : 'NOT FOUND') . "\n";
echo "Searching for brav in live V HTML: " . (str_contains(strtolower($html), 'brav') ? 'FOUND' : 'NOT FOUND') . "\n";

// Let's print occurrences of 'brav'
preg_match_all('/.{0,30}brav.{0,30}/i', $html, $matches);
print_r($matches[0]);
