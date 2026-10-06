<?php
// Find ALL html files in root
$allHtmlFiles = glob(__DIR__ . '/../*.html');
$alphabet = range('a', 'z');
$siteMatrix = [];

foreach ($alphabet as $targetLet) {
    $targetChar = strtoupper($targetLet);
    $targetFile = "5-letter-words-ending-with-{$targetLet}.html";
    
    $siblingSources = [];
    $otherSources = [];
    $totalAnchors = 0;
    
    $linkTypes = [
        'related_tools' => 0,
        'footer' => 0,
        'navigation' => 0,
        'homepage_hero' => 0,
        'editorial' => 0
    ];
    
    foreach ($allHtmlFiles as $file) {
        $baseName = basename($file);
        if ($baseName === $targetFile) continue; // skip self
        
        $content = file_get_contents($file);
        $doc = new DOMDocument();
        @$doc->loadHTML($content);
        $xpath = new DOMXPath($doc);
        
        $query = "//a[@href='{$targetFile}' or @href='/{$targetFile}' or @href='./{$targetFile}']";
        $anchors = $xpath->query($query);
        
        if ($anchors->length > 0) {
            $totalAnchors += $anchors->length;
            
            $isSibling = str_starts_with($baseName, '5-letter-words-ending-with-');
            if ($isSibling) {
                $srcLet = strtoupper(substr($baseName, -6, 1));
                $siblingSources[] = $srcLet;
            } else {
                $otherSources[] = $baseName;
            }
            
            foreach ($anchors as $node) {
                // Categorize parent location
                $parentClass = '';
                $p = $node->parentNode;
                while ($p && $p instanceof DOMElement) {
                    $class = $p->getAttribute('class');
                    if (str_contains($class, 'site-footer') || str_contains($class, 'footer')) {
                        $linkTypes['footer']++;
                        break;
                    }
                    if (str_contains($class, 'nav-panel') || str_contains($class, 'nav-menu') || str_contains($class, 'saas-header')) {
                        $linkTypes['navigation']++;
                        break;
                    }
                    if (str_contains($class, 'info-box') || str_contains($class, 'seo-guide-section')) {
                        // check if related tools vs editorial
                        $prevH3 = $xpath->query('preceding-sibling::h3', $p);
                        if (str_contains($p->textContent, 'Related Word Tools') || ($prevH3->length > 0 && str_contains($prevH3->item(0)->textContent, 'Related Word Tools'))) {
                            $linkTypes['related_tools']++;
                        } else {
                            $linkTypes['editorial']++;
                        }
                        break;
                    }
                    $p = $p->parentNode;
                }
            }
        }
    }
    
    $uniqueSources = array_merge($siblingSources, $otherSources);
    
    $siteMatrix[$targetChar] = [
        'file' => $targetFile,
        'siblingSources' => $siblingSources,
        'siblingSourceCount' => count($siblingSources),
        'otherSources' => $otherSources,
        'otherSourceCount' => count($otherSources),
        'totalUniqueSources' => count($uniqueSources),
        'totalAnchors' => $totalAnchors,
        'linkTypes' => $linkTypes,
        'orphanStatus' => (count($uniqueSources) === 0) ? 'TRUE SITE-WIDE ORPHAN' : ((count($siblingSources) === 0) ? 'NOT ORPHAN — SIBLING-CLUSTER WEAK' : 'WELL CONNECTED')
    ];
}

echo json_encode($siteMatrix, JSON_PRETTY_PRINT);
