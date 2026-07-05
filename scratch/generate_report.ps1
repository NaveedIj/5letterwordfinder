$results = Get-Content -Path "c:\laragon\www\5-letter-word-finder\scratch\audit_results.json" -Raw | ConvertFrom-Json
$sitemapXml = Get-Content -Path "c:\laragon\www\5-letter-word-finder\sitemap.xml" -Raw

$sitemapUrls = @()
foreach ($match in [regex]::Matches($sitemapXml, '(?si)<loc>([^<]+)</loc>')) {
    $sitemapUrls += $match.Groups[1].Value
}

$issues = @()

$htmlFiles = @()
$results.psobject.properties | ForEach-Object {
    $htmlFiles += $_.Name
}

# Determine which files are linked from homepage
$homepageLinks = @()
if ($results.psobject.properties.Match('index.html').Count -gt 0) {
    $indexData = $results.'index.html'
    foreach ($link in $indexData.hrefs) {
        if ($link -match '^https://') { continue }
        $cleanLink = $link -replace '^/', '' -replace '\#.*$', ''
        if ($cleanLink -eq '') { $cleanLink = 'index.html' }
        if ($homepageLinks -notcontains $cleanLink) {
            $homepageLinks += $cleanLink
        }
    }
}

# Calculate all internal links to find orphans
$allLinks = @()
$results.psobject.properties | ForEach-Object {
    $file = $_.Name
    $data = $_.Value
    foreach ($link in $data.hrefs) {
        if ($link -match '^https://') { continue }
        if ($link -match '^mailto:') { continue }
        $cleanLink = $link -replace '^/', '' -replace '\#.*$', ''
        if ($cleanLink -eq '') { $cleanLink = 'index.html' }
        if ($allLinks -notcontains $cleanLink) {
            $allLinks += $cleanLink
        }
    }
}

foreach ($prop in $results.psobject.properties) {
    $file = $prop.Name
    $data = $prop.Value

    # Title tags
    if ($data.titles.Count -eq 0) {
        $issues += [PSCustomObject]@{ Issue = "Missing title tag"; URL = $file; Severity = "High"; Fix = "Add a <title> tag." }
    } elseif ($data.titles.Count -gt 1) {
        $issues += [PSCustomObject]@{ Issue = "Duplicate title tags"; URL = $file; Severity = "High"; Fix = "Remove extra <title> tags." }
    }

    # Meta descriptions
    if ($data.descriptions.Count -eq 0) {
        $issues += [PSCustomObject]@{ Issue = "Missing meta description"; URL = $file; Severity = "Medium"; Fix = "Add a meta description." }
    } elseif ($data.descriptions.Count -gt 1) {
        $issues += [PSCustomObject]@{ Issue = "Duplicate meta descriptions"; URL = $file; Severity = "Medium"; Fix = "Remove extra meta descriptions." }
    }

    # H1 tags
    if ($data.h1s.Count -eq 0) {
        $issues += [PSCustomObject]@{ Issue = "Missing H1 tag"; URL = $file; Severity = "High"; Fix = "Add exactly one <h1> tag." }
    } elseif ($data.h1s.Count -gt 1) {
        $issues += [PSCustomObject]@{ Issue = "Multiple H1 tags"; URL = $file; Severity = "Medium"; Fix = "Ensure only one <h1> tag exists per page." }
    }

    # Word count
    if ($data.wordCount -lt 300) {
        $issues += [PSCustomObject]@{ Issue = "Low Word Count (< 300)"; URL = $file; Severity = "Low"; Fix = "Add more descriptive content." }
    }

    # Canonicals
    $expectedCanonical = "https://www.5letterwordfindertool.com/" + $file
    if ($file -eq "index.html") {
        $expectedCanonical = "https://www.5letterwordfindertool.com/"
    }
    if ($data.canonicals.Count -eq 0) {
        $issues += [PSCustomObject]@{ Issue = "Missing canonical tag"; URL = $file; Severity = "Medium"; Fix = "Add a self-referencing canonical tag." }
    } else {
        $actualCanonical = $data.canonicals[0]
        if ($actualCanonical -ne $expectedCanonical) {
            $issues += [PSCustomObject]@{ Issue = "Incorrect canonical tag"; URL = $file; Severity = "High"; Fix = "Update canonical to match the absolute URL." }
        }
    }

    # Robots
    if ($data.robots.Count -gt 0) {
        $robotContent = $data.robots[0].ToLower()
        if ($robotContent -match "noindex") {
            $issues += [PSCustomObject]@{ Issue = "Page blocked by robots meta (noindex)"; URL = $file; Severity = "High"; Fix = "Remove noindex if page should be indexed." }
        }
    }

    # Schemas
    if ($data.orgSchema -eq 0) {
        $issues += [PSCustomObject]@{ Issue = "Missing Organization schema"; URL = $file; Severity = "Low"; Fix = "Add Organization JSON-LD." }
    }
    if ($data.faqSchema -gt 1) {
        $issues += [PSCustomObject]@{ Issue = "Duplicate FAQPage schema"; URL = $file; Severity = "High"; Fix = "Remove duplicate static schemas." }
    }

    # Sitemap
    $foundInSitemap = $false
    foreach ($url in $sitemapUrls) {
        if ($url -eq $expectedCanonical) {
            $foundInSitemap = $true
            break
        }
    }
    if (-not $foundInSitemap) {
        $issues += [PSCustomObject]@{ Issue = "Missing from sitemap.xml"; URL = $file; Severity = "High"; Fix = "Add URL to sitemap.xml." }
    }

    # Broken internal links
    foreach ($link in $data.hrefs) {
        if ($link -match '^https://') { continue }
        if ($link -match '^mailto:') { continue }
        $cleanLink = $link -replace '^/', '' -replace '\#.*$', ''
        if ($cleanLink -eq '') { $cleanLink = 'index.html' }
        if ($htmlFiles -notcontains $cleanLink) {
            if ($cleanLink -match '\.html$') {
                $issues += [PSCustomObject]@{ Issue = "Broken internal link"; URL = $file; Severity = "High"; Fix = "Fix link pointing to $cleanLink" }
            }
        }
    }

    # Orphans
    if ($file -ne 'index.html' -and $allLinks -notcontains $file) {
        $issues += [PSCustomObject]@{ Issue = "Orphan page"; URL = $file; Severity = "High"; Fix = "Add internal links pointing to this page." }
    }

    # Not linked from homepage
    if ($file -ne 'index.html' -and $homepageLinks -notcontains $file) {
        $issues += [PSCustomObject]@{ Issue = "Page not linked from homepage"; URL = $file; Severity = "Medium"; Fix = "Add link from homepage if it is an important page." }
    }
}

# Check URLs in sitemap returning non-200 (if file doesn't exist locally)
foreach ($url in $sitemapUrls) {
    $cleanUrl = $url -replace 'https://www.5letterwordfindertool.com/', ''
    if ($cleanUrl -eq '') { $cleanUrl = 'index.html' }
    if ($htmlFiles -notcontains $cleanUrl) {
        $issues += [PSCustomObject]@{ Issue = "Sitemap URL returns 404 (File Missing)"; URL = "sitemap.xml"; Severity = "High"; Fix = "Remove $url from sitemap or create file." }
    }
}

# Generate Report Markdown
$report = "# Technical SEO Audit Report`n`n"
$report += "This report covers the entire website and checks for title tags, descriptions, headings, links, schemas, and more.`n`n"

# Group by severity
$highIssues = $issues | Where-Object { $_.Severity -eq "High" }
$mediumIssues = $issues | Where-Object { $_.Severity -eq "Medium" }
$lowIssues = $issues | Where-Object { $_.Severity -eq "Low" }

function formatTable($issueList, $title) {
    $out = "## $title`n`n"
    if ($issueList.Count -eq 0) {
        $out += "No issues found.`n`n"
        return $out
    }
    $out += "| Issue | Affected URL | Recommended Fix |`n"
    $out += "|---|---|---|`n"
    foreach ($issue in $issueList) {
        $out += "| $($issue.Issue) | $($issue.URL) | $($issue.Fix) |`n"
    }
    $out += "`n"
    return $out
}

$report += formatTable $highIssues "High Severity Issues"
$report += formatTable $mediumIssues "Medium Severity Issues"
$report += formatTable $lowIssues "Low Severity Issues"

$report | Out-File -FilePath "C:\Users\dell\.gemini\antigravity\brain\45729d86-66a2-417b-81f4-7ae6837c404f\technical_seo_audit.md" -Encoding UTF8
