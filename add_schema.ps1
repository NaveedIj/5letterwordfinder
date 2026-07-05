$files = Get-ChildItem -Path "c:\laragon\www\5-letter-word-finder\*.html"

$webAppSchema = @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "5 Letter Word Finder Tool",
  "url": "https://www.5letterwordfindertool.com/",
  "description": "An interactive word finder and Wordle solver tool to find 5-letter words by including or excluding specific letters.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0"
  }
}
</script>
"@

$updatedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Avoid duplicate schema
    if ($content -match "WebApplication" -and $content -match "BreadcrumbList") {
        continue
    }

    # Extract title
    $title = ""
    if ($content -match "(?is)<title>(.*?)</title>") {
        $title = $matches[1].Trim()
    } else {
        $title = $file.Name
    }
    
    # Clean up title for JSON safely (basic escaping)
    $title = $title -replace '"', '\"' -replace "`n", " " -replace "`r", ""
    
    # URL
    $url = "https://www.5letterwordfindertool.com/"
    if ($file.Name -ne "index.html") {
        $url = $url + $file.Name
    }
    
    # Generate Breadcrumb
    $breadcrumbSchema = ""
    if ($file.Name -eq "index.html") {
        # Only home
        $breadcrumbSchema = @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://www.5letterwordfindertool.com/"
  }]
}
</script>
"@
    } else {
        # Home > Page
        $breadcrumbSchema = @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://www.5letterwordfindertool.com/"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "$title",
    "item": "$url"
  }]
}
</script>
"@
    }
    
    $schemasToInject = "`r`n<!-- WebApp & Breadcrumb Schema -->`r`n"
    if ($content -notmatch "WebApplication") {
        $schemasToInject += $webAppSchema + "`r`n"
    }
    if ($content -notmatch "BreadcrumbList") {
        $schemasToInject += $breadcrumbSchema + "`r`n"
    }
    
    # Insert before </head>
    # Make sure we only replace the LAST occurrence of </head> or just do a regex replace that hits the first one
    # Actually, the files only have ONE </head>. My previous regex replace was fine because I restored A, B, C.
    if ($content -match "</head>") {
        $newContent = $content -replace "(?i)</head>", ($schemasToInject + "</head>")
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        $updatedCount++
    }
}

Write-Output "Total files updated: $updatedCount"
