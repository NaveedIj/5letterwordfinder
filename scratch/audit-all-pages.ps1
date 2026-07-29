$htmlFiles = Get-ChildItem -Path . -Filter *.html

Write-Host "=========================================================================="
Write-Host "PROGRAMMATIC SEO FORENSIC AUDIT - ALL HTML PAGES"
Write-Host "=========================================================================="

$totalFiles = $htmlFiles.Count
$errorsFound = 0

foreach ($file in $htmlFiles) {
    $name = $file.Name
    $content = Get-Content -Path $file.FullName -Raw
    
    # 1. Title check
    $title = ""
    if ($content -match '<title>(.*?)</title>') {
        $title = $matches[1]
    } else {
        Write-Host "❌ [$name] Missing <title>" -ForegroundColor Red
        $errorsFound++
    }

    # 2. Canonical check
    $canonical = ""
    if ($content -match '<link\s+rel="canonical"\s+href="([^"]+)"') {
        $canonical = $matches[1]
    } else {
        Write-Host "❌ [$name] Missing Canonical URL" -ForegroundColor Red
        $errorsFound++
    }

    # 3. Meta Description check
    $desc = ""
    if ($content -match '<meta\s+name="description"\s+content="([^"]+)"') {
        $desc = $matches[1]
    } else {
        Write-Host "❌ [$name] Missing Meta Description" -ForegroundColor Red
        $errorsFound++
    }

    # 4. JSON-LD Schema check
    $schemas = [regex]::Matches($content, '<script\s+type="application/ld\+json">(.*?)</script>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $schemaTypes = @()
    foreach ($s in $schemas) {
        $json = $s.Groups[1].Value
        if ($json -match '"@type"\s*:\s*"([^"]+)"') {
            $schemaTypes += $matches[1]
        }
    }

    # 5. Check Homepage leakage (e.g. child pages claiming to be homepage title/canonical)
    if ($name -ne "index.html") {
        if ($canonical -eq "https://5letterwordfinder.net/" -or $canonical -eq "https://5letterwordfinder.net") {
            Write-Host "⚠️ [$name] Canonical points to Homepage ($canonical)" -ForegroundColor Yellow
            $errorsFound++
        }
    }

    Write-Host "[$name]"
    Write-Host "   Title: $title"
    Write-Host "   Canonical: $canonical"
    Write-Host "   Schemas Found ($($schemas.Count)): $($schemaTypes -join ', ')"
    Write-Host "--------------------------------------------------------------------------"
}

Write-Host "Audit completed for $totalFiles HTML pages. Issues detected: $errorsFound"
