<?php
$desktopSrc = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\batch_b_desktop_6500.png';
$mobileSrc = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\batch_b_mobile_4500.png';

$desktopDst = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\batch_b_desktop_preview.png';
$mobileDst = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\batch_b_mobile_preview.png';

// Desktop Y: 2700-3150 (Strategy Info Boxes)
$srcD = imagecreatefrompng($desktopSrc);
$dstD = imagecreatetruecolor(1280, 450);
imagecopy($dstD, $srcD, 0, 0, 0, 2700, 1280, 450);
imagepng($dstD, $desktopDst);
imagedestroy($srcD);
imagedestroy($dstD);

// Mobile Y: 0-350 (Header & Drawer)
$srcM = imagecreatefrompng($mobileSrc);
$dstM = imagecreatetruecolor(395, 350);
imagecopy($dstM, $srcM, 0, 0, 0, 0, 395, 350);
imagepng($dstM, $mobileDst);
imagedestroy($srcM);
imagedestroy($dstM);

echo "Batch B previews saved!\n";
