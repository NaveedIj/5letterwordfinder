<?php
$raw = file_get_contents('data/wordle-common.json');
$arr = json_decode($raw, true);
if ($arr !== null) {
    echo "wordle-common.json count: " . count($arr) . "\n";
} else {
    echo "JSON decode failed, error: " . json_last_error_msg() . "\n";
}

$js = file_get_contents('words.js');
preg_match_all('/"([a-z]{5})"/', $js, $m);
echo "words.js 5-letter regex matches: " . count($m[1]) . "\n";
