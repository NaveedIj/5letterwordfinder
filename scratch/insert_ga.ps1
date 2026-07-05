$dir = "c:\laragon\www\5-letter-word-finder"
$htmlFiles = Get-ChildItem -Path $dir -Filter "*.html" -File

$gaCode = @"
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WW6EJYTTML"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WW6EJYTTML');
</script>
</head>
"@

$updatedCount = 0

foreach ($file in $htmlFiles) {
    $content = [IO.File]::ReadAllText($file.FullName)

    # Remove existing GA tracking code if any
    $regex = '(?i)<!-- Google tag \(gtag\.js\) -->[\s\S]*?</script>\s*'
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, $regex, '')

    # Replace </head> with gaCode
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?i)</head>', $gaCode)
    
    # Save file with UTF8 encoding
    [IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    $updatedCount++
    Write-Host "Updated $($file.Name)"
}

Write-Host "Total HTML files updated: $updatedCount"
