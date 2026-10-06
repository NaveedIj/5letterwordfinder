<?php
$wordsJs = file_get_contents(__DIR__ . '/../words.js');
// Match array contents
if (preg_match('/const\s+wordList\s*=\s*\[(.*?)\];/s', $wordsJs, $matches)) {
    $words = explode(',', $matches[1]);
    $vWords = [];
    foreach ($words as $w) {
        $clean = trim($w, " \t\n\r\0\x0B\"'");
        if (strlen($clean) === 5 && str_ends_with(strtolower($clean), 'v')) {
            $vWords[] = $clean;
        }
    }
    echo "EXACT 5-letter words ending in V in words.js: " . count($vWords) . "\n";
    if (count($vWords) > 0) {
        print_r($vWords);
    }
} else {
    echo "Could not match wordList array.\n";
}
