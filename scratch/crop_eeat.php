<?php
$desktopSrc = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\ph3_03_desktop_6500.png';

if (file_exists($desktopSrc)) {
    $srcD = imagecreatefrompng($desktopSrc);
    
    // 1. Privacy Badge (Hero Extras Y: 450-700)
    $dst1 = imagecreatetruecolor(1280, 250);
    imagecopy($dst1, $srcD, 0, 0, 0, 450, 1280, 250);
    imagepng($dst1, 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\ph3_03_privacy_preview.png');
    imagedestroy($dst1);
    
    // 2. Editorial & How It Works (Y: 2600-3100)
    $dst2 = imagecreatetruecolor(1280, 500);
    imagecopy($dst2, $srcD, 0, 0, 0, 2600, 1280, 500);
    imagepng($dst2, 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\ph3_03_how_it_works_preview.png');
    imagedestroy($dst2);
    
    imagedestroy($srcD);
    echo "PH3-03 crops generated successfully.\n";
} else {
    echo "Source desktop screenshot not ready yet.\n";
}
