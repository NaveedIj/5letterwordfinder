<?php
$srcPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\explore_tools_6500.png';
$dstPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\explore_tools_focused.png';

$src = imagecreatefrompng($srcPath);
list($width, $height) = getimagesize($srcPath);

// Crop Y: 5300 to 5950 (Explore More Tools grid region)
$cropY = 5300;
$cropHeight = 650;

$dst = imagecreatetruecolor($width, $cropHeight);
imagecopy($dst, $src, 0, 0, 0, $cropY, $width, $cropHeight);

imagepng($dst, $dstPath);
imagedestroy($src);
imagedestroy($dst);

echo "Cropped Y: $cropY to " . ($cropY + $cropHeight) . " saved at: $dstPath\n";
