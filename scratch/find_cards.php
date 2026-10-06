<?php
$srcPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\explore_tools_6500.png';
$src = imagecreatefrompng($srcPath);

for ($y = 2000; $y <= 4200; $y += 50) {
    // Check X: 60 (where card icons or titles sit)
    $rgb = imagecolorat($src, 60, $y);
    $r = ($rgb >> 16) & 0xFF;
    $g = ($rgb >> 8) & 0xFF;
    $b = $rgb & 0xFF;
    if ($r > 50 || $g > 50 || $b > 50) {
        echo "Card content at X:60 Y:$y => R:$r G:$g B:$b\n";
    }
}
imagedestroy($src);
