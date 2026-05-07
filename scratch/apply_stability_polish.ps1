$themeScript = @"
    <!-- Phase 1.5: Theme Persistence & White Flash Prevention -->
    <script>
        (function() {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
            document.documentElement.classList.add(isDark ? 'theme-dark' : 'theme-light');
            document.documentElement.style.backgroundColor = isDark ? '#0f172a' : '#f8fafc';
        })();
    </script>
"@

$skeletonHtml = @"
                    <div class="results-list" id="resultsList">
                        <!-- Phase 1.5: Static Skeleton -->
                        <div class="word-item skeleton"></div>
                        <div class="word-item skeleton"></div>
                        <div class="word-item skeleton"></div>
                        <div class="word-item skeleton"></div>
                        <div class="word-item skeleton"></div>
                        <div class="word-item skeleton"></div>
                        <div class="word-item skeleton"></div>
                        <div class="word-item skeleton"></div>
                        <div class="word-item skeleton"></div>
                        <div class="word-item skeleton"></div>
                    </div>
"@

Get-ChildItem -Filter *.html | ForEach-Object {
    $file = $_.FullName
    Write-Host "Processing $file"
    $content = [System.IO.File]::ReadAllText($file)
    
    # 1. Font display swap -> block
    $content = $content -replace "display=swap", "display=block"
    
    # 2. Inject Theme Script if missing
    if ($content -notlike "*Phase 1.5: Theme Persistence*") {
        $content = $content -replace "</head>", ($themeScript + "`n</head>")
    }
    
    # 3. Inject Skeleton if missing
    if ($content -like "*id=`"resultsList`"*") {
        if ($content -notlike "*Phase 1.5: Static Skeleton*") {
            # Use regex to find the results-list div and its contents
            $content = [regex]::Replace($content, "(?s)<div class=`"results-list`" id=`"resultsList`".*?<\/div>", $skeletonHtml)
        }
    }
    
    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
}

Write-Host "Stability polish applied to all HTML files."
