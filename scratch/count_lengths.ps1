$raw = Get-Content -Raw words.js
$startIndex = $raw.IndexOf('[')
$endIndex = $raw.LastIndexOf(']')
$jsonText = $raw.Substring($startIndex, $endIndex - $startIndex + 1)
$arr = ConvertFrom-Json $jsonText

foreach ($len in @(3, 4, 6, 7, 8)) {
    $c = ($arr | Where-Object { $_.Length -eq $len }).Count
    Write-Host "$len-letter words count in words.js (fullList): $c"
}
