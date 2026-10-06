<?php
$doc = new DOMDocument();
@$doc->loadHTMLFile('c:/laragon/www/5-letter-word-finder/index.html');
$xpath = new DOMXPath($doc);
$nodes = $xpath->query('//*[@id="tools-placeholder"]');
echo "Count of #tools-placeholder: " . $nodes->length . "\n";
foreach ($nodes as $i => $node) {
    echo "--- Instance $i ---\n";
    echo $doc->saveHTML($node) . "\n";
}
