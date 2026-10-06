$path = 'c:\laragon\www\5-letter-word-finder\5-letter-words-ending-with-e.html'
$text = [System.IO.File]::ReadAllText($path)
$target = "        <!-- Dynamic SEO Section -->`r`n        <section class=""info-section"">`r`n            <div class=""info-content"">`r`n                <!-- Hydrated by seoManager.js -->`r`n            </div>`r`n        </section>`r`n`r`n"
if ($text.Contains($target)) {
    $newText = $text.Replace($target, "")
    $encoding = New-Object System.Text.UTF8Encoding($true)
    [System.IO.File]::WriteAllText($path, $newText, $encoding)
    Write-Host "SUCCESS"
} else {
    # Fallback to LF matching
    $targetLF = "        <!-- Dynamic SEO Section -->`n        <section class=""info-section"">`n            <div class=""info-content"">`n                <!-- Hydrated by seoManager.js -->`n            </div>`n        </section>`n`n"
    $newText = $text.Replace($targetLF, "")
    $encoding = New-Object System.Text.UTF8Encoding($true)
    [System.IO.File]::WriteAllText($path, $newText, $encoding)
    Write-Host "SUCCESS_LF"
}
