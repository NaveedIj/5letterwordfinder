$dir = "c:\laragon\www\5-letter-word-finder"
$files = Get-ChildItem -Path $dir -Filter "*.html" | Select-Object -ExpandProperty Name

$regex = [regex]'(?i)<link\s+rel=["'']canonical["'']\s+href=["'']([^"'']+)["'']'

$report = @()
$baseUrl = "https://www.5letterwordfindertool.com/"

foreach ($file in $files) {
    $content = Get-Content (Join-Path $dir $file) -Raw
    $match = $regex.Match($content)
    
    $currentCanonical = "Not Found"
    if ($match.Success) {
        $currentCanonical = $match.Groups[1].Value.Trim()
    }
    
    $recommendedCanonical = $baseUrl
    if ($file -ne "index.html") {
        $recommendedCanonical = $baseUrl + $file
    }
    
    $issue = "OK"
    if ($currentCanonical -ne $recommendedCanonical) {
        if ($currentCanonical -eq $baseUrl -and $file -ne "index.html") {
            $issue = "Canonical points to homepage incorrectly"
        } elseif ($currentCanonical -eq "Not Found") {
            $issue = "Missing canonical tag"
        } else {
            $issue = "Incorrect canonical"
        }
    }
    
    $report += [PSCustomObject]@{
        URL = $file
        Current = $currentCanonical
        Recommended = $recommendedCanonical
        Issue = $issue
    }
}

$report | ConvertTo-Json
