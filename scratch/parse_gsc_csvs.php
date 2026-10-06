<?php
$uploadDir = 'C:/Users/dell/.gemini/antigravity/brain/e6c789ed-b8a7-4ab6-8534-a5a459397537/.user_uploaded/';
$pagesFile = $uploadDir . 'media_1787335637834.csv';
$queriesFile = $uploadDir . 'media_1787335730997.csv';

echo "=== GSC CSV DATA PARSER & DIAGNOSTIC ===\n\n";

$pages = [];
if (($handle = fopen($pagesFile, "r")) !== FALSE) {
    $header = fgetcsv($handle);
    while (($data = fgetcsv($handle)) !== FALSE) {
        if (count($data) >= 5) {
            $url = $data[0];
            $clicks = (int)$data[1];
            $impressions = (int)$data[2];
            $ctr = $data[3];
            $pos = (float)$data[4];
            $pages[] = [
                'url' => $url,
                'clicks' => $clicks,
                'impressions' => $impressions,
                'ctr' => $ctr,
                'position' => $pos
            ];
        }
    }
    fclose($handle);
}

echo "TOTAL PAGES IN GSC EXPORT: " . count($pages) . "\n\n";
echo sprintf("%-65s | %-6s | %-11s | %-7s | %-8s | %-15s\n", "Page URL", "Clicks", "Impressions", "CTR", "Position", "Sample Level");
echo str_repeat("-", 125) . "\n";

foreach ($pages as $p) {
    $imp = $p['impressions'];
    $sample = 'VERY LOW (<50)';
    if ($imp >= 500) $sample = 'STRONGER (500+)';
    else if ($imp >= 100) $sample = 'MODERATE (100-499)';
    else if ($imp >= 50) $sample = 'LOW (50-99)';
    
    printf("%-65s | %-6d | %-11d | %-7s | %-8.2f | %-15s\n", substr($p['url'], 0, 65), $p['clicks'], $p['impressions'], $p['ctr'], $p['position'], $sample);
}

$queries = [];
if (($handle = fopen($queriesFile, "r")) !== FALSE) {
    $header = fgetcsv($handle);
    while (($data = fgetcsv($handle)) !== FALSE) {
        if (count($data) >= 5) {
            $q = $data[0];
            $clicks = (int)$data[1];
            $impressions = (int)$data[2];
            $ctr = $data[3];
            $pos = (float)$data[4];
            $queries[] = [
                'query' => $q,
                'clicks' => $clicks,
                'impressions' => $impressions,
                'ctr' => $ctr,
                'position' => $pos
            ];
        }
    }
    fclose($handle);
}

echo "\n\nTOTAL QUERIES IN GSC EXPORT: " . count($queries) . "\n";
echo "TOP 15 QUERIES BY IMPRESSIONS:\n";
echo sprintf("%-45s | %-6s | %-11s | %-7s | %-8s\n", "Query", "Clicks", "Impressions", "CTR", "Position");
echo str_repeat("-", 90) . "\n";
for ($i = 0; $i < min(15, count($queries)); $i++) {
    $q = $queries[$i];
    printf("%-45s | %-6d | %-11d | %-7s | %-8.2f\n", substr($q['query'], 0, 45), $q['clicks'], $q['impressions'], $q['ctr'], $q['position']);
}
