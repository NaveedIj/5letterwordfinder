<?php
$srcPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\explore_tools_6500.png';
$src = imagecreatefrompng($srcPath);
list($width, $height) = getimagesize($srcPath);

for ($y = 0; $y < $height; $y += 200) {
    $crop = imagecreatetruecolor(400, 100);
    imagecopy($crop, $src, 0, 0, 0, $y, 400, 100);
    // Find non-dark pixels
    $hasContent = false;
    for ($x = 0; $x < 400; $x += 10) {
        $rgb = imagecolorat($crop, $x, 50);
        $r = ($rgb >> 16) & 0xFF;
        $g = ($rgb >> 8) & 0xFF;
        $b = $rgb & 0xFF;
        if ($r > 40 || $g > 40 || $b > 40) {
            $hasContent = true;
            break;
        }
    }
    if ($hasContent) {
        echo "Content found near Y: $y\n";
    }
    imagedestroy($crop);
}
imagedestroy($src);
