$scrabblePath = 'c:\laragon\www\5-letter-word-finder\data\scrabble.json'
$wordleListPath = 'C:\Users\dell\.gemini\antigravity\brain\01e34456-c57d-401e-8cf7-3a0e44a1560c\.system_generated\steps\51\content.md'
$google10kPath = 'C:\Users\dell\.gemini\antigravity\brain\01e34456-c57d-401e-8cf7-3a0e44a1560c\.system_generated\steps\69\content.md'

# 1. Load Scrabble list
$scrabbleWords = Get-Content $scrabblePath | ConvertFrom-Json
$scrabbleSet = New-Object System.Collections.Generic.HashSet[string]
foreach ($w in $scrabbleWords) { [void]$scrabbleSet.Add($w.ToLower()) }

# 2. Load Wordle Answers
$wordleContent = Get-Content $wordleListPath
$wordleWordsRaw = $wordleContent | Where-Object { $_ -match '^[a-z]{5}$' } | ForEach-Object { $_.ToLower() }

# 3. Load Google 10k
$googleContent = Get-Content $google10kPath
$google5Letter = $googleContent | Where-Object { $_ -match '^[a-z]{5}$' } | ForEach-Object { $_.ToLower() }

# 4. Exclusion list
$exclude = @(
    'asses', 'bitch', 'cocks', 'dicks', 'prick', 'pussy', 'shits', 'sluts', 'whore', 'fucks', 'fucky', 'fubar', 'naked', 'penis', 'vagin', 'erect', 'horny',
    'aaron', 'alice', 'annie', 'barry', 'betty', 'blair', 'blake', 'brian', 'bryan', 'burke', 'casey', 'clara', 'clark', 'craig', 'david', 'davis', 'derek', 'diana', 'diane', 'diego', 'donna', 'dylan', 'eddie', 'edgar', 'ellen', 'elvis', 'emily', 'fiona', 'glenn', 'harry', 'helen', 'henry', 'isaac', 'jacob', 'james', 'janet', 'jason', 'jenny', 'jerry', 'jesse', 'jimmy', 'jones', 'jorge', 'judia', 'julia', 'julie', 'karen', 'kathy', 'kevin', 'larry', 'laura', 'lewis', 'linda', 'louis', 'lucia', 'lynda', 'marco', 'maria', 'marie', 'mario', 'marko', 'nancy', 'naomi', 'oscar', 'pablo', 'paula', 'pedro', 'perry', 'peter', 'philip', 'roger', 'sarah', 'scott', 'simon', 'steve', 'susan', 'terry', 'tommy', 'tyler', 'wayne', 'smith', 'brown', 'jones', 'willi', 'clint', 'brent', 'keith', 'shane', 'billy', 'bobbie', 'bryce', 'clyde', 'corey', 'elias', 'felix', 'heidi', 'irene', 'jamie', 'katie', 'kelly', 'kevin', 'lance', 'mandy', 'megan', 'molly', 'pearl', 'ralph', 'randy', 'ricky', 'robin', 'shari', 'sonia', 'tanya', 'vicky', 'wendy',
    'ascii', 'admin', 'linux', 'intel', 'canon', 'nikon', 'adobe', 'epson', 'cisco', 'yahoo', 'gmail', 'skype', 'blogs', 'email', 'stats', 'utils', 'xhtml', 'mysql', 'https'
)
$excludeSet = New-Object System.Collections.Generic.HashSet[string]
foreach ($e in $exclude) { [void]$excludeSet.Add($e) }

# 5. Merge
$combinedSet = New-Object System.Collections.Generic.HashSet[string]
foreach ($w in $wordleWordsRaw) { 
    if (-not $excludeSet.Contains($w)) { 
        [void]$combinedSet.Add($w) 
    }
}

$addedCount = 0
foreach ($w in $google5Letter) {
    if ($addedCount -ge 800) { break }
    if ($scrabbleSet.Contains($w) -and -not $excludeSet.Contains($w)) {
        if ($combinedSet.Add($w)) {
            $addedCount++
        }
    }
}

$finalWords = $combinedSet | Where-Object { $_ -match '^[a-z]{5}$' -and -not $excludeSet.Contains($_) } | Sort-Object

# 6. Output
$finalWords | ConvertTo-Json | Set-Content 'c:\laragon\www\5-letter-word-finder\data\wordle-common.json'

# Report
$totalSelected = $finalWords.Count
$totalExcluded = $scrabbleSet.Count - $totalSelected
$acceptedEx = $finalWords[100..119] -join ', '
$excludedEx = ($scrabbleSet | Where-Object { -not $combinedSet.Contains($_) } | Select-Object -First 20) -join ', '

Write-Host "Total selected words: $totalSelected"
Write-Host "Total excluded words: $totalExcluded"
Write-Host "Accepted examples: $acceptedEx"
Write-Host "Excluded examples: $excludedEx"
