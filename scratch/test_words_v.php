<?php
$wordsContent = file_get_contents(__DIR__ . '/../words.js');
// words.js defines const WORDS = [...] or var WORDS = [...]
preg_match('/\[(.*?)\]/s', $wordsContent, $matches);
if (isset($matches[1])) {
    $rawWords = explode(',', $matches[1]);
    $vWords = [];
    foreach ($rawWords as $w) {
        $clean = strtolower(trim($w, " \t\n\r\0\x0B\"'"));
        if (strlen($clean) === 5 && str_ends_with($clean, 'v')) {
            $vWords[] = $clean;
        }
    }
    echo "Total 5-letter words ending in V in words.js: " . count($vWords) . "\n";
} else {
    echo "Could not parse words.js\n";
}
