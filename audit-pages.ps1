$pages = @(
    "5-letter-words-ending-with-e.html",
    "5-letter-words-ending-with-s.html",
    "5-letter-words-ending-with-t.html",
    "5-letter-words-ending-with-y.html",
    "3-letter-word-finder.html",
    "4-letter-word-finder.html",
    "6-letter-word-finder.html",
    "7-letter-word-finder.html",
    "8-letter-word-finder.html"
)

Write-Host "Starting QA Audit..."
Write-Host "--------------------------------------------------"

$totalErrors = 0

foreach ($page in $pages) {
    $filePath = Join-Path -Path $PWD -ChildPath $page
    if (-Not (Test-Path $filePath)) {
        Write-Host "ERROR: $page not found!"
        $totalErrors++
        continue
    }

    $content = Get-Content -Path $filePath -Raw
    
    # 1. Title
    if ($content -notmatch '<title>(.*?)</title>') { Write-Host "$page : Missing Title"; $totalErrors++ }
    
    # 2. Meta Description
    if ($content -notmatch '<meta\s+name="description"\s+content="[^"]+"') { Write-Host "$page : Missing Meta Description"; $totalErrors++ }

    # 3. Canonical
    $canonicalMatches = [regex]::Matches($content, '<link rel="canonical"')
    if ($canonicalMatches.Count -eq 0) { Write-Host "$page : Missing Canonical"; $totalErrors++ }
    elseif ($canonicalMatches.Count -gt 1) { Write-Host "$page : Duplicate Canonical"; $totalErrors++ }

    # 4. Schema (checking for Organization or WebApp or FAQPage)
    $schemaMatches = [regex]::Matches($content, '<script type="application/ld\+json">')
    if ($schemaMatches.Count -eq 0) { Write-Host "$page : Missing Schema"; $totalErrors++ }

    # 5. Internal Links count
    $linkMatches = [regex]::Matches($content, 'href="([^"]+)"') # Match all hrefs
    $internalLinksCount = 0
    foreach ($match in $linkMatches) {
        $val = $match.Groups[1].Value
        if (-not $val.StartsWith("http") -and -not $val.StartsWith("javascript") -and -not $val.StartsWith("#") -and -not $val.EndsWith(".css") -and -not $val.EndsWith(".ico")) {
            $internalLinksCount++
        }
    }
    
    # Word count estimation (strip HTML, count words)
    $textOnly = $content -replace '<[^>]+>', ' ' -replace '\s+', ' '
    $wordCount = ($textOnly.Trim().Split(' ')).Length

    Write-Host "[$page] - Words: $wordCount | Internal Links: $internalLinksCount | Status: OK"
}

Write-Host "--------------------------------------------------"
Write-Host "Audit Complete. Total Errors: $totalErrors"
