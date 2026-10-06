<?php
$desktopSrc = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\ph3_02_desktop_6500.png';
$mobileSrc = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\ph3_02_mobile_4500.png';

$toolsDst = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\ph3_02_tools_preview.png';
$footerDst = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\ph3_02_footer_preview.png';

// Desktop Y: 3400-3850 (Tools grid with chevrons)
$srcD = imagecreatefrompng($desktopSrc);
$dstD = imagecreatetruecolor(1280, 450);
imagecopy($dstD, $srcD, 0, 0, 0, 3400, 1280, 450);
imagepng($dstD, $toolsDst);
imagedestroy($dstD);

// Desktop Y: 4300-4750 (Footer CTA)
$dstF = imagecreatetruecolor(1280, 450);
imagecopy($dstF, $srcD, 0, 0, 0, 4300, 1280, 450);
imagepng($dstF, $footerDst);
imagedestroy($dstF);

imagedestroy($srcD);

echo "PH3-02 previews saved successfully!\n";
