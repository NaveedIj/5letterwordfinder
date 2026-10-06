<?php
$srcPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\explore_more_tools_full.png';
$dstPath = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\explore_tools_crop.png';

$src = imagecreatefrompng($srcPath);
list($width, $height) = getimagesize($srcPath);

// Crop bottom 600px where Explore More Tools grid is rendered
$cropY = max(0, $height - 650);
$cropHeight = 650;

$dst = imagecreatetruecolor($width, $cropHeight);
imagecopy($dst, $src, 0, 0, 0, $cropY, $width, $cropHeight);

imagepng($dst, $dstPath);
imagedestroy($src);
imagedestroy($dst);

echo "Crop created successfully at: $dstPath\n";
