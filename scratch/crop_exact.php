<?php
$desktopSrc = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\hero_exact_desktop_6500.png';
$mobileSrc = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\hero_exact_mobile_4500.png';

$desktopDst = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\hero_exact_desktop_preview.png';
$mobileDst = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\hero_exact_mobile_preview.png';

// Desktop Y: 3400-3650
$srcD = imagecreatefrompng($desktopSrc);
$dstD = imagecreatetruecolor(1280, 250);
imagecopy($dstD, $srcD, 0, 0, 0, 3400, 1280, 250);
imagepng($dstD, $desktopDst);
imagedestroy($srcD);
imagedestroy($dstD);

// Mobile Y: 2620-2870
$srcM = imagecreatefrompng($mobileSrc);
$dstM = imagecreatetruecolor(395, 250);
imagecopy($dstM, $srcM, 0, 0, 0, 2620, 395, 250);
imagepng($dstM, $mobileDst);
imagedestroy($srcM);
imagedestroy($dstM);

echo "Exact Hero gradient previews saved!\n";
