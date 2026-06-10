$dir = "c:\laragon\www\5-letter-word-finder"
$files = Get-ChildItem -Path $dir -Filter "*.html" | Select-Object -ExpandProperty Name

$sitemapPath = Join-Path $dir "sitemap.xml"
$sitemapUrls = @()
if (Test-Path $sitemapPath) {
    [xml]$sitemap = Get-Content $sitemapPath
    if ($sitemap.urlset -and $sitemap.urlset.url) {
        foreach ($u in $sitemap.urlset.url) {
            $sitemapUrls += $u.loc
        }
    }
}

$sitemapFiles = @()
foreach ($url in $sitemapUrls) {
    $p = $url -replace "^https://www.5letterwordfindertool.com/", ""
    if ($p -eq "") { $p = "index.html" }
    $sitemapFiles += $p
}

$inboundLinks = @{}
foreach ($f in $files) {
    $inboundLinks[$f] = [System.Collections.Generic.HashSet[string]]::new()
}
if (-not $inboundLinks.ContainsKey('index.html')) {
    $inboundLinks['index.html'] = [System.Collections.Generic.HashSet[string]]::new()
}

$regex = [regex]'(?i)href=["'']([^"''#\?]+)[#\?]*[^"'']*["'']'

foreach ($file in $files) {
    $content = Get-Content (Join-Path $dir $file) -Raw
    $matches = $regex.Matches($content)
    foreach ($m in $matches) {
        $link = $m.Groups[1].Value.Trim()
        
        if ($link -match "^http" -or $link -match "^mailto:" -or $link -eq "") {
            if ($link -match "^https://www.5letterwordfindertool.com/") {
                $link = $link -replace "^https://www.5letterwordfindertool.com/", ""
            } else {
                continue
            }
        }
        
        if ($link -eq "/" -or $link -eq "") {
            $link = "index.html"
        }
        
        if ($link.StartsWith("/")) {
            $link = $link.Substring(1)
        }
        
        if ($link -eq "") { $link = "index.html" }
        
        if ($link.EndsWith(".html") -or $link -eq "index.html") {
            if (-not $inboundLinks.ContainsKey($link)) {
                $inboundLinks[$link] = [System.Collections.Generic.HashSet[string]]::new()
            }
            [void]$inboundLinks[$link].Add($file)
        }
    }
}

foreach ($f in $sitemapFiles) {
    if (-not $inboundLinks.ContainsKey($f)) {
        $inboundLinks[$f] = [System.Collections.Generic.HashSet[string]]::new()
    }
}

$report = @()
foreach ($target in $inboundLinks.Keys) {
    $linksCount = $inboundLinks[$target].Count
    $issue = ""
    $fix = ""
    
    $inSitemap = $sitemapFiles -contains $target
    $isHtmlFile = ($files -contains $target) -or ($target -eq "index.html")
    
    if (-not $isHtmlFile -and $inSitemap) {
        $issue = "In sitemap but file does not exist"
        $fix = "Remove from sitemap or create page"
    } elseif ($linksCount -eq 0 -and $inSitemap) {
        $issue = "Orphan page (in sitemap)"
        $fix = "Add internal links from related pages"
    } elseif ($linksCount -eq 0 -and -not $inSitemap) {
        $issue = "Orphan page (not in sitemap)"
        $fix = "Add to sitemap & link internally, or delete"
    } elseif ($linksCount -lt 3) {
        $issue = "Low internal links (<3)"
        $fix = "Add links from index or letter-nav block"
    } else {
        $issue = "OK"
        $fix = "None"
    }
    
    $report += [PSCustomObject]@{
        URL = $target
        Links = $linksCount
        Issue = $issue
        Fix = $fix
    }
}

$report | ConvertTo-Json
