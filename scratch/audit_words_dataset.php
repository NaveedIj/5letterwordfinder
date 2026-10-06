<?php
$content = file_get_contents('words.js');

// Count 5-letter words in wordList
preg_match('/const wordList\s*=\s*\[(.*?)\];/s', $content, $m1);
$words = [];
if (!empty($m1[1])) {
    $rawWords = explode(',', $m1[1]);
    foreach ($rawWords as $w) {
        $w = trim($w, " \"'\r\n\t");
        if (strlen($w) === 5) {
            $words[] = $w;
        }
    }
}

// Count 5-letter words in WORDLE_VALID / WORDLE_ANSWERS if present
preg_match('/const WORDLE_VALID\s*=\s*\[(.*?)\];/s', $content, $m2);
$wordleValid = [];
if (!empty($m2[1])) {
    $rawWords = explode(',', $m2[1]);
    foreach ($rawWords as $w) {
        $w = trim($w, " \"'\r\n\t");
        if (strlen($w) === 5) {
            $wordleValid[] = $w;
        }
    }
}

preg_match('/const WORDLE_ANSWERS\s*=\s*\[(.*?)\];/s', $content, $m3);
$wordleAnswers = [];
if (!empty($m3[1])) {
    $rawWords = explode(',', $m3[1]);
    foreach ($rawWords as $w) {
        $w = trim($w, " \"'\r\n\t");
        if (strlen($w) === 5) {
            $wordleAnswers[] = $w;
        }
    }
}

echo "Total 5-letter words in wordList: " . count($words) . "\n";
echo "Total 5-letter words in WORDLE_VALID: " . count($wordleValid) . "\n";
echo "Total 5-letter words in WORDLE_ANSWERS: " . count($wordleAnswers) . "\n";

// Also check script.js for dictionary filtering logic
$scriptContent = file_get_contents('script.js');
preg_match_all('/(?:const|var|let)\s+([a-zA-Z0-9_]+)/', $scriptContent, $scriptVars);
echo "Script.js variables: " . implode(', ', array_unique($scriptVars[1])) . "\n";
