<?php
$desktopSrc = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\elevated_header_6500.png';
$desktopDst = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\elevated_section_header_preview.png';

$srcD = imagecreatefrompng($desktopSrc);
$dstD = imagecreatetruecolor(1280, 550);
imagecopy($dstD, $srcD, 0, 0, 0, 3350, 1280, 550);
imagepng($dstD, $desktopDst);
imagedestroy($srcD);
imagedestroy($dstD);

echo "Elevated section header preview saved!\n";
