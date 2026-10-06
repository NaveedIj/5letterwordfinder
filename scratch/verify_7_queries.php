<?php
$csvPath = 'C:/Users/dell/.gemini/antigravity/brain/e6c789ed-b8a7-4ab6-8534-a5a459397537/.user_uploaded/media_1787335730997.csv';

$targets = [
    'wordle help 5 letters',
    '5 letter word hints',
    '5 letter word tips',
    'wordle word tips 5 letters',
    'what is a 5 letter word',
    'how many 5 letter words are there',
    '5 letter word calculator'
];

$handle = fopen($csvPath, 'r');
$header = fgetcsv($handle);

$csvData = [];
while (($row = fgetcsv($handle)) !== FALSE) {
    if (count($row) >= 5) {
        $qClean = strtolower(trim($row[0]));
        $csvData[$qClean] = [
            'raw_query' => trim($row[0]),
            'clicks' => $row[1],
            'impressions' => $row[2],
            'ctr' => $row[3],
            'position' => $row[4]
        ];
    }
}
fclose($handle);

echo "=== PHASE 7.1 GSC QUERY FORENSIC AUDIT SCRIPT ===\n\n";

foreach ($targets as $t) {
    $tClean = strtolower(trim($t));
    if (isset($csvData[$tClean])) {
        $d = $csvData[$tClean];
        echo "FOUND: '{$t}' => Clicks: {$d['clicks']} | Imp: {$d['impressions']} | CTR: {$d['ctr']} | Pos: {$d['position']}\n";
    } else {
        echo "NOT FOUND: '{$t}'\n";
    }
}
