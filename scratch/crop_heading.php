<?php
$srcPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\heading_contrast_6500.png';
$dstPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\heading_contrast_verified.png';

$src = imagecreatefrompng($srcPath);
list($width, $height) = getimagesize($srcPath);

// Crop Y: 3450 to 3700 (Explore More Word Tools heading area)
$cropY = 3450;
$cropHeight = 250;

$dst = imagecreatetruecolor($width, $cropHeight);
imagecopy($dst, $src, 0, 0, 0, $cropY, $width, $cropHeight);

imagepng($dst, $dstPath);
imagedestroy($src);
imagedestroy($dst);

echo "Heading contrast crop saved at: $dstPath\n";
