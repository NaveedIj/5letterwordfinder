# portable dataset generator for SEO-safe and Wordle-friendly vocabulary
# Usage: powershell -ExecutionPolicy Bypass -File process_words.ps1

$BaseDir = Resolve-Path (Join-Path $PSScriptRoot "..")
$DataDir = Join-Path $BaseDir "data"
$SourceDir = Join-Path $DataDir "source"
$OutputFile = Join-Path $DataDir "wordle-common.json"
$LogFile = Join-Path $DataDir "deleted_log.txt"

# source files
$ScrabbleJson = Join-Path $DataDir "scrabble.json"
$WordleSource = Join-Path $SourceDir "wordle-answers.txt"
$GoogleSource = Join-Path $SourceDir "google-10k.txt"

# Ensure directories exist
if (-not (Test-Path $SourceDir)) { New-Item -ItemType Directory -Path $SourceDir -Force }

# 1. Load Valid Dictionary (Scrabble list)
$scrabbleWords = Get-Content $ScrabbleJson -Raw -Encoding UTF8 | ConvertFrom-Json
$scrabbleSet = New-Object System.Collections.Generic.HashSet[string]
foreach ($w in $scrabbleWords) { 
    [void]$scrabbleSet.Add($w.Trim().ToLower()) 
}

# 2. Load Wordle Core Answers (High Quality Base)
$wordleWords = Get-Content $WordleSource -Encoding UTF8 | 
    Where-Object { $_ -match '^[a-z]{5}$' } | 
    ForEach-Object { $_.Trim().ToLower() } | 
    Select-Object -Unique

# 3. Load Google 10k Frequency Data (Expansion Source)
$googleWords = Get-Content $GoogleSource -Encoding UTF8 | 
    Where-Object { $_ -match '^[a-z]{5}$' } | 
    ForEach-Object { $_.Trim().ToLower() } | 
    Select-Object -Unique

# 4. Comprehensive Exclusion Filters (Harden for SEO/EEAT)
$excludedList = @{
    # Countries / Regions
    "india"="country"; "italy"="country"; "china"="country"; "japan"="country"; "egypt"="country"; 
    "qatar"="country"; "spain"="country"; "korea"="country"; "chile"="country"; "sudan"="country";
    "kenya"="country"; "libya"="country"; "syria"="country"; "yemen"="country"; "ghana"="country";
    "texas"="state"; "idaho"="state"; "maine"="state"; "miami"="city"; "vegas"="city";
    "paris"="city"; "tokyo"="city"; "dubai"="city"; "seoul"="city"; "delhi"="city";
    "lagos"="city"; "cairo"="city"; "osaka"="city"; "macau"="city"; "asian"="proper";
    
    # Religions / Figures
    "islam"="religion"; "jesus"="figure"; "bible"="religion"; "torah"="religion"; 
    "quran"="religion"; "shiva"="figure"; "allah"="figure"; "hindu"="religion";
    "greek"="proper"; "latin"="proper";
    
    # Famous Names / Surnames (Primarily Proper Nouns)
    "aaron"="name"; "alice"="name"; "annie"="name"; "barry"="name"; "betty"="name"; 
    "blair"="name"; "blake"="name"; "brian"="name"; "bryan"="name"; "burke"="name"; 
    "casey"="name"; "clara"="name"; "clark"="name"; "craig"="name"; "david"="name"; 
    "davis"="name"; "derek"="name"; "diana"="name"; "diane"="name"; "diego"="name"; 
    "donna"="name"; "dylan"="name"; "eddie"="name"; "edgar"="name"; "ellen"="name"; 
    "elvis"="name"; "emily"="name"; "fiona"="name"; "glenn"="name"; "harry"="name"; 
    "helen"="name"; "henry"="name"; "isaac"="name"; "jacob"="name"; "james"="name"; 
    "janet"="name"; "jason"="name"; "jenny"="name"; "jerry"="name"; "jesse"="name"; 
    "jimmy"="name"; "jones"="name"; "jorge"="name"; "judia"="name"; "julia"="name"; 
    "julie"="name"; "karen"="name"; "kathy"="name"; "kevin"="name"; "larry"="name"; 
    "laura"="name"; "lewis"="name"; "linda"="name"; "louis"="name"; "lucia"="name"; 
    "lynda"="name"; "marco"="name"; "maria"="name"; "marie"="name"; "mario"="name"; 
    "marko"="name"; "marks"="name"; "nancy"="name"; "naomi"="name"; "oscar"="name"; 
    "pablo"="name"; "paula"="name"; "pedro"="name"; "perry"="name"; "peter"="name"; 
    "philip"="name"; "roger"="name"; "sarah"="name"; "scott"="name"; "simon"="name"; 
    "steve"="name"; "susan"="name"; "terry"="name"; "tommy"="name"; "tyler"="name"; 
    "wayne"="name"; "smith"="name"; "brown"="name"; "willi"="name"; "clint"="name";
    "brent"="name"; "keith"="name"; "shane"="name"; "billy"="name"; "bobbie"="name";
    "bryce"="name"; "clyde"="name"; "corey"="name"; "elias"="name"; "felix"="name";
    "heidi"="name"; "irene"="name"; "jamie"="name"; "katie"="name"; "kelly"="name";
    "lance"="name"; "mandy"="name"; "megan"="name"; "molly"="name"; "pearl"="name";
    "ralph"="name"; "randy"="name"; "ricky"="name"; "robin"="name"; "shari"="name";
    "sonia"="name"; "tanya"="name"; "vicky"="name"; "wendy"="name";
    
    # Slang / Conversational Filler / Contractions
    "gonna"="slang"; "wanna"="slang"; "gotta"="slang"; "kinda"="slang"; "outta"="slang";
    "thats"="contraction"; "whats"="contraction"; "wheres"="contraction"; "hows"="contraction";
    "whys"="contraction"; "youre"="contraction"; "theyr"="contraction"; "didnt"="contraction";
    "doesnt"="contraction"; "havent"="contraction"; "cause"="filler/slang"; "yknow"="filler";
    "donot"="filler"; "canty"="slang"; "wonty"="slang";
    
    # Brands / Trademarks
    "kodak"="brand"; "xerox"="brand"; "intel"="brand"; "nikon"="brand"; "epson"="brand";
    "canon"="brand"; "cisco"="brand"; "yahoo"="brand"; "gmail"="brand"; "skype"="brand";
    "slack"="brand"; "zoom"="brand"; "tesla"="brand"; "sony"="brand"; "dell"="brand";
    "nike"="brand"; "ebay"="brand"; "lego"="brand"; "volvo"="brand"; "coke"="brand";
    
    # Profanity / Adult (Hardened)
    "asses"="profanity"; "bitch"="profanity"; "cocks"="profanity"; "dicks"="profanity";
    "prick"="profanity"; "pussy"="profanity"; "shits"="profanity"; "sluts"="profanity";
    "whore"="profanity"; "fucks"="profanity"; "fucky"="profanity"; "fubar"="profanity";
    "naked"="adult"; "penis"="adult"; "vagin"="adult"; "erect"="adult"; "horny"="adult";
    
    # Technical / Internet / Low-Quality SEO
    "ascii"="acronym"; "admin"="abbr"; "linux"="tech"; "html"="tech"; "mysql"="tech";
    "https"="tech"; "xhtml"="tech"; "blogs"="tech"; "utils"="abbr";
    "login"="web"; "setup"="web"; "email"="web"; "items"="web"; "links"="web";
    "posts"="web"; "stats"="web"; "index"="web"; "tools"="web"; "group"="web";
    "forum"="web"; "cases"="web"; "dates"="web"; "files"="web"; "tests"="web";
}

# 5. Word Processing Logic
$finalSet = New-Object System.Collections.Generic.HashSet[string]
$deletedLog = @()
$duplicates = 0

function Add-Word($word, $source) {
    # Normalization
    $word = $word.Trim().ToLower()
    
    # Length check
    if ($word.Length -ne 5) { return }
    
    # Exclusion check
    if ($excludedList.ContainsKey($word)) {
        $reason = $excludedList[$word]
        # Special case: Keep 'apple', 'march', 'grant', 'grace' if they are common words
        $exceptions = @("apple", "march", "grant", "grace", "point", "state", "place")
        if ($exceptions -contains $word -and $source -eq "WordleCore") {
             # Keep it
        } else {
            $script:deletedLog += "$word -> $reason ($source)"
            return
        }
    }
    
    # Dictionary check (Must be valid English)
    if (-not $scrabbleSet.Contains($word)) {
        $script:deletedLog += "$word -> not in dictionary ($source)"
        return
    }
    
    # Quality Heuristic: Balanced Filtering
    $vowels = "aeiouy"
    $hasVowel = $false
    foreach ($char in $word.ToCharArray()) {
        if ($vowels.Contains($char)) { $hasVowel = $true; break }
    }
    
    # Valid English words without standard vowels (keeping them)
    $allowedVowelless = @("crypt", "glyph", "gypsy", "nymph", "rhyth", "lynch", "myths", "tryst")
    if (-not $hasVowel -and -not ($allowedVowelless -contains $word)) {
        $script:deletedLog += "$word -> poor readability (no vowels) ($source)"
        return
    }
    
    # Deduplication
    if ($finalSet.Contains($word)) {
        $script:duplicates++
        return
    }
    
    [void]$finalSet.Add($word)
}

# Process Core Wordle Words First (High Priority)
foreach ($w in $wordleWords) {
    Add-Word $w "WordleCore"
}

# Process Google 10k for Expansion (Limited to top commonality)
$limit = 1000 # Add top ~1000 unique common 5-letter words
$addedFromGoogle = 0
foreach ($w in $googleWords) {
    if ($addedFromGoogle -ge $limit) { break }
    if (-not $finalSet.Contains($w)) {
        Add-Word $w "Google10k"
        if ($finalSet.Contains($w)) { $addedFromGoogle++ }
    }
}

# 6. Final Export
$finalList = $finalSet | Sort-Object
$finalList | ConvertTo-Json -Compress | Set-Content $OutputFile -Encoding UTF8

# 7. Logging and Validation
$deletedLog | Set-Content $LogFile -Encoding UTF8

# Console Report
Write-Host "------------------------------------" -ForegroundColor Cyan
Write-Host "  PRODUCTION DATASET GENERATION COMPLETE" -ForegroundColor Green
Write-Host "------------------------------------"
Write-Host "Total Selected: $($finalList.Count)"
Write-Host "Total Excluded: $($deletedLog.Count)"
Write-Host "Total Duplicates: $duplicates"
Write-Host "------------------------------------"
Write-Host "Accepted Examples: $(($finalList | Select-Object -First 10) -join ', ')"
Write-Host "Removed Examples: $(($deletedLog | Select-Object -First 10) -join ', ')"
Write-Host "------------------------------------"
Write-Host "Output: $OutputFile"
Write-Host "Log: $LogFile"
Write-Host "------------------------------------"
