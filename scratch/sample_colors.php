<?php
$srcPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\explore_tools_6500.png';
$src = imagecreatefrompng($srcPath);

// Sample Y positions to detect text in center (X: 100-300)
for ($y = 2000; $y <= 6400; $y += 100) {
    $rgb = imagecolorat($src, 150, $y);
    $r = ($rgb >> 16) & 0xFF;
    $g = ($rgb >> 8) & 0xFF;
    $b = $rgb & 0xFF;
    // Check if background is not default dark bg (#0f172a / #0b1329 => RGB ~15, 23, 42)
    echo "Y: $y => R:$r G:$g B:$b\n";
}
imagedestroy($src);
