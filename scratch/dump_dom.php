<?php
$doc = new DOMDocument();
@$doc->loadHTMLFile('c:/laragon/www/5-letter-word-finder/index.html');
$xpath = new DOMXPath($doc);

// STEP 4: DOM Structure for tools-section
$node = $xpath->query('//*[@id="tools-placeholder"]')->item(0);
if ($node) {
    echo "=== DOM Structure of #tools-placeholder ===\n";
    echo $doc->saveHTML($node) . "\n";
}
