$pattern = '(?s)\s*<button class="btn-menu" id="menuBtn" aria-label="Open menu">.*?</button>'
Get-ChildItem -Filter *.html | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match $pattern) {
        $content = $content -replace $pattern, ''
        Set-Content $_.FullName $content
        Write-Host "Modified $($_.Name)"
    }
}
