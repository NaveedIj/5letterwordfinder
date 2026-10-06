<?php
$srcPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\ph2_03_restored_6500.png';
$dstPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\ph2_03_restored_preview.png';

$src = imagecreatefrompng($srcPath);
$dst = imagecreatetruecolor(1280, 500);
imagecopy($dst, $src, 0, 0, 0, 3400, 1280, 500);
imagepng($dst, $dstPath);
imagedestroy($src);
imagedestroy($dst);

echo "PH2-03 restored preview saved!\n";
