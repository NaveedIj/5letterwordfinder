$ORD = @{ 3 = 'Three'; 4 = 'Four'; 6 = 'Six'; 7 = 'Seven'; 8 = 'Eight' }
$ord_low = @{ 3 = 'three'; 4 = 'four'; 6 = 'six'; 7 = 'seven'; 8 = 'eight' }

function Build-CharInputs($n) {
    $inputs = for ($i = 0; $i -lt $n; $i++) {
        $af = if ($i -eq 0) { ' autofocus' } else { '' }
        "                    <input type=`"text`" class=`"char-input`" maxlength=`"1`" autocomplete=`"off`" spellcheck=`"false`"$af id=`"pos$i`" aria-label=`"Letter position $($i + 1)`">"
    }
    return $inputs -join "`n"
}

function Build-WrongInputs($n) {
    $inputs = for ($i = 0; $i -lt $n; $i++) {
        "                    <input type=`"text`" class=`"wrong-pos-input`" maxlength=`"2`" placeholder=`"-`" autocomplete=`"off`" spellcheck=`"false`" id=`"w$i`" aria-label=`"Wrong position letters for slot $($i + 1)`">"
    }
    return $inputs -join "`n"
}

$tpl = [System.IO.File]::ReadAllText("index.html")

foreach ($n in @(3, 4, 6, 7, 8)) {
    $html = $tpl
    $O = $ORD[$n]
    $o = $ord_low[$n]
    
    # 1. Update Body
    $html = [regex]::Replace($html, "<body[^>]*>", "<body data-word-length=`"$n`" data-pattern=`"length`" data-seo-strategy=`"WORDLE_SOLVER`" style=`"--word-len: $n;`">")
    
    # 2. Metadata
    $title = "$O Letter Word Finder - Solver & Unscrambler"
    $desc = "Filter $o-letter words with green, yellow, and gray logic, Scrabble scores, and sorting. Runs in your browser - no sign-up."
    $keys = "$n letter word finder, $o letter words, word solver, unscrambler"
    
    $html = [regex]::Replace($html, "(?s)<title>.*?</title>", "<title>$title</title>")
    $html = [regex]::Replace($html, "(?s)<meta name=`"description`"\s+content=`".*?`">", "<meta name=`"description`" content=`"$desc`">")
    $html = [regex]::Replace($html, "(?s)<meta name=`"keywords`"\s+content=`".*?`">", "<meta name=`"keywords`" content=`"$keys`">")
    
    # 3. Headings
    $html = [regex]::Replace($html, "<h1 class=`"title`">[^<]+<\/h1>", "<h1 class=`"title`">$O Letter Word Finder</h1>")
    $html = [regex]::Replace($html, "(?s)<p class=`"subtitle`">.*?</p>", "<p class=`"subtitle`">Same filters as our Wordle helper - tuned for $o-letter words.</p>")
    
    # 4. Filter Grids
    $html = [regex]::Replace($html, "(?s)<div class=`"pattern-grid`" id=`"patternGrid`">.*?<\/div>", "<div class=`"pattern-grid`" id=`"patternGrid`">`n$(Build-CharInputs $n)`n                </div>")
    $html = [regex]::Replace($html, "(?s)<div class=`"wrong-pos-grid`" id=`"wrongPosGrid`">.*?<\/div>", "<div class=`"wrong-pos-grid`" id=`"wrongPosGrid`">`n$(Build-WrongInputs $n)`n                </div>")
    
    # 5. Script Inclusion
    $html = [regex]::Replace($html, "(?s)<script src=`"\.\/words\.js`"><\/script>\s*\r?\n\s*<script src=`"\.\/script\.js`"><\/script>", "<script src=`"words-by-length.js`"></script>`n    <script src=`"script.js`"></script>")
    
    # 6. Nav Highlighting
    $fname = "$n-letter-word-finder.html"
    $html = $html.Replace("nav-link nav-link--current", "nav-link")
    $html = $html.Replace("nav-menu-link active", "nav-menu-link")
    
    $html = [regex]::Replace($html, "href=`"$fname`" class=`"nav-link`"", "href=`"$fname`" class=`"nav-link nav-link--current`"")
    $html = [regex]::Replace($html, "href=`"$fname`" class=`"nav-menu-link`"", "href=`"$fname`" class=`"nav-menu-link active`"")

    # Final Cleanup
    $html = [regex]::Replace($html, "(?s)<!-- Open Graph / Facebook -->.*?<!-- Twitter -->.*?<!-- Preconnect", "<!-- Preconnect")

    [System.IO.File]::WriteAllText($fname, $html, [System.Text.Encoding]::UTF8)
    Write-Host "Wrote $fname"
}
