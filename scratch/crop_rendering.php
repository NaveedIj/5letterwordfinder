<?php
$mobileSrc = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\hero_rendering_mobile_4500.png';
$mobileDst = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e\\heading_rendering_mobile.png';

$srcM = imagecreatefrompng($mobileSrc);
list($w, $h) = getimagesize($mobileSrc);

// Find Y position of Explore More Word Tools title in mobile image
for ($y = 2000; $y < 4000; $y += 50) {
    $crop = imagecreatetruecolor(300, 40);
    imagecopy($crop, $srcM, 0, 0, 40, $y, 300, 40);
    $hasContent = false;
    for ($x = 0; $x < 300; $x += 10) {
        $rgb = imagecolorat($crop, $x, 20);
        $r = ($rgb >> 16) & 0xFF;
        if ($r > 200) { $hasContent = true; break; }
    }
    imagedestroy($crop);
    if ($hasContent) {
        $dstM = imagecreatetruecolor(395, 250);
        imagecopy($dstM, $srcM, 0, 0, 0, $y - 30, 395, 250);
        imagepng($dstM, $mobileDst);
        imagedestroy($dstM);
        echo "Mobile Y: $y crop saved!\n";
        break;
    }
}
imagedestroy($srcM);
