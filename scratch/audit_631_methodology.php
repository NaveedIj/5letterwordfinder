<?php
$queriesFile = 'C:/Users/dell/.gemini/antigravity/brain/e6c789ed-b8a7-4ab6-8534-a5a459397537/.user_uploaded/media_1787335730997.csv';

$handle = fopen($queriesFile, 'r');
$header = fgetcsv($handle);
$gscQueries = [];
while (($data = fgetcsv($handle)) !== FALSE) {
    if (count($data) >= 5) {
        $gscQueries[strtolower(trim($data[0]))] = $data;
    }
}
fclose($handle);

$p62Queries = [
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

echo "=== FULL NARRATIVE EXTRACTION TABLE ===\n\n";
echo sprintf("%-3s | %-42s | %-25s | %-20s\n", "#", "Exact Query Text", "Location in Phase 6.2", "Found in GSC CSV?");
echo str_repeat("-", 95) . "\n";

$i = 1;
foreach ($p62Queries as $q) {
    $qLower = strtolower($q);
    $found = isset($gscQueries[$qLower]) ? "YES" : "NOT VERIFIED";
    $loc = "Section " . ($i <= 15 ? "7/9 Query Table" : ($i <= 20 ? "Section 9 Query Audit" : "Section 1 Exact Audit"));
    printf("%-3d | %-42s | %-25s | %-20s\n", $i, $q, $loc, $found);
    $i++;
}
