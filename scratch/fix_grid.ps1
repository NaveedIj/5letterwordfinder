$ErrorActionPreference = "Stop"

$files = @("..\index.html", "..\4-letter-word-finder.html", "..\7-letter-word-finder.html", "..\8-letter-word-finder.html")

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content -Path $file -Raw
        
        # Replace the incorrectly duplicated style tag in index.html (if it exists)
        $content = $content -replace '<div style="max-width: 800px; margin: 0 auto; padding: 2rem; background: var\(--bg-card\); border-radius: 1rem; border: 1px solid var\(--border-color\);">\s*style="max-width: 800px; margin: 0 auto; padding: 2rem; background: var\(--bg-card\); border-radius: 1rem; border: 1px solid var\(--border-color\);">', '<div style="max-width: 800px; margin: 0 auto; padding: 2rem; background: var(--bg-card); border-radius: 1rem; border: 1px solid var(--border-color);">'

        # Replace the info-content div
        $content = $content -replace '<div class="info-content"\s*style="max-width: 800px; margin: 0 auto; padding: 2rem; background: var\(--bg-card\); border-radius: 1rem; border: 1px solid var\(--border-color\);">', '<div style="max-width: 800px; margin: 0 auto; padding: 2rem; background: var(--bg-card); border-radius: 1rem; border: 1px solid var(--border-color);">'
        
        Set-Content -Path $file -Value $content -Encoding UTF8
    }
}
