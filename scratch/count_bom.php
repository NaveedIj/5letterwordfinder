<?php
$str = file_get_contents('data/wordle-common.json');
// Remove BOM if present
$str = preg_replace('/^\xEF\xBB\xBF/', '', $str);
$data = json_decode($str, true);
if (is_array($data)) {
    echo "wordle-common.json EXACT COUNT: " . count($data) . "\n";
} else {
    echo "JSON Decode failed: " . json_last_error_msg() . "\n";
}
