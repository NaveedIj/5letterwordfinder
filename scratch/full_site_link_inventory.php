<?php
function getContextType($node) {
    $parent = $node->parentNode;
    while ($parent && $parent->nodeType === XML_ELEMENT_NODE) {
        $tag = strtolower($parent->nodeName ?? '');
        $class = strtolower($parent->getAttribute('class') ?? '');
        $id = strtolower($parent->getAttribute('id') ?? '');
        
        if ($tag === 'nav' || str_contains($class, 'navbar') || str_contains($class, 'nav')) return 'Header Nav';
        if ($tag === 'footer' || str_contains($class, 'footer')) return 'Footer';
        if ($tag === 'aside' || str_contains($class, 'sidebar')) return 'Sidebar';
        if (str_contains($class, 'tools-grid') || str_contains($class, 'tools-section')) return 'Explore Tools Grid';
        if (str_contains($class, 'letter-grid') || str_contains($class, 'letter-links')) return 'A-Z Index Grid';
        if (str_contains($class, 'info-box') || str_contains($class, 'info-section') || str_contains($class, 'details-content')) return 'Body / Strategy Content';
        
        $parent = $parent->parentNode;
    }
    return 'Main Body';
}

function normalizeUrl($href) {
    $href = trim($href);
    if (empty($href) || str_starts_with($href, '#') || str_starts_with($href, 'javascript:') || str_starts_with($href, 'mailto:') || str_starts_with($href, 'http://') || str_starts_with($href, 'https://')) {
        return null;
    }
    
    $href = explode('?', $href)[0];
    $href = explode('#', $href)[0];
    
    if ($href === '/' || $href === '' || $href === './') return 'index.html';
    
    $clean = ltrim($href, './');
    $clean = ltrim($clean, '/');
    
    if (empty($clean)) return 'index.html';
    if (!str_ends_with($clean, '.html') && !str_contains($clean, '.')) {
        $clean .= '.html';
    }
    
    return $clean;
}

$htmlFiles = glob('*.html');
sort($htmlFiles);

$inventory = [];
$incomingCounts = [];
$outgoingCounts = [];
$contextBreakdown = [];

foreach ($htmlFiles as $file) {
    $content = file_get_contents($file);
    $doc = new DOMDocument();
    @$doc->loadHTML($content);
    $xpath = new DOMXPath($doc);

    $nodes = $xpath->query('//a[@href]');
    $outLinks = [];

    foreach ($nodes as $node) {
        $rawHref = $node->getAttribute('href');
        $target = normalizeUrl($rawHref);
        if (!$target) continue;

        $anchor = trim(preg_replace('/\s+/', ' ', $node->textContent));
        $context = getContextType($node);

        $outLinks[] = [
            'target' => $target,
            'anchor' => $anchor,
            'context' => $context
        ];

        $incomingCounts[$target] = ($incomingCounts[$target] ?? 0) + 1;
        $contextBreakdown[$target][$context] = ($contextBreakdown[$target][$context] ?? 0) + 1;
    }

    $outgoingCounts[$file] = count($outLinks);
    $inventory[$file] = $outLinks;
}

function getClusterName($file) {
    if ($file === 'index.html') return 'Homepage';
    if (in_array($file, ['3-letter-word-finder.html', '4-letter-word-finder.html', '6-letter-word-finder.html', '7-letter-word-finder.html', '8-letter-word-finder.html'])) return 'Length Finder Pages';
    if (in_array($file, ['game.html', 'ai-word-solver.html'])) return 'Utility Tools';
    if (in_array($file, ['about.html', 'contact.html', 'privacy.html'])) return 'Static Info Pages';
    if (str_contains($file, 'starting-with')) return 'Starting-With Cluster (26)';
    if (str_contains($file, 'ending-with')) return 'Ending-With Cluster (26)';
    return 'Other';
}

$clusterSummary = [];
foreach ($htmlFiles as $file) {
    $cluster = getClusterName($file);
    if (!isset($clusterSummary[$cluster])) {
        $clusterSummary[$cluster] = [
            'count' => 0,
            'totalIncoming' => 0,
            'totalOutgoing' => 0,
            'pages' => []
        ];
    }

    $inCount = $incomingCounts[$file] ?? 0;
    $outCount = $outgoingCounts[$file] ?? 0;

    $clusterSummary[$cluster]['count']++;
    $clusterSummary[$cluster]['totalIncoming'] += $inCount;
    $clusterSummary[$cluster]['totalOutgoing'] += $outCount;
    $clusterSummary[$cluster]['pages'][$file] = [
        'incoming' => $inCount,
        'outgoing' => $outCount,
        'contexts' => $contextBreakdown[$file] ?? []
    ];
}

echo "=== PHASE 5.1 SITE-WIDE INTERNAL LINK INVENTORY REPORT ===\n\n";

echo "1. PAGE CLUSTER OVERVIEW (63 TOTAL PAGES):\n";
printf("%-30s | %-5s | %-14s | %-14s | %-12s\n", "Page Cluster", "Pages", "Avg Incoming", "Avg Outgoing", "Orphans");
echo str_repeat("-", 85) . "\n";

foreach ($clusterSummary as $cName => $cData) {
    $pCount = $cData['count'];
    $avgIn = round($cData['totalIncoming'] / max(1, $pCount), 1);
    $avgOut = round($cData['totalOutgoing'] / max(1, $pCount), 1);
    
    $orphanCount = 0;
    foreach ($cData['pages'] as $pName => $pStats) {
        if ($pStats['incoming'] === 0) $orphanCount++;
    }

    printf("%-30s | %-5d | %-14.1f | %-14.1f | %-12d\n", $cName, $pCount, $avgIn, $avgOut, $orphanCount);
}

echo "\n\n2. HOMEPAGE OUTGOING LINKS INVENTORY (index.html):\n";
printf("%-38s | %-32s | %-25s\n", "Target Page", "Anchor Text", "Context / Location");
echo str_repeat("-", 100) . "\n";
foreach ($inventory['index.html'] ?? [] as $link) {
    printf("%-38s | %-32s | %-25s\n", $link['target'], substr($link['anchor'], 0, 32), $link['context']);
}

echo "\n\n3. DETAILED PAGE-LEVEL INCOMING & OUTGOING BREAKDOWN:\n";
foreach ($clusterSummary as $cName => $cData) {
    echo "\n--- CLUSTER: $cName ---\n";
    foreach ($cData['pages'] as $pName => $pStats) {
        $ctxStr = [];
        foreach ($pStats['contexts'] as $ctx => $cnt) {
            $ctxStr[] = "$ctx: $cnt";
        }
        $ctxDisplay = empty($ctxStr) ? 'None' : implode(', ', $ctxStr);
        echo sprintf("  %-42s | Incoming: %-3d | Outgoing: %-3d | Context Breakdown: [%s]\n", $pName, $pStats['incoming'], $pStats['outgoing'], $ctxDisplay);
    }
}
