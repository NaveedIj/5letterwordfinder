<?php
// Fast whole-site scan without DOMXPath overhead
$allFiles = glob(__DIR__ . '/../*.html');
$alphabet = range('a', 'z');
$results = [];

foreach ($alphabet as $let) {
    $char = strtoupper($let);
    $targetFile = "5-letter-words-ending-with-{$let}.html";
    
    $sources = [];
    $totalCount = 0;
    
    foreach ($allFiles as $file) {
        $base = basename($file);
        if ($base === $targetFile) continue;
        
        $content = file_get_contents($file);
        $count = substr_count($content, $targetFile);
        if ($count > 0) {
            $totalCount += $count;
            $sources[] = $base;
        }
    }
    
    $results[$char] = [
        'target' => $targetFile,
        'uniqueSourceCount' => count($sources),
        'totalOccurrences' => $totalCount,
        'sourceFiles' => $sources
    ];
}

echo json_encode($results, JSON_PRETTY_PRINT);
