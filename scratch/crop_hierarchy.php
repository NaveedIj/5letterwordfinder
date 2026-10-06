<?php
$srcPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\heading_hierarchy_6500.png';
$dstPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\heading_hierarchy_verified.png';

$src = imagecreatefrompng($srcPath);
list($width, $height) = getimagesize($srcPath);

$cropY = 3450;
$cropHeight = 350;

$dst = imagecreatetruecolor($width, $cropHeight);
imagecopy($dst, $src, 0, 0, 0, $cropY, $width, $cropHeight);

imagepng($dst, $dstPath);
imagedestroy($src);
imagedestroy($dst);

echo "Heading hierarchy crop saved at: $dstPath\n";
