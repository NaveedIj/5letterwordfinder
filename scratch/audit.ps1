$files = Get-ChildItem -Path "c:\laragon\www\5-letter-word-finder" -Filter "*.html"
$results = @{}

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw

    # Titles
    $titles = @([regex]::Matches($content, '(?si)<title>(.*?)</title>').Groups[1].Value)

    # Meta descriptions
    $descriptions = @([regex]::Matches($content, '(?si)<meta\s+name="description"\s+content="([^"]*)">').Groups[1].Value)

    # H1s
    $h1s = @([regex]::Matches($content, '(?si)<h1[^>]*>(.*?)</h1>').Groups[1].Value)

    # Canonical
    $canonicals = @([regex]::Matches($content, '(?si)<link\s+rel="canonical"\s+href="([^"]*)">').Groups[1].Value)

    # Robots
    $robots = @([regex]::Matches($content, '(?si)<meta\s+name="robots"\s+content="([^"]*)">').Groups[1].Value)

    # Schemas
    $orgSchema = ([regex]::Matches($content, '(?si)"@type"\s*:\s*"Organization"')).Count
    $faqSchema = ([regex]::Matches($content, '(?si)"@type"\s*:\s*"FAQPage"')).Count
    
    # Internal links
    $hrefs = @()
    foreach ($match in [regex]::Matches($content, '(?si)<a\s+[^>]*href="([^"]+)"')) {
        $hrefs += $match.Groups[1].Value
    }

    # Word count (rough)
    # Extract body content first
    $bodyMatch = [regex]::Match($content, '(?si)<body[^>]*>(.*?)</body>')
    $wordCount = 0
    if ($bodyMatch.Success) {
        $bodyText = $bodyMatch.Groups[1].Value
        # Strip all tags
        $bodyText = $bodyText -replace '<[^>]+>', ' '
        # Replace multiple spaces
        $bodyText = $bodyText -replace '\s+', ' '
        $wordCount = ($bodyText.Trim() -split '\s+').Count
    }

    $results[$file.Name] = @{
        titles = $titles
        descriptions = $descriptions
        h1s = $h1s
        canonicals = $canonicals
        robots = $robots
        orgSchema = $orgSchema
        faqSchema = $faqSchema
        hrefs = $hrefs
        wordCount = $wordCount
    }
}

$results | ConvertTo-Json -Depth 10 | Out-File -FilePath "c:\laragon\www\5-letter-word-finder\scratch\audit_results.json" -Encoding UTF8
