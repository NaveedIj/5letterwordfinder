<?php
$alphabet = range('a', 'z');
$matrix = [];

foreach ($alphabet as $let) {
    $char = strtoupper($let);
    $fileName = "5-letter-words-ending-with-{$let}.html";
    $content = file_get_contents($fileName);
    
    $doc = new DOMDocument();
    @$doc->loadHTML($content);
    $xpath = new DOMXPath($doc);
    
    // Outbound links inside Related Tools section
    $relatedLinks = [];
    $nodes = $xpath->query('//div[contains(@class, "info-box")]/h3[contains(text(), "Related Word Tools")]/following-sibling::ul//a');
    foreach ($nodes as $node) {
        $relatedLinks[] = trim($node->getAttribute('href'));
    }
    
    // Outbound ending-letter links only
    $endingLinks = array_filter($relatedLinks, function($href) {
        return str_contains($href, 'ending-with');
    });
    
    $matrix[$char] = [
        'file' => $fileName,
        'totalRelatedToolsLinks' => count($relatedLinks),
        'endingLetterRelatedLinks' => count($endingLinks),
        'endingLetterDestinations' => array_values($endingLinks)
    ];
}

// Calculate Incoming links
foreach ($alphabet as $targetLet) {
    $targetChar = strtoupper($targetLet);
    $targetFile = "5-letter-words-ending-with-{$targetLet}.html";
    
    $exactAnchorCountAll = 0; // anywhere in file
    $exactAnchorCountRelated = 0; // inside Related Tools only
    $sourcePagesAll = [];
    $sourcePagesRelated = [];
    
    foreach ($alphabet as $srcLet) {
        if ($srcLet === $targetLet) continue;
        $srcChar = strtoupper($srcLet);
        $srcFile = "5-letter-words-ending-with-{$srcLet}.html";
        $srcContent = file_get_contents($srcFile);
        
        $srcDoc = new DOMDocument();
        @$srcDoc->loadHTML($srcContent);
        $srcXpath = new DOMXPath($srcDoc);
        
        // Query 1: All <a> elements in file pointing to target
        $allAnchors = $srcXpath->query("//a[@href='{$targetFile}' or @href='/{$targetFile}' or @href='./{$targetFile}']");
        if ($allAnchors->length > 0) {
            $exactAnchorCountAll += $allAnchors->length;
            $sourcePagesAll[] = $srcChar;
        }
        
        // Query 2: <a> elements inside Related Tools section pointing to target
        $relAnchors = $srcXpath->query("//div[contains(@class, 'info-box')]/h3[contains(text(), 'Related Word Tools')]/following-sibling::ul//a[@href='{$targetFile}' or @href='/{$targetFile}' or @href='./{$targetFile}']");
        if ($relAnchors->length > 0) {
            $exactAnchorCountRelated += $relAnchors->length;
            $sourcePagesRelated[] = $srcChar;
        }
    }
    
    $matrix[$targetChar]['incomingAnchorsTotal'] = $exactAnchorCountAll;
    $matrix[$targetChar]['incomingSourcePagesTotal'] = count($sourcePagesAll);
    $matrix[$targetChar]['sourcePagesListTotal'] = implode(', ', $sourcePagesAll);
    
    $matrix[$targetChar]['incomingAnchorsRelatedOnly'] = $exactAnchorCountRelated;
    $matrix[$targetChar]['incomingSourcePagesRelatedOnly'] = count($sourcePagesRelated);
    $matrix[$targetChar]['sourcePagesListRelatedOnly'] = implode(', ', $sourcePagesRelated);
}

echo json_encode($matrix, JSON_PRETTY_PRINT);
