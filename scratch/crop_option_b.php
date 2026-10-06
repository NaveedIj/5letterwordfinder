<?php
$srcPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\option_b_6500.png';
$dstPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\option_b_preview.png';

$src = imagecreatefrompng($srcPath);
list($width, $height) = getimagesize($srcPath);

$cropY = 3450;
$cropHeight = 350;

$dst = imagecreatetruecolor($width, $cropHeight);
imagecopy($dst, $src, 0, 0, 0, $cropY, $width, $cropHeight);

imagepng($dst, $dstPath);
imagedestroy($src);
imagedestroy($dst);

echo "Option B preview saved at: $dstPath\n";
