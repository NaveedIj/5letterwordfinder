<?php
$c = file_get_contents('words.js');
preg_match_all('/"([a-zA-Z]{5})"/', $c, $m);
// In words.js: const commonWords = [...]; const allWords = [...];
// Let's parse JS arrays properly
if (preg_match('/const\s+commonWords\s*=\s*\[(.*?)\];/s', $c, $m1)) {
    preg_match_all('/"([a-zA-Z]{5})"/', $m1[1], $w1);
    echo "commonWords count: " . count($w1[1]) . "\n";
}
if (preg_match('/const\s+allWords\s*=\s*\[(.*?)\];/s', $c, $m2)) {
    preg_match_all('/"([a-zA-Z]{5})"/', $m2[1], $w2);
    echo "allWords count: " . count($w2[1]) . "\n";
}
