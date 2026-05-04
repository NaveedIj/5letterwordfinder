$files = @(
    '6-letter-word-finder.html',
    '7-letter-word-finder.html',
    '8-letter-word-finder.html',
    'about.html',
    'contact.html',
    'privacy.html',
    '5-letter-words-ending-with-e.html',
    '5-letter-words-starting-with-a.html',
    'game.html'
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content -Path $file -Raw
        
        $css_file = if ($file -eq 'game.html') { 'game_style.min.css' } else { 'style.min.css' }
        
        $css_block_new = @"
<!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Preload critical fonts -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap" as="style">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap" media="print" onload="this.media='all'">
    
    <!-- Optimized CSS Loading -->
    <link rel="preload" href="$css_file" as="style">
    <link rel="stylesheet" href="$css_file" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="$css_file"></noscript>
"@
        
        # Regex to find preconnect and stylesheet links
        $content = $content -replace '(?s)<link rel="preconnect" href="https://fonts.googleapis.com">.*?<link rel="stylesheet" href="(style|game_style).css">', $css_block_new

        # 2. Update Social Icons (Accessibility fix)
        $social_new = @"
<div class="social-icons" role="list">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="icon" aria-label="Follow us on Facebook" role="listitem">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54V12h2.54V9.79c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.95h-2.33v7C18.34 21.19 22 17.04 22 12.06c0-5.53-4.5-10.02-10-10.02z"/></svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="icon" aria-label="Follow us on Twitter" role="listitem">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="icon" aria-label="Follow us on LinkedIn" role="listitem">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.18-3.46c-1.34 0-1.94.75-2.28 1.25V9.43h-2.58v9.07h2.58v-4.57c0-1.21.23-2.39 1.74-2.39 1.49 0 1.5 1.39 1.5 2.47v4.56h2.22zM6.6 8.35c.83 0 1.5-.68 1.5-1.5 0-.83-.67-1.5-1.5-1.5S5.1 6.02 5.1 6.85c0 .82.67 1.5 1.5 1.5zM5.3 18.5h2.58V9.43H5.3v9.07z"/></svg>
                        </a>
                    </div>
"@
        
        $content = $content -replace '(?s)<div class="social-icons">.*?<span class="icon" aria-label="LinkedIn">.*?</span>\s*</div>', $social_new
        
        $content | Set-Content -Path $file -Encoding UTF8
    }
}
