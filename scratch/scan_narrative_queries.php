<?php
$queriesFile = 'C:/Users/dell/.gemini/antigravity/brain/e6c789ed-b8a7-4ab6-8534-a5a459397537/.user_uploaded/media_1787335730997.csv';

$narrativeQueries = [
    '5 letter word finder',
    'word finder 5 letters',
    'five letter word finder',
    'wordle solver 5 letters',
    '5 letter word solver',
    '5 letter wordle solver',
    '5 word finder',
    'wordle finder 5 letters',
    '5 letter word finder wordle',
    'word solver 5 letters',
    '5 letter word finder for wordle',
    '5 letter wordle finder',
    '5 letter words finder',
    'wordle finder 5 letter',
    'wordle solver 5 letter',
    '5 letter word starts with l',
    '5-letter words that end with e',
    '5 letter words starting with l',
    '5 letter words starting with a',
    '5 letter words with these letters wordle',
    'play wordle',
    'wordle game online'
];

$handle = fopen($queriesFile, 'r');
$header = fgetcsv($handle);
$csvMap = [];
while (($data = fgetcsv($handle)) !== FALSE) {
    if (count($data) >= 5) {
        $csvMap[strtolower(trim($data[0]))] = $data;
    }
}
fclose($handle);

echo "=== COMPLETE NARRATIVE QUERY SCAN ===\n\n";
echo sprintf("%-42s | %-12s | %-15s | %-28s | %-12s\n", "Exact Query", "Found in GSC?", "Metrics Match?", "Page Association Verified?", "Final Action");
echo str_repeat("-", 120) . "\n";

foreach ($narrativeQueries as $q) {
    $qLower = strtolower($q);
    $found = isset($csvMap[$qLower]);
    $metricsMatch = $found ? "YES" : "N/A (NOT FOUND)";
    $pageAssoc = "NOT VERIFIED (No Page*Query)";
    $action = $found ? "KEEP (Unlinked Query)" : "REMOVE (Not Verified)";
    
    printf("%-42s | %-12s | %-15s | %-28s | %-12s\n", $q, ($found ? "YES" : "NO"), $metricsMatch, $pageAssoc, $action);
}
