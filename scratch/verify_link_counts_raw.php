<?php
$alphabet = range('a', 'z');
$matrix = [];

// Method 1: Count exact <a> elements inside the "Related Word Tools" box of each file
foreach ($alphabet as $let) {
    $char = strtoupper($let);
    $fileName = "5-letter-words-ending-with-{$let}.html";
    $content = file_get_contents($fileName);
    
    $doc = new DOMDocument();
    @$doc->loadHTML($content);
    $xpath = new DOMXPath($doc);
    
    // Query links specifically inside Related Word Tools box
    // Searching for h3 containing "Related Word Tools"
    $relatedLinks = [];
    $nodes = $xpath->query('//div[contains(@class, "info-box")]/h3[contains(text(), "Related Word Tools")]/following-sibling::ul//a');
    foreach ($nodes as $node) {
        $relatedLinks[] = trim($node->getAttribute('href'));
    }
    
    $matrix[$char] = [
        'file' => $fileName,
        'relatedToolsOutboundCount' => count($relatedLinks),
        'relatedToolsLinks' => $relatedLinks,
        'incomingLinksFromSiblings' => 0,
        'incomingSourcePages' => []
    ];
}

// Method 2: Calculate EXACT incoming links pointing to each target page from OTHER 25 ending-letter pages
foreach ($alphabet as $targetLet) {
    $targetChar = strtoupper($targetLet);
    $targetFile = "5-letter-words-ending-with-{$targetLet}.html";
    
    $exactAnchorCount = 0;
    $sourcePages = [];
    
    foreach ($alphabet as $srcLet) {
        if ($srcLet === $targetLet) continue; // skip self
        $srcChar = strtoupper($srcLet);
        $srcFile = "5-letter-words-ending-with-{$srcLet}.html";
        $srcContent = file_get_contents($srcFile);
        
        $srcDoc = new DOMDocument();
        @$srcDoc->loadHTML($srcContent);
        $srcXpath = new DOMXPath($srcDoc);
        
        // Find all <a> tags whose href equals targetFile or /targetFile or contains targetFile
        $anchors = $srcXpath->query("//a[@href='{$targetFile}' or @href='/{$targetFile}' or @href='./{$targetFile}']");
        if ($anchors->length > 0) {
            $exactAnchorCount += $anchors->length;
            $sourcePages[] = $srcChar;
        }
    }
    
    $matrix[$targetChar]['incomingLinksFromSiblings'] = $exactAnchorCount;
    $matrix[$targetChar]['incomingSourcePages'] = $sourcePages;
}

echo json_encode($matrix, JSON_PRETTY_PRINT);
