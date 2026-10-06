<?php
$queriesFile = 'C:/Users/dell/.gemini/antigravity/brain/e6c789ed-b8a7-4ab6-8534-a5a459397537/.user_uploaded/media_1787335730997.csv';
$handle = fopen($queriesFile, 'r');
$header = fgetcsv($handle);

$exactPlayWordle = null;
$exactWordleGameOnline = null;
$relatedWordleQueries = [];

while (($data = fgetcsv($handle)) !== FALSE) {
    if (count($data) >= 5) {
        $q = trim($data[0]);
        $qLower = strtolower($q);
        
        if ($qLower === 'play wordle') {
            $exactPlayWordle = $data;
        }
        if ($qLower === 'wordle game online') {
            $exactWordleGameOnline = $data;
        }
        if (strpos($qLower, 'wordle') !== false) {
            $relatedWordleQueries[] = $data;
        }
    }
}
fclose($handle);

echo "=== TASK 1: EXACT QUERY FORENSIC AUDIT ===\n";
echo "Exact Query 'play wordle': " . ($exactPlayWordle ? implode(' | ', $exactPlayWordle) : "NOT VERIFIED — QUERY NOT PRESENT IN SUPPLIED GSC QUERY EXPORT") . "\n";
echo "Exact Query 'wordle game online': " . ($exactWordleGameOnline ? implode(' | ', $exactWordleGameOnline) : "NOT VERIFIED — QUERY NOT PRESENT IN SUPPLIED GSC QUERY EXPORT") . "\n\n";

echo "=== TASK 2: RELATED BUT UNMATCHED QUERIES (WORDLE FAMILY) ===\n";
echo "Total Wordle-related queries found in CSV: " . count($relatedWordleQueries) . "\n";
echo sprintf("%-40s | %-6s | %-11s | %-7s | %-8s\n", "Query", "Clicks", "Impressions", "CTR", "Position");
echo str_repeat("-", 85) . "\n";
for ($i = 0; $i < min(15, count($relatedWordleQueries)); $i++) {
    $row = $relatedWordleQueries[$i];
    printf("%-40s | %-6s | %-11s | %-7s | %-8s\n", $row[0], $row[1], $row[2], $row[3], $row[4]);
}
