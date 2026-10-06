<?php
$desktopSrc = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\solid_light_desktop_6500.png';
$desktopDst = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\solid_heading_preview.png';

$srcD = imagecreatefrompng($desktopSrc);
$dstD = imagecreatetruecolor(1280, 250);
imagecopy($dstD, $srcD, 0, 0, 0, 3400, 1280, 250);
imagepng($dstD, $desktopDst);
imagedestroy($srcD);
imagedestroy($dstD);

echo "Solid heading preview saved!\n";
