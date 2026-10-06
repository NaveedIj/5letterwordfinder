<?php
$json = file_get_contents('data/wordle-common.json');
$arr = json_decode($json, true);
echo "wordle-common.json count: " . count($arr) . "\n";
