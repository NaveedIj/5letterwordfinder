<?php
$doc = new DOMDocument();
@$doc->loadHTMLFile('c:/laragon/www/5-letter-word-finder/index.html');
$xpath = new DOMXPath($doc);
$nodes = $xpath->query('//h2[contains(@class, "info-section-title")]');

foreach ($nodes as $index => $node) {
    echo "=== Heading [$index]: " . trim($node->textContent) . " ===\n";
    $path = [];
    $curr = $node;
    while ($curr && $curr->nodeType === XML_ELEMENT_NODE) {
        $id = $curr->getAttribute('id');
        $class = $curr->getAttribute('class');
        $path[] = $curr->nodeName . ($id ? '#'.$id : '') . ($class ? '.'.str_replace(' ', '.', $class) : '');
        $curr = $curr->parentNode;
    }
    echo implode(' -> ', array_reverse($path)) . "\n\n";
}
