<?php
$urls = [
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-a.html' => 'A',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-b.html' => 'B',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-c.html' => 'C',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-d.html' => 'D',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-e.html' => 'E',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-f.html' => 'F',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-g.html' => 'G',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-h.html' => 'H',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-i.html' => 'I',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-j.html' => 'J',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-k.html' => 'K',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-l.html' => 'L',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-m.html' => 'M',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-n.html' => 'N',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-o.html' => 'O',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-p.html' => 'P',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-q.html' => 'Q',
    'https://www.5letterwordfindertool.com/5-letter-words-ending-with-r.html' => 'R'
];

$allPass = true;
foreach ($urls as $url => $letter) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RegressionQA/1.0');
    $html = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        echo "FAIL [$letter]: HTTP $httpCode ($url)\n";
        $allPass = false;
        continue;
    }
    
    $doc = new DOMDocument();
    @$doc->loadHTML($html);
    $xpath = new DOMXPath($doc);
    
    $h1 = $xpath->query('//h1');
    $h1Text = $h1->length > 0 ? trim($h1->item(0)->textContent) : '';
    $pos4 = $xpath->query('//input[@id="pos4"]')->item(0);
    $pos4Val = $pos4 ? $pos4->getAttribute('value') : '';
    $helpful = $xpath->query('//*[contains(text(), "Helpful Guides")]');
    
    if ($h1->length !== 1 || $pos4Val !== $letter || $helpful->length > 0) {
        echo "FAIL [$letter]: H1Count={$h1->length}, pos4='$pos4Val', HelpfulCount={$helpful->length}\n";
        $allPass = false;
    } else {
        echo "PASS [$letter]: HTTP 200, H1 OK, pos4='$letter', Ghost=0\n";
    }
}

if ($allPass) {
    echo "\nFULL LIVE REGRESSION PASS (A-R): All 18 pages intact and HTTP 200 OK.\n";
}
