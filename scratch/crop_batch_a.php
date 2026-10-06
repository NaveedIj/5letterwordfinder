<?php
$desktopSrc = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\batch_a_full_3500.png';
$desktopDst = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\batch_a_focus_preview.png';

$srcD = imagecreatefrompng($desktopSrc);
$dstD = imagecreatetruecolor(1280, 500);
imagecopy($dstD, $srcD, 0, 0, 0, 400, 1280, 500);
imagepng($dstD, $desktopDst);
imagedestroy($srcD);
imagedestroy($dstD);

echo "Batch A focus preview saved!\n";
