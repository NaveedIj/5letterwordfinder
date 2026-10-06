<?php
$desktopFile = 'lighthouse_desktop.json';
$mobileFile = 'lighthouse_mobile.json';

if (file_exists($desktopFile)) {
    $j = json_decode(file_get_contents($desktopFile), true);
    echo "--- LIGHTHOUSE DESKTOP BASELINE ---\n";
    echo "Performance Score: " . round($j['categories']['performance']['score'] * 100) . "/100\n";
    echo "First Contentful Paint (FCP): " . $j['audits']['first-contentful-paint']['displayValue'] . "\n";
    echo "Largest Contentful Paint (LCP): " . $j['audits']['largest-contentful-paint']['displayValue'] . "\n";
    echo "Total Blocking Time (TBT): " . $j['audits']['total-blocking-time']['displayValue'] . "\n";
    echo "Cumulative Layout Shift (CLS): " . $j['audits']['cumulative-layout-shift']['displayValue'] . "\n";
    echo "Speed Index: " . $j['audits']['speed-index']['displayValue'] . "\n\n";
} else {
    echo "lighthouse_desktop.json not found yet.\n";
}

if (file_exists($mobileFile)) {
    $jm = json_decode(file_get_contents($mobileFile), true);
    echo "--- LIGHTHOUSE MOBILE BASELINE ---\n";
    echo "Performance Score: " . round($jm['categories']['performance']['score'] * 100) . "/100\n";
    echo "First Contentful Paint (FCP): " . $jm['audits']['first-contentful-paint']['displayValue'] . "\n";
    echo "Largest Contentful Paint (LCP): " . $jm['audits']['largest-contentful-paint']['displayValue'] . "\n";
    echo "Total Blocking Time (TBT): " . $jm['audits']['total-blocking-time']['displayValue'] . "\n";
    echo "Cumulative Layout Shift (CLS): " . $jm['audits']['cumulative-layout-shift']['displayValue'] . "\n";
    echo "Speed Index: " . $jm['audits']['speed-index']['displayValue'] . "\n";
} else {
    echo "lighthouse_mobile.json not found yet.\n";
}
