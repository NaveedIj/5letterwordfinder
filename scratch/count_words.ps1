$raw = Get-Content -Raw words.js
# Extract array content between [ and ]
$startIndex = $raw.IndexOf('[')
$endIndex = $raw.LastIndexOf(']')
$jsonText = $raw.Substring($startIndex, $endIndex - $startIndex + 1)
$arr = ConvertFrom-Json $jsonText
Write-Host ("Total words in wordList: " + $arr.Length)

$fiveLetters = ($arr | Where-Object { $_.Length -eq 5 }).Count
Write-Host ("5-letter words count in wordList: " + $fiveLetters)
