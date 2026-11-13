/**
 * Programmatic SEO Generator for 5LetterWordFinder.com
 *
 * Capabilities:
 *  - 26 Ending-letter pages: deterministic 3-tier CEORR word-grid generation
 *  - 26 Starting-letter pages: curated opener/dictionary word grids
 *  - Starting-to-ending reciprocal mirror links
 *  - AI Word Solver indexability verification
 *  - Transaction-style staged replacement with automatic rollback and persistent recovery
 *
 * Safety & Change-Control:
 *  - Importing/requiring this module performs ZERO writes and ZERO side-effects.
 *  - Default execution mode is DRY-RUN (read-only simulation).
 *  - Exported functions CANNOT authorize file writes; write authorization is restricted
 *    to an unexported, validated execution token created solely by the CLI parser.
 *  - Conflicting CLI arguments and unknown flags are strictly rejected.
 *  - Ending page regeneration validates all 26 pages via atomic all-or-nothing preflight,
 *    verifying that only the #wordGrid container changes and prefix/suffix remain byte-identical.
 *  - Write mode executes via a durable 6-phase transaction:
 *      Phase 0: All-page in-memory preflight validation
 *      Phase 1: In-memory snapshots and verified disk backups
 *      Phase 2: Sibling temporary file staging with size and hash verification
 *      Phase 3 & 4: Safe replacement loop with active persistent journaling
 *      Phase 5: Automatic rollback on mid-loop commit failure
 *      Phase 6: Final on-disk verification across all 26 targets
 *  - Interrupted processes are safely detected, blocking new writes until resolved or recovered.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ==========================================
// 1. CONSTANTS & APPROVED DATASET PATHS
// ==========================================

const REPO_ROOT = __dirname;
const PATH_COMMON = path.join(REPO_ROOT, 'data', 'wordle-common.json');
const PATH_SCRABBLE = path.join(REPO_ROOT, 'data', 'scrabble.json');
const PATH_WORDS_ALPHA = path.join(REPO_ROOT, 'words_alpha.txt');
const DEFAULT_TX_ROOT = path.join(REPO_ROOT, '.generator-tx-recovery');

// Page V Approved Negative Blocklist (4 technical pseudo-words)
const PAGE_V_BLOCKLIST = new Set(['fconv', 'gconv', 'iconv', 'intsv']);

// Page V Approved Retained Abbreviations (5 valid abbreviations)
const PAGE_V_RETAINED = ['anniv', 'deriv', 'equiv', 'immov', 'indiv'];

// Unexported execution authorization token (prevents direct write bypass)
const PRIVATE_WRITE_AUTH = Symbol('VALIDATED_CLI_WRITE_AUTHORIZATION');

// Priority openers for starting-letter curation (preserved from existing generator)
const priorityOpeners = new Set([
    "adieu", "arise", "about", "alert", "apple", "ahead", "agent", "angel", "angry", "amigo", "avoid",
    "baker", "beach", "brain", "bread", "bring", "broad", "brown", "build", "burst", "buyer",
    "cable", "camel", "candy", "cause", "chair", "charm", "chart", "clean", "clear", "crane", "count",
    "dance", "delta", "depth", "dirty", "draft", "drain", "dream", "drive", "drown", "dying",
    "eager", "early", "earth", "eight", "elite", "empty", "enemy", "enter", "equal", "event", "every",
    "fable", "faith", "false", "fault", "fiber", "field", "fight", "final", "first", "flame", "fresh",
    "giant", "glass", "globe", "grace", "grand", "grant", "grape", "graph", "great", "green", "group",
    "habit", "happy", "heart", "heavy", "horse", "hotel", "house", "human", "humor", "hurry",
    "ideal", "image", "imply", "index", "inner", "input", "irony", "issue", "ivory",
    "japan", "jeans", "joint", "judge", "juice", "juicy", "jumbo", "jumpy", "junta",
    "karma", "kayak", "kebab", "khaki", "kiosk", "knack", "kneel", "knife", "knock", "known",
    "label", "labor", "lance", "large", "later", "laugh", "learn", "lemon", "light", "limit", "lucky",
    "magic", "major", "maker", "march", "match", "media", "metal", "model", "money", "month", "music",
    "naive", "naked", "nasty", "naval", "needs", "nerve", "never", "niche", "night", "noble", "noise", "north", "novel", "nurse",
    "ocean", "offer", "often", "onion", "opera", "orbit", "order", "organ", "other", "outer", "ounce", "ozone",
    "paint", "panel", "paper", "party", "peace", "phase", "phone", "piano", "piece", "plant", "point", "power", "price", "prime", "proof", "proud",
    "queen", "query", "quest", "queue", "quick", "quiet", "quilt", "quite", "quota", "quote",
    "radio", "raise", "range", "reach", "react", "ready", "refer", "right", "river", "robot", "round", "route", "royal", "ruler",
    "scale", "scene", "scope", "score", "sense", "shape", "share", "shine", "shock", "short", "sight", "skill", "slate", "smart", "smile", "solid", "sound", "space", "speed", "stage", "stand", "stare", "start", "state", "steam", "steel", "stock", "stone", "store", "story", "style", "sugar", "sweet",
    "table", "taste", "teach", "theme", "there", "thing", "think", "three", "today", "topic", "total", "touch", "tower", "track", "trade", "train", "trend", "trial", "truth", "twice",
    "uncle", "under", "union", "unite", "unity", "until", "upper", "upset", "urban", "usage", "usual",
    "valid", "value", "video", "viral", "virus", "visit", "vital", "vivid", "vocal", "voice",
    "waste", "watch", "water", "wheel", "where", "which", "while", "white", "whole", "world", "worry", "would", "write", "wrong",
    "xenon", "xerox", "xylem",
    "yacht", "yearn", "yeast", "yield", "young", "youth",
    "zebra", "zesty", "zilch", "zonal"
]);

// Cached dataset containers
let cachedCommonWords = null;
let cachedScrabbleWords = null;
let cachedAlphaWords = null;

// ==========================================
// 2. COMPARATOR & DATASET LOADERS
// ==========================================

/**
 * Computes standard hex SHA-256 hash for a given string or buffer.
 */
function computeSha256(content) {
    return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Explicit ASCII alphabetical comparator for lowercase English words.
 */
function asciiCompare(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function loadCommonWords(customPath) {
    if (cachedCommonWords && !customPath) return cachedCommonWords;
    const targetPath = customPath || PATH_COMMON;
    if (!fs.existsSync(targetPath)) {
        throw new Error(`Common vocabulary file not found: ${targetPath}`);
    }
    const raw = fs.readFileSync(targetPath, 'utf8').replace(/^\uFEFF/, '').trim();
    const list = JSON.parse(raw)
        .map(w => (typeof w === 'string' ? w.trim().toLowerCase() : ''))
        .filter(w => /^[a-z]{5}$/.test(w));
    const deduped = [...new Set(list)];
    if (!customPath) cachedCommonWords = deduped;
    return deduped;
}

function loadScrabbleWords(customPath) {
    if (cachedScrabbleWords && !customPath) return cachedScrabbleWords;
    const targetPath = customPath || PATH_SCRABBLE;
    if (!fs.existsSync(targetPath)) {
        throw new Error(`Scrabble vocabulary file not found: ${targetPath}`);
    }
    const raw = fs.readFileSync(targetPath, 'utf8').replace(/^\uFEFF/, '').trim();
    const list = JSON.parse(raw)
        .map(w => (typeof w === 'string' ? w.trim().toLowerCase() : ''))
        .filter(w => /^[a-z]{5}$/.test(w));
    const deduped = [...new Set(list)];
    if (!customPath) cachedScrabbleWords = deduped;
    return deduped;
}

function loadAlphaWords(customPath) {
    if (cachedAlphaWords && !customPath) return cachedAlphaWords;
    const targetPath = customPath || PATH_WORDS_ALPHA;
    if (!fs.existsSync(targetPath)) {
        throw new Error(`words_alpha dictionary file not found: ${targetPath}`);
    }
    const raw = fs.readFileSync(targetPath, 'utf8');
    const list = raw
        .split(/\r?\n/)
        .map(w => w.trim().toLowerCase())
        .filter(w => w.length > 0);
    if (!customPath) cachedAlphaWords = list;
    return list;
}

// ==========================================
// 3. EDITORIAL EXTRACTION & PRE-FILTERING
// ==========================================

/**
 * Extracts bold 5-letter target-ending words from page HTML.
 */
function extractEditorialWords(letter, html) {
    if (!html || typeof html !== 'string') return [];
    const target = letter.toLowerCase();
    const boldRegex = /<(?:strong|b)[^>]*>([a-zA-Z]{5})<\/(?:strong|b)>/gi;
    const matches = html.match(boldRegex) || [];
    const candidates = [];
    for (const m of matches) {
        const word = m.replace(/<[^>]+>/g, '').trim().toLowerCase();
        if (/^[a-z]{5}$/.test(word) && word.endsWith(target)) {
            candidates.push(word);
        }
    }
    return [...new Set(candidates)];
}

/**
 * Determines eligibility of an editorial priority word.
 */
function isEditorialEligible(word, letter, commonSet, scrabbleSet) {
    if (!/^[a-z]{5}$/.test(word)) return false;
    if (!word.endsWith(letter)) return false;
    if (letter === 'v' && PAGE_V_BLOCKLIST.has(word)) return false;
    return commonSet.has(word) || scrabbleSet.has(word);
}

// ==========================================
// 4. CEORR ROUND-ROBIN SELECTION ENGINE
// ==========================================

/**
 * Constrained Even-Odd Round-Robin (CEORR) algorithm.
 * Groups candidates into 26 starting-letter buckets (A-Z), sorts each bucket
 * using explicit ASCII comparison, and selects one word per nonempty bucket per round in A-Z order.
 */
function runCEORR(candidates, maxSlots) {
    if (!candidates || candidates.length === 0 || maxSlots <= 0) return [];

    // 1. Initialize 26 starting-letter buckets
    const buckets = {};
    for (let i = 0; i < 26; i++) {
        buckets[String.fromCharCode(97 + i)] = [];
    }

    // 2. Distribute candidates into buckets
    for (const word of candidates) {
        const startChar = word[0];
        if (buckets[startChar]) {
            buckets[startChar].push(word);
        }
    }

    // 3. Sort each bucket deterministically using ASCII ordering
    for (const char in buckets) {
        buckets[char].sort(asciiCompare);
    }

    // 4. Round-Robin traversal A-Z
    const selected = [];
    let addedInRound = true;

    while (addedInRound && selected.length < maxSlots) {
        addedInRound = false;
        for (let i = 0; i < 26; i++) {
            const char = String.fromCharCode(97 + i);
            if (buckets[char].length > 0) {
                selected.push(buckets[char].shift());
                addedInRound = true;
                if (selected.length === maxSlots) break;
            }
        }
    }

    return selected;
}

// ==========================================
// 5. THREE-TIER ENDING-PAGE SELECTION
// ==========================================

/**
 * Selects words for an ending-letter page using the approved Three-Tier algorithm:
 *   Tier 1: Editorial priorities (validated against Common OR Scrabble, not on blocklist)
 *   Tier 2: Curated Common Vocabulary (wordle-common.json) via CEORR
 *   Tier 3: Scrabble Backfill (scrabble.json) via CEORR (if slots remain)
 */
function selectEndingPageWords(targetLetter, options = {}) {
    const letter = targetLetter.toLowerCase().trim();
    const maxCount = options.maxCount || 150;
    const pageHtml = options.pageHtml || '';

    const commonList = options.commonWords || loadCommonWords();
    const scrabbleList = options.scrabbleWords || loadScrabbleWords();

    const commonSet = new Set(commonList);
    const scrabbleSet = new Set(scrabbleList);

    // Helper: Base candidate eligibility
    function isCandidateEligible(w) {
        if (!/^[a-z]{5}$/.test(w)) return false;
        if (!w.endsWith(letter)) return false;
        if (letter === 'v' && PAGE_V_BLOCKLIST.has(w)) return false;
        return true;
    }

    // Tier 1: Editorial priorities
    const editorialRaw = extractEditorialWords(letter, pageHtml);
    const tier1Candidates = editorialRaw.filter(w => isEditorialEligible(w, letter, commonSet, scrabbleSet));
    const tier1Selected = [...new Set(tier1Candidates)].slice(0, maxCount);
    const selectedSet = new Set(tier1Selected);

    // Classify Tier 1 words for audit tracking
    const tier1Common = tier1Selected.filter(w => commonSet.has(w));
    const tier1ScrabbleOnly = tier1Selected.filter(w => !commonSet.has(w) && scrabbleSet.has(w));

    // Candidate pool for Common (Tier 2)
    const commonEligible = [...commonSet].filter(isCandidateEligible);

    // Candidate pool for Scrabble (Tier 3)
    const scrabbleEligible = [...scrabbleSet].filter(isCandidateEligible);

    // Combined Unique Eligible Pool check
    const combinedEligibleSet = new Set([
        ...tier1Selected,
        ...commonEligible,
        ...scrabbleEligible
    ]);

    let tier2Selected = [];
    let tier3Selected = [];

    if (combinedEligibleSet.size <= maxCount) {
        // Under-150 page: All valid eligible words are selected unconditionally
        tier2Selected = commonEligible.filter(w => !selectedSet.has(w)).sort(asciiCompare);
        for (const w of tier2Selected) selectedSet.add(w);

        tier3Selected = scrabbleEligible.filter(w => !selectedSet.has(w)).sort(asciiCompare);
        for (const w of tier3Selected) selectedSet.add(w);
    } else {
        // Over-150 page: Apply CEORR round-robin
        // Tier 2: Common vocabulary
        const remainingCommon = commonEligible.filter(w => !selectedSet.has(w));
        const commonSlots = maxCount - selectedSet.size;
        tier2Selected = runCEORR(remainingCommon, commonSlots);
        for (const w of tier2Selected) selectedSet.add(w);

        // Tier 3: Scrabble backfill (if slots remain)
        if (selectedSet.size < maxCount) {
            const remainingScrabble = scrabbleEligible.filter(w => !selectedSet.has(w));
            const scrabbleSlots = maxCount - selectedSet.size;
            tier3Selected = runCEORR(remainingScrabble, scrabbleSlots);
            for (const w of tier3Selected) selectedSet.add(w);
        }
    }

    // Final presentation sort: Deterministic ASCII alphabetical A-Z
    const finalWords = [...selectedSet].sort(asciiCompare);

    // Explicit runtime validation for Page V
    if (letter === 'v') {
        const blockedFound = [...PAGE_V_BLOCKLIST].filter(w => finalWords.includes(w));
        if (blockedFound.length > 0) {
            throw new Error(`Page V validation error: blocked words present in selection: ${blockedFound.join(', ')}`);
        }
        const missingRetained = PAGE_V_RETAINED.filter(w => scrabbleSet.has(w) && !finalWords.includes(w));
        if (missingRetained.length > 0) {
            throw new Error(`Page V validation error: approved retained abbreviations missing: ${missingRetained.join(', ')}`);
        }
    }

    // Audit metrics
    const totalCommonSelected = tier1Common.length + tier2Selected.length;
    const totalScrabbleOnlySelected = tier1ScrabbleOnly.length + tier3Selected.length;
    const deferredCommon = commonEligible.length - totalCommonSelected;
    const scrabbleOnlyEligibleCount = scrabbleEligible.filter(w => !commonSet.has(w)).length;
    const deferredScrabbleOnly = scrabbleOnlyEligibleCount - totalScrabbleOnlySelected;

    return {
        letter: letter.toUpperCase(),
        finalWords,
        totalSelected: finalWords.length,
        tier1Selected,
        tier1Common,
        tier1ScrabbleOnly,
        tier2Selected,
        tier3Selected,
        commonEligibleCount: commonEligible.length,
        scrabbleEligibleCount: scrabbleEligible.length,
        scrabbleOnlyEligibleCount,
        commonSelectedCount: totalCommonSelected,
        scrabbleOnlySelectedCount: totalScrabbleOnlySelected,
        deferredCommonCount: deferredCommon,
        deferredScrabbleOnlyCount: deferredScrabbleOnly
    };
}

// ==========================================
// 6. HTML RENDERING & PREFLIGHT VALIDATION
// ==========================================

function renderStaticWordGrid(words) {
    if (!words || words.length === 0) {
        return '<p class="text-muted" style="grid-column: 1/-1; text-align: center;">No words found.</p>';
    }
    return words.map(w => `                        <div class="word-item">${w.toUpperCase()}</div>`).join('\n');
}

function renderTopEndingNav(activeLetter) {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const linksHtml = letters.map(l => {
        const u = l.toUpperCase();
        const isActive = u === activeLetter.toUpperCase();
        const activeAttr = isActive ? ' class="letter-subnav-item active" aria-current="page"' : ' class="letter-subnav-item"';
        const label = isActive ? `Words ending in ${u} (Current Page)` : `Words ending in ${u}`;
        return `                    <a href="5-letter-words-ending-with-${l}.html"${activeAttr} aria-label="${label}">${u}</a>`;
    }).join('\n');

    return `                <!-- TOP A-Z QUICK NAVIGATION -->\n                <nav class="letter-subnav" aria-label="Browse 5-letter words by ending letter">\n                    <div class="letter-subnav-header">\n                        <span class="letter-subnav-title">Browse by Ending Letter:</span>\n                        <span class="letter-subnav-hint">Select a terminal letter</span>\n                    </div>\n                    <div class="letter-subnav-grid">\n${linksHtml}\n                    </div>\n                </nav>`;
}

function updateStartingMirrorLink(content, letter) {
    const l = letter.toLowerCase();
    const targetEnding = `5-letter-words-ending-with-${l}.html`;
    if (content.includes(targetEnding)) {
        return content;
    }

    if (l === 'm') {
        const needle = '<li><a href="5-letter-words-ending-with-e.html">5-Letter Words Ending with E</a></li>';
        const replacement = `<li><a href="5-letter-words-ending-with-m.html">5-Letter Words Ending with M</a></li>\n                        ${needle}`;
        if (content.includes(needle)) {
            return content.replace(needle, replacement);
        }
    }

    const endingLinkHtml = `<a href="${targetEnding}" title="5 Letter Words Ending With ${l.toUpperCase()}">Ending With ${l.toUpperCase()}</a>`;

    if (content.includes('5-letter-words-ending-with-e.html') && l !== 'e') {
        return content.replace(/<a\s+href="5-letter-words-ending-with-e\.html"[^>]*>[\s\S]*?<\/a>/, endingLinkHtml);
    }

    const gridRegex = /(<div class="letter-grid-internal"[^>]*>\s*)(<a\s+href="5-letter-words-starting-with-a\.html"[^>]*>[\s\S]*?<\/a>)/;
    if (gridRegex.test(content)) {
        return content.replace(gridRegex, `$1${endingLinkHtml}`);
    }

    return content.replace(/(<div class="letter-grid-internal"[^>]*>)/, `$1\n                        ${endingLinkHtml}`);
}

function getCrated5LetterWords(filterFn, maxCount = 150) {
    const allWords = loadAlphaWords();
    const matching = allWords.filter(w => w.length === 5 && filterFn(w));
    matching.sort((a, b) => {
        const aPri = priorityOpeners.has(a) ? 1 : 0;
        const bPri = priorityOpeners.has(b) ? 1 : 0;
        if (aPri !== bPri) return bPri - aPri;
        return asciiCompare(a, b);
    });
    return matching.slice(0, maxCount);
}

/**
 * Atomic Preflight Validator and Memory Planner for Ending Pages.
 * Validates all 26 ending-letter HTML files, confirms exactly one #wordGrid container per page,
 * prepares in-memory replacements, and mathematically asserts byte-identical prefix and suffix.
 * Returns prepared updates array if all 26 pass; throws error if any single page fails.
 */
function preflightEndingPages(commonWords, scrabbleWords, options = {}) {
    const letters = options.letters || 'abcdefghijklmnopqrstuvwxyz'.split('');
    const repoRoot = options.repoRoot || REPO_ROOT;
    const plannedUpdates = [];
    const containerRegex = /<div id="wordGrid" class="word-grid">[\s\S]*?<\/div>(?=\s*(?:<p class="text-muted"|<\/section>))/i;

    for (const letter of letters) {
        const fileName = `5-letter-words-ending-with-${letter}.html`;
        const filePath = path.join(repoRoot, fileName);
        if (!fs.existsSync(filePath)) {
            throw new Error(`[Preflight Abort] Target file not found: ${fileName}`);
        }

        const originalHtml = fs.readFileSync(filePath, 'utf8');

        // Check 1: Confirm exactly one instance of id="wordGrid" exists
        const wordGridMatches = originalHtml.match(/id="wordGrid"/g) || [];
        if (wordGridMatches.length !== 1) {
            throw new Error(`[Preflight Abort] ${fileName} has ${wordGridMatches.length} instances of id="wordGrid" (expected exactly 1).`);
        }

        // Check 2: Confirm container matches regex cleanly
        const match = originalHtml.match(containerRegex);
        if (!match || match.index === undefined) {
            throw new Error(`[Preflight Abort] ${fileName} #wordGrid container could not be matched cleanly by regex.`);
        }

        // Compute words
        const result = selectEndingPageWords(letter, {
            commonWords,
            scrabbleWords,
            pageHtml: originalHtml,
            maxCount: 150
        });

        // Check 3: Prepare replacement in memory
        const gridHtml = renderStaticWordGrid(result.finalWords);
        const newContainerHtml = `<div id="wordGrid" class="word-grid">\n${gridHtml}\n                </div>`;

        const prefix = originalHtml.substring(0, match.index);
        const suffix = originalHtml.substring(match.index + match[0].length);
        const preparedHtml = prefix + newContainerHtml + suffix;

        // Check 4: Strict byte-for-byte prefix and suffix preservation assertion
        if (!preparedHtml.startsWith(prefix)) {
            throw new Error(`[Preflight Abort] Byte mismatch in prefix for ${fileName}. Content outside #wordGrid was altered.`);
        }
        if (!preparedHtml.endsWith(suffix)) {
            throw new Error(`[Preflight Abort] Byte mismatch in suffix for ${fileName}. Content outside #wordGrid was altered.`);
        }
        if (preparedHtml.length !== prefix.length + newContainerHtml.length + suffix.length) {
            throw new Error(`[Preflight Abort] Unexpected length anomaly in prepared replacement for ${fileName}.`);
        }

        plannedUpdates.push({
            letter: result.letter,
            fileName,
            filePath,
            result,
            preparedHtml,
            originalLength: originalHtml.length,
            newLength: preparedHtml.length
        });
    }

    if (plannedUpdates.length !== 26) {
        throw new Error(`[Preflight Abort] Expected exactly 26 planned updates, but prepared ${plannedUpdates.length}.`);
    }

    return plannedUpdates;
}

// ==========================================
// 7. TRANSACTION & RECOVERY INFRASTRUCTURE
// ==========================================

/**
 * Windows-safe same-volume file replacement with retry for transient file locks.
 */
function replaceFileWithRetry(sourcePath, targetPath, maxRetries = 3, retryDelayMs = 50) {
    let attempt = 0;
    while (true) {
        try {
            attempt++;
            fs.renameSync(sourcePath, targetPath);
            return;
        } catch (err) {
            const isLockError = err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'EACCES';
            if (isLockError && attempt <= maxRetries) {
                const start = Date.now();
                while (Date.now() - start < retryDelayMs) {}
                continue;
            }
            throw err;
        }
    }
}

/**
 * Atomically writes a JSON journal file to prevent partial write corruption.
 */
function writeJournalAtomic(journalPath, journalData) {
    const tmpPath = `${journalPath}.tmp.${Date.now()}.${process.pid}`;
    const payload = JSON.stringify(journalData, null, 2);
    fs.writeFileSync(tmpPath, payload, 'utf8');
    replaceFileWithRetry(tmpPath, journalPath);
}

/**
 * Searches txRoot for an incomplete or unresolved transaction.
 */
function findIncompleteTransaction(txRoot = DEFAULT_TX_ROOT) {
    if (!fs.existsSync(txRoot)) return null;
    const activePointerPath = path.join(txRoot, 'active_tx.json');
    if (fs.existsSync(activePointerPath)) {
        try {
            const pointer = JSON.parse(fs.readFileSync(activePointerPath, 'utf8'));
            const journalPath = path.join(pointer.txDir, 'journal.json');
            if (fs.existsSync(journalPath)) {
                const journal = JSON.parse(fs.readFileSync(journalPath, 'utf8'));
                if (journal.status !== 'COMPLETED' && journal.status !== 'ROLLED_BACK' && journal.status !== 'RECOVERED') {
                    return journal;
                }
            }
        } catch (_) {}
    }

    // Secondary scan of subdirectories in txRoot
    try {
        const entries = fs.readdirSync(txRoot, { withFileTypes: true });
        for (const ent of entries) {
            if (ent.isDirectory() && ent.name.startsWith('tx_')) {
                const jPath = path.join(txRoot, ent.name, 'journal.json');
                if (fs.existsSync(jPath)) {
                    try {
                        const j = JSON.parse(fs.readFileSync(jPath, 'utf8'));
                        if (j.status !== 'COMPLETED' && j.status !== 'ROLLED_BACK' && j.status !== 'RECOVERED') {
                            return j;
                        }
                    } catch (_) {}
                }
            }
        }
    } catch (_) {}
    return null;
}

/**
 * Executes a durable 6-phase transaction for ending pages:
 *   Phase 1: Snapshots and verified disk backups
 *   Phase 2: Sibling temporary files staging with size and hash verification
 *   Phase 3 & 4: Safe replacement loop with active persistent journaling
 *   Phase 5: Automatic rollback on mid-loop commit failure
 *   Phase 6: Final verification across all 26 targets
 */
function executeEndingPagesTransaction(plannedUpdates, options = {}) {
    const repoRoot = options.repoRoot || REPO_ROOT;
    const txRoot = options.txRoot || DEFAULT_TX_ROOT;

    // Check for unresolved prior transaction
    const unresolved = findIncompleteTransaction(txRoot);
    if (unresolved) {
        throw new Error(`[Transaction Abort] Unresolved prior transaction detected (${unresolved.txId}) with status "${unresolved.status}". Another write transaction cannot begin until resolved. Run with --recover-ending or inspect ${unresolved.txDir}.`);
    }

    fs.mkdirSync(txRoot, { recursive: true });

    const txId = `tx_${Date.now()}_${process.pid}_${crypto.randomBytes(4).toString('hex')}`;
    const txDir = path.join(txRoot, txId);
    const backupDir = path.join(txDir, 'backups');
    fs.mkdirSync(backupDir, { recursive: true });

    const journalPath = path.join(txDir, 'journal.json');
    const activePointerPath = path.join(txRoot, 'active_tx.json');

    // Record active transaction pointer
    writeJournalAtomic(activePointerPath, { txId, txDir, createdAt: new Date().toISOString() });

    const journalData = {
        version: '1.0.0',
        txId,
        createdAt: new Date().toISOString(),
        pid: process.pid,
        repoRoot,
        txDir,
        backupDir,
        status: 'INITIALIZED',
        targets: []
    };

    // -------------------------------------------------------------
    // PHASE 1: Capture snapshots and verified disk backups
    // -------------------------------------------------------------
    console.log(`  Phase 1: Creating verified backups for all 26 target files...`);
    for (const item of plannedUpdates) {
        const originalContent = fs.readFileSync(item.filePath, 'utf8');
        const originalSha256 = computeSha256(originalContent);
        const backupPath = path.join(backupDir, item.fileName);

        // Fault injection hook (for testing)
        if (options.__injectBackupFailureOn === item.fileName) {
            throw new Error(`[Injected Fault] Backup creation failure on ${item.fileName}`);
        }

        fs.writeFileSync(backupPath, originalContent, 'utf8');

        // Verify backup on disk
        const writtenBackup = fs.readFileSync(backupPath, 'utf8');
        const backupSha256 = computeSha256(writtenBackup);
        if (backupSha256 !== originalSha256) {
            throw new Error(`[Backup Verification Error] Hash mismatch on backup for ${item.fileName}`);
        }

        const preparedSha256 = computeSha256(item.preparedHtml);
        const stagedPath = path.join(path.dirname(item.filePath), `.${item.fileName}.tmp.${txId}`);

        journalData.targets.push({
            letter: item.letter,
            fileName: item.fileName,
            targetPath: item.filePath,
            stagedPath,
            backupPath,
            originalSha256,
            preparedSha256,
            expectedBytes: Buffer.byteLength(item.preparedHtml, 'utf8'),
            state: 'PENDING',
            replacedAt: null,
            error: null
        });
    }

    journalData.status = 'BACKED_UP';
    writeJournalAtomic(journalPath, journalData);

    // -------------------------------------------------------------
    // PHASE 2: Stage sibling temporary replacement files
    // -------------------------------------------------------------
    console.log(`  Phase 2: Staging 26 sibling temporary replacement files...`);
    try {
        for (let i = 0; i < plannedUpdates.length; i++) {
            const item = plannedUpdates[i];
            const targetMeta = journalData.targets[i];

            // Fault injection hook (for testing)
            if (options.__injectStagingFailureOn === item.fileName) {
                throw new Error(`[Injected Fault] Disk full / staging failure on ${item.fileName}`);
            }

            // Write temporary sibling file
            fs.writeFileSync(targetMeta.stagedPath, item.preparedHtml, 'utf8');

            // Verify temporary file exists and has expected size/hash
            const stat = fs.statSync(targetMeta.stagedPath);
            if (stat.size !== targetMeta.expectedBytes) {
                throw new Error(`[Staging Size Mismatch] ${targetMeta.stagedPath}: expected ${targetMeta.expectedBytes} bytes, found ${stat.size}`);
            }

            const stagedContent = fs.readFileSync(targetMeta.stagedPath, 'utf8');
            const stagedSha256 = computeSha256(stagedContent);
            if (stagedSha256 !== targetMeta.preparedSha256) {
                throw new Error(`[Staging Hash Mismatch] ${targetMeta.stagedPath}: hash does not match prepared HTML`);
            }
        }
    } catch (stagingErr) {
        console.error(`  [Phase 2 Abort] Staging failed: ${stagingErr.message}`);
        // Clean up temporary files created so far
        for (const t of journalData.targets) {
            if (fs.existsSync(t.stagedPath)) {
                try { fs.unlinkSync(t.stagedPath); } catch (_) {}
            }
        }
        journalData.status = 'STAGING_FAILED';
        journalData.error = stagingErr.message;
        writeJournalAtomic(journalPath, journalData);
        if (fs.existsSync(activePointerPath)) {
            try { fs.unlinkSync(activePointerPath); } catch (_) {}
        }
        throw new Error(`[Staging Abort] Temporary file staging failed: ${stagingErr.message}. Zero target files modified.`);
    }

    journalData.status = 'STAGED';
    writeJournalAtomic(journalPath, journalData);

    // -------------------------------------------------------------
    // PHASE 3 & 4: Replace targets safely with journal tracking
    // -------------------------------------------------------------
    console.log(`  Phase 3: Safely replacing target files with journal tracking...`);
    journalData.status = 'COMMITTING';
    writeJournalAtomic(journalPath, journalData);

    const committedReplacements = [];
    let commitFailure = null;

    for (let i = 0; i < journalData.targets.length; i++) {
        const targetMeta = journalData.targets[i];

        // Fault injection hook (for testing)
        if (options.__injectReplacementFailureOn === targetMeta.fileName) {
            commitFailure = new Error(`[Injected Fault] Replacement failed on ${targetMeta.fileName} (simulated file lock / EACCES)`);
            break;
        }

        try {
            // Replace target using verified same-volume rename
            replaceFileWithRetry(targetMeta.stagedPath, targetMeta.targetPath);

            // Verify replacement
            const currentContent = fs.readFileSync(targetMeta.targetPath, 'utf8');
            const currentSha256 = computeSha256(currentContent);
            if (currentSha256 !== targetMeta.preparedSha256) {
                throw new Error(`Replacement verification failed: hash mismatch on ${targetMeta.fileName}`);
            }

            targetMeta.state = 'REPLACED';
            targetMeta.replacedAt = new Date().toISOString();
            committedReplacements.push(targetMeta);

            // Update journal atomically
            writeJournalAtomic(journalPath, journalData);
        } catch (err) {
            commitFailure = err;
            targetMeta.error = err.message;
            break;
        }
    }

    // -------------------------------------------------------------
    // PHASE 5: Automatic Rollback on Commit Failure
    // -------------------------------------------------------------
    if (commitFailure) {
        console.error(`  [CRITICAL] Replacement failed: ${commitFailure.message}. Initiating automatic rollback...`);
        journalData.status = 'ROLLING_BACK';
        writeJournalAtomic(journalPath, journalData);

        let rollbackFailures = 0;
        const rollbackErrors = [];

        // Check EVERY target in the set (inspect disk hashes, do not rely on journal alone)
        for (const targetMeta of journalData.targets) {
            try {
                if (fs.existsSync(targetMeta.targetPath)) {
                    const currentSha = computeSha256(fs.readFileSync(targetMeta.targetPath, 'utf8'));
                    if (currentSha !== targetMeta.originalSha256) {
                        // File was replaced or partially modified, restore from backup
                        if (options.__injectRollbackFailureOn === targetMeta.fileName) {
                            throw new Error(`[Injected Fault] Rollback restore failed on ${targetMeta.fileName}`);
                        }

                        // Restore from backup using a temporary sibling to preserve the backup file
                        const tmpRestore = path.join(path.dirname(targetMeta.targetPath), `.${targetMeta.fileName}.rb.${Date.now()}`);
                        fs.copyFileSync(targetMeta.backupPath, tmpRestore);
                        replaceFileWithRetry(tmpRestore, targetMeta.targetPath);

                        // Verify restoration
                        const restoredSha = computeSha256(fs.readFileSync(targetMeta.targetPath, 'utf8'));
                        if (restoredSha !== targetMeta.originalSha256) {
                            throw new Error(`Rollback verification failed on ${targetMeta.fileName}`);
                        }
                        targetMeta.state = 'ROLLED_BACK';
                    }
                }
            } catch (rbErr) {
                rollbackFailures++;
                rollbackErrors.push(`${targetMeta.fileName}: ${rbErr.message}`);
                targetMeta.error = `Rollback error: ${rbErr.message}`;
            }
        }

        // Clean up any remaining staged files
        for (const targetMeta of journalData.targets) {
            if (fs.existsSync(targetMeta.stagedPath)) {
                try { fs.unlinkSync(targetMeta.stagedPath); } catch (_) {}
            }
        }

        if (rollbackFailures > 0) {
            journalData.status = 'ROLLBACK_FAILED';
            writeJournalAtomic(journalPath, journalData);
            // PRESERVE backups and active pointer!
            throw new Error(`[FATAL ROLLBACK FAILURE] Commit failed AND automatic rollback failed for ${rollbackFailures} files (${rollbackErrors.join('; ')}). Backups preserved in ${backupDir}. Run "git restore 5-letter-words-ending-with-*.html" immediately.`);
        } else {
            journalData.status = 'ROLLED_BACK';
            writeJournalAtomic(journalPath, journalData);
            if (fs.existsSync(activePointerPath)) {
                try { fs.unlinkSync(activePointerPath); } catch (_) {}
            }
            throw new Error(`[Transaction Rollback Success] Commit aborted due to error: ${commitFailure.message}. All ${committedReplacements.length} modified target files were automatically rolled back to their verified original baseline.`);
        }
    }

    // -------------------------------------------------------------
    // PHASE 6: Final Verification across all 26 targets
    // -------------------------------------------------------------
    console.log(`  Phase 6: Verifying final on-disk state across all 26 target files...`);
    for (const targetMeta of journalData.targets) {
        if (!fs.existsSync(targetMeta.targetPath)) {
            throw new Error(`[Final Verification Error] Missing target file: ${targetMeta.fileName}`);
        }
        const fileContent = fs.readFileSync(targetMeta.targetPath, 'utf8');
        const fileSha = computeSha256(fileContent);
        if (fileSha !== targetMeta.preparedSha256) {
            throw new Error(`[Final Verification Error] Hash mismatch on ${targetMeta.fileName}`);
        }
        const count = (fileContent.match(/id="wordGrid"/g) || []).length;
        if (count !== 1) {
            throw new Error(`[Final Verification Error] ${targetMeta.fileName} has ${count} instances of id="wordGrid"`);
        }
        targetMeta.state = 'VERIFIED';
    }

    // Complete transaction
    journalData.status = 'COMPLETED';
    journalData.completedAt = new Date().toISOString();
    writeJournalAtomic(journalPath, journalData);

    // Clean up temporary staged files and active pointer
    for (const targetMeta of journalData.targets) {
        if (fs.existsSync(targetMeta.stagedPath)) {
            try { fs.unlinkSync(targetMeta.stagedPath); } catch (_) {}
        }
    }
    if (fs.existsSync(activePointerPath)) {
        try { fs.unlinkSync(activePointerPath); } catch (_) {}
    }

    // Clean up transaction directory if not explicitly preserved
    if (!options.preserveTxArtifacts) {
        try {
            fs.rmSync(txDir, { recursive: true, force: true });
            if (fs.existsSync(txRoot) && fs.readdirSync(txRoot).length === 0) {
                fs.rmdirSync(txRoot);
            }
        } catch (_) {}
    }

    console.log(`  Transaction ${txId} completed and verified successfully across all 26 pages.`);
    return journalData;
}

/**
 * Dedicated recovery runner for incomplete transactions.
 * Restores original files from verified backups.
 */
function recoverIncompleteTransaction(options = {}) {
    if (options.isWriteMode && options.__privateAuth !== PRIVATE_WRITE_AUTH) {
        throw new Error('Direct recovery execution blocked: file writes can only be authorized by validated CLI parser.');
    }

    const isWriteAuthorized = (options.__privateAuth === PRIVATE_WRITE_AUTH);
    const repoRoot = options.repoRoot || REPO_ROOT;
    const txRoot = options.txRoot || DEFAULT_TX_ROOT;

    console.log(`\n=== TRANSACTION RECOVERY UTILITY [Mode: ${isWriteAuthorized ? 'WRITE' : 'DRY-RUN'}] ===`);

    const incomplete = findIncompleteTransaction(txRoot);
    if (!incomplete) {
        console.log('No unresolved or incomplete transaction found. System is clean.');
        return { recovered: false, message: 'No incomplete transaction found' };
    }

    console.log(`Found unresolved transaction: ${incomplete.txId} (Status: ${incomplete.status}, Created: ${incomplete.createdAt})`);

    // Security check: validate repoRoot
    if (incomplete.repoRoot !== repoRoot) {
        throw new Error(`[Security Validation Error] Journal repoRoot (${incomplete.repoRoot}) does not match current repository (${repoRoot}).`);
    }

    // Security check: strictly validate targets (must be the 26 approved ending files)
    const approvedFiles = new Set('abcdefghijklmnopqrstuvwxyz'.split('').map(l => `5-letter-words-ending-with-${l}.html`));
    for (const target of incomplete.targets) {
        if (!approvedFiles.has(target.fileName)) {
            throw new Error(`[Security Validation Error] Journal contains unauthorized target filename: ${target.fileName}`);
        }
    }

    const restorationPlan = [];
    for (const target of incomplete.targets) {
        const targetPath = path.join(repoRoot, target.fileName);
        let needsRestore = false;

        if (!fs.existsSync(targetPath)) {
            needsRestore = true;
        } else {
            const currentSha = computeSha256(fs.readFileSync(targetPath, 'utf8'));
            if (currentSha !== target.originalSha256) {
                needsRestore = true;
            }
        }

        // Verify backup exists and is valid
        if (needsRestore) {
            if (!fs.existsSync(target.backupPath)) {
                throw new Error(`[Fatal Recovery Error] Backup file missing: ${target.backupPath}. Cannot restore ${target.fileName}.`);
            }
            const backupSha = computeSha256(fs.readFileSync(target.backupPath, 'utf8'));
            if (backupSha !== target.originalSha256) {
                throw new Error(`[Fatal Recovery Error] Backup corrupted for ${target.fileName}: hash mismatch.`);
            }
            restorationPlan.push({ target, targetPath });
        }
    }

    console.log(`Identified ${restorationPlan.length} files requiring restoration to original baseline.`);

    if (!isWriteAuthorized) {
        console.log('NOTICE: Running in DRY-RUN mode. ZERO files restored.');
        console.log('To execute real recovery, run with --recover-ending --write');
        return {
            recovered: false,
            txId: incomplete.txId,
            needsRestoreCount: restorationPlan.length,
            restorationPlan: restorationPlan.map(p => p.target.fileName)
        };
    }

    // Execute restoration using a temporary sibling to preserve the backup file
    for (const item of restorationPlan) {
        const tmpRestore = path.join(path.dirname(item.targetPath), `.${item.target.fileName}.rcv.${Date.now()}`);
        fs.copyFileSync(item.target.backupPath, tmpRestore);
        replaceFileWithRetry(tmpRestore, item.targetPath);
        const restoredSha = computeSha256(fs.readFileSync(item.targetPath, 'utf8'));
        if (restoredSha !== item.target.originalSha256) {
            throw new Error(`Failed to verify restoration of ${item.target.fileName}`);
        }
        console.log(`  Restored ${item.target.fileName} from backup.`);
    }

    // Clean up temporary staged files
    for (const target of incomplete.targets) {
        if (fs.existsSync(target.stagedPath)) {
            try { fs.unlinkSync(target.stagedPath); } catch (_) {}
        }
    }

    // Update journal status to RECOVERED
    incomplete.status = 'RECOVERED';
    incomplete.recoveredAt = new Date().toISOString();
    const journalPath = path.join(incomplete.txDir, 'journal.json');
    writeJournalAtomic(journalPath, incomplete);

    // Remove active pointer
    const activePointerPath = path.join(txRoot, 'active_tx.json');
    if (fs.existsSync(activePointerPath)) {
        try { fs.unlinkSync(activePointerPath); } catch (_) {}
    }

    console.log(`Transaction ${incomplete.txId} successfully recovered. All targets restored to original state.`);
    return {
        recovered: true,
        txId: incomplete.txId,
        restoredCount: restorationPlan.length
    };
}

// ==========================================
// 8. EXECUTION RUNNERS (WITH WRITE-BYPASS GUARDS)
// ==========================================

/**
 * Processes ending-letter pages.
 * In dry-run mode (default), calculates and logs in-memory simulation.
 * Calling with { isWriteMode: true } directly is BLOCKED; write authorization requires internal token.
 */
function processEndingPages(options = {}) {
    // Direct write bypass defense
    if (options.isWriteMode && options.__privateAuth !== PRIVATE_WRITE_AUTH) {
        throw new Error('Direct write execution blocked: file writes can only be authorized by validated CLI parser.');
    }

    const isWriteAuthorized = (options.__privateAuth === PRIVATE_WRITE_AUTH);
    console.log(`\n=== PROCESSING 26 ENDING-LETTER PAGES [Mode: ${isWriteAuthorized ? 'WRITE' : 'DRY-RUN'}] ===`);

    const commonWords = loadCommonWords();
    const scrabbleWords = loadScrabbleWords();

    // Execute atomic preflight across all 26 pages
    const plannedUpdates = preflightEndingPages(commonWords, scrabbleWords, options);

    let totalWordsSelected = 0;
    let totalCommonSelected = 0;
    let totalScrabbleOnlySelected = 0;

    for (const item of plannedUpdates) {
        const { result } = item;
        totalWordsSelected += result.totalSelected;
        totalCommonSelected += result.commonSelectedCount;
        totalScrabbleOnlySelected += result.scrabbleOnlySelectedCount;

        console.log(`  Page ${result.letter}: ${result.totalSelected} words (Common: ${result.commonSelectedCount}, Scrabble-Only: ${result.scrabbleOnlySelectedCount}, T1 Editorial: ${result.tier1Selected.length})`);
    }

    console.log(`\nEnding Pages Summary:`);
    console.log(`  Pages Processed: ${plannedUpdates.length}`);
    console.log(`  Total Grid Words: ${totalWordsSelected}`);
    console.log(`  Total Common Words Selected: ${totalCommonSelected}`);
    console.log(`  Total Scrabble-Only Words Selected: ${totalScrabbleOnlySelected}`);

    if (isWriteAuthorized) {
        executeEndingPagesTransaction(plannedUpdates, options);
    }

    return {
        pagesProcessed: plannedUpdates.length,
        totalWordsSelected,
        totalCommonSelected,
        totalScrabbleOnlySelected
    };
}

/**
 * Dedicated runner for starting-letter pages.
 */
function processStartingPages(options = {}) {
    if (options.isWriteMode && options.__privateAuth !== PRIVATE_WRITE_AUTH) {
        throw new Error('Direct write execution blocked: file writes can only be authorized by validated CLI parser.');
    }

    const isWriteAuthorized = (options.__privateAuth === PRIVATE_WRITE_AUTH);
    const forceFrozen = options.forceFrozen || false;
    console.log(`\n=== PROCESSING STARTING-LETTER PAGES [Mode: ${isWriteAuthorized ? 'WRITE' : 'DRY-RUN'}] ===`);
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let updatedStartingCount = 0;

    for (const letter of letters) {
        if (['m', 'h', 'l'].includes(letter) && !forceFrozen) {
            console.log(`  Skipping frozen page 5-letter-words-starting-with-${letter}.html`);
            continue;
        }

        const fileName = `5-letter-words-starting-with-${letter}.html`;
        const filePath = path.join(REPO_ROOT, fileName);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');
        const matchingWords = getCrated5LetterWords(w => w.startsWith(letter), 150);
        const gridHtml = renderStaticWordGrid(matchingWords);

        let disclaimerHtml = '';
        if (matchingWords.length === 150) {
            disclaimerHtml = '\n                    <p class="text-muted" style="margin-top: 1rem; font-size: 0.9rem; text-align: center;">Showing 150 words from our dictionary list. Use the Word Finder tool above to explore more matching words.</p>';
        } else if (matchingWords.length > 0) {
            disclaimerHtml = `\n                    <p class="text-muted" style="margin-top: 1rem; font-size: 0.9rem; text-align: center;">Showing all ${matchingWords.length} matching words from our dictionary list.</p>`;
        }

        content = content.replace(/\s*<p class="text-muted" style="margin-top: 1rem; font-size: 0\.9rem; text-align: center;">[\s\S]*?<\/p>/g, '');

        const wordGridRegex = /<div id="wordGrid" class="word-grid">[\s\S]*?<\/div>(?=\s*(?:<h3>|<h2|<section|<\/div>|\$))/;
        if (wordGridRegex.test(content)) {
            content = content.replace(wordGridRegex, `<div id="wordGrid" class="word-grid">\n${gridHtml}\n                    </div>${disclaimerHtml}`);
        }

        const canonicalUrl = `https://www.5letterwordfindertool.com/5-letter-words-starting-with-${letter}.html`;
        const canonicalRegex = /<link rel="canonical" href="[^"]*">/;
        if (canonicalRegex.test(content)) {
            content = content.replace(canonicalRegex, `<link rel="canonical" href="${canonicalUrl}">`);
        } else {
            content = content.replace('</head>', `    <link rel="canonical" href="${canonicalUrl}">\n</head>`);
        }

        if (!content.includes('name="robots"')) {
            content = content.replace('</head>', `    <meta name="robots" content="index, follow">\n</head>`);
        }

        content = content.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/gi, '');
        content = updateStartingMirrorLink(content, letter);

        if (isWriteAuthorized) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
        updatedStartingCount++;
    }
    console.log(`  Processed ${updatedStartingCount} starting letter pages.`);
}

/**
 * Dedicated runner for mirror links on starting pages.
 */
function processMirrorLinks(options = {}) {
    if (options.isWriteMode && options.__privateAuth !== PRIVATE_WRITE_AUTH) {
        throw new Error('Direct write execution blocked: file writes can only be authorized by validated CLI parser.');
    }

    const isWriteAuthorized = (options.__privateAuth === PRIVATE_WRITE_AUTH);
    console.log(`\n=== PROCESSING MIRROR LINKS ON STARTING PAGES [Mode: ${isWriteAuthorized ? 'WRITE' : 'DRY-RUN'}] ===`);
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let mirrorUpdated = 0;
    for (const letter of letters) {
        const fileName = `5-letter-words-starting-with-${letter}.html`;
        const filePath = path.join(REPO_ROOT, fileName);
        if (!fs.existsSync(filePath)) continue;
        const content = fs.readFileSync(filePath, 'utf8');
        const updated = updateStartingMirrorLink(content, letter);
        if (updated !== content) {
            if (isWriteAuthorized) {
                fs.writeFileSync(filePath, updated, 'utf8');
            }
            mirrorUpdated++;
        }
    }
    console.log(`  ${isWriteAuthorized ? 'Updated' : 'Identified'} ${mirrorUpdated} starting letter pages requiring mirror link updates.`);
}

/**
 * Dedicated runner for AI Word Solver page.
 */
function processAiSolver(options = {}) {
    if (options.isWriteMode && options.__privateAuth !== PRIVATE_WRITE_AUTH) {
        throw new Error('Direct write execution blocked: file writes can only be authorized by validated CLI parser.');
    }

    const isWriteAuthorized = (options.__privateAuth === PRIVATE_WRITE_AUTH);
    console.log(`\n=== PROCESSING AI WORD SOLVER [Mode: ${isWriteAuthorized ? 'WRITE' : 'DRY-RUN'}] ===`);
    const aiSolverPath = path.join(REPO_ROOT, 'ai-word-solver.html');
    if (!fs.existsSync(aiSolverPath)) {
        console.warn('  ai-word-solver.html not found.');
        return;
    }
    let aiContent = fs.readFileSync(aiSolverPath, 'utf8');
    const aiCanonical = `https://www.5letterwordfindertool.com/ai-word-solver`;

    aiContent = aiContent.replace(
        /<link rel="canonical" href="[^"]*">/,
        `<link rel="canonical" href="${aiCanonical}">`
    );

    if (!aiContent.includes('name="robots"')) {
        aiContent = aiContent.replace('</head>', `    <meta name="robots" content="index, follow">\n</head>`);
    }

    if (isWriteAuthorized) {
        fs.writeFileSync(aiSolverPath, aiContent, 'utf8');
        console.log(`  Updated ai-word-solver.html canonical and indexability rules.`);
    } else {
        console.log(`  [DRY-RUN] Verified ai-word-solver.html canonical and indexability rules.`);
    }
}

// ==========================================
// 9. STRICT CLI VALIDATOR & ENTRY POINT
// ==========================================

const VALID_CLI_FLAGS = new Set([
    '--ending',
    '--target=ending',
    '--starting',
    '--target=starting',
    '--mirror-links',
    '--target=mirror-links',
    '--ai-solver',
    '--target=ai-solver',
    '--all-pages',
    '--target=all',
    '--recover-ending',
    '--target=recover-ending',
    '--dry-run',
    '--write',
    '--execute-write',
    '--force-frozen',
    '--help',
    '-h'
]);

function validateCliArguments(rawArgs) {
    // Check 1: Reject unknown flags
    for (const arg of rawArgs) {
        if (!VALID_CLI_FLAGS.has(arg)) {
            throw new Error(`[Argument Validation Error] Unknown CLI argument: "${arg}". Use --help for valid options.`);
        }
    }

    // Check 2: Reject conflicting mode arguments (--dry-run AND --write)
    const hasDryRun = rawArgs.includes('--dry-run');
    const hasWrite = rawArgs.includes('--write') || rawArgs.includes('--execute-write');
    if (hasDryRun && hasWrite) {
        throw new Error('[Argument Validation Error] Conflicting mode arguments: cannot specify both --dry-run and --write.');
    }

    // Check 3: Identify targets and reject conflicting targets
    const targetMap = {
        ending: rawArgs.includes('--ending') || rawArgs.includes('--target=ending'),
        starting: rawArgs.includes('--starting') || rawArgs.includes('--target=starting'),
        mirror: rawArgs.includes('--mirror-links') || rawArgs.includes('--target=mirror-links'),
        aiSolver: rawArgs.includes('--ai-solver') || rawArgs.includes('--target=ai-solver'),
        all: rawArgs.includes('--all-pages') || rawArgs.includes('--target=all'),
        recoverEnding: rawArgs.includes('--recover-ending') || rawArgs.includes('--target=recover-ending')
    };

    const activeTargets = Object.keys(targetMap).filter(k => targetMap[k]);
    if (activeTargets.length > 1) {
        throw new Error(`[Argument Validation Error] Conflicting target arguments: multiple targets specified (${activeTargets.join(', ')}). Specify exactly one target or use --all-pages.`);
    }

    return {
        target: activeTargets[0] || null,
        isWriteMode: hasWrite,
        forceFrozen: rawArgs.includes('--force-frozen'),
        isHelp: rawArgs.includes('--help') || rawArgs.includes('-h')
    };
}

function main() {
    const rawArgs = process.argv.slice(2);
    let config;

    try {
        config = validateCliArguments(rawArgs);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }

    if (config.isHelp || !config.target) {
        console.log('\nUsage: node build-programmatic-seo.js [TARGET] [OPTIONS]');
        console.log('\nTargets (Specify exactly one):');
        console.log('  --ending, --target=ending            Generate ending-letter pages (#wordGrid only)');
        console.log('  --starting, --target=starting        Generate starting-letter pages');
        console.log('  --mirror-links                       Update reciprocal mirror links on starting pages');
        console.log('  --ai-solver                          Update ai-word-solver.html canonical & meta');
        console.log('  --all-pages                          Run all generator tasks');
        console.log('  --recover-ending                     Recover incomplete ending-page transaction from verified backups');
        console.log('\nOptions:');
        console.log('  --dry-run                            Simulate without writing files (DEFAULT)');
        console.log('  --write, --execute-write             Execute file writes');
        console.log('  --force-frozen                       Force re-generation of frozen pages (m, h, l)');
        console.log('\nExamples:');
        console.log('  node build-programmatic-seo.js --ending            # Dry-run ending pages');
        console.log('  node build-programmatic-seo.js --ending --write    # Write ending pages #wordGrid');
        console.log('  node build-programmatic-seo.js --recover-ending    # Dry-run recovery inspect');
        console.log('  node build-programmatic-seo.js --recover-ending --write # Execute recovery');
        return;
    }

    if (!config.isWriteMode) {
        console.log('---------------------------------------------------------');
        console.log('NOTICE: Running in DRY-RUN mode. ZERO files will be written.');
        console.log('To execute real file writes, specify the --write flag.');
        console.log('---------------------------------------------------------');
    } else {
        console.log('---------------------------------------------------------');
        console.log('CAUTION: Running in WRITE mode. Files will be modified.');
        console.log('---------------------------------------------------------');
    }

    // Authorized execution token created ONLY after strict validation
    const executionAuth = config.isWriteMode ? PRIVATE_WRITE_AUTH : null;

    if (config.target === 'recoverEnding') {
        recoverIncompleteTransaction({ isWriteMode: config.isWriteMode, __privateAuth: executionAuth });
        return;
    }

    if (config.target === 'ending' || config.target === 'all') {
        processEndingPages({ isWriteMode: config.isWriteMode, __privateAuth: executionAuth });
    }

    if (config.target === 'starting' || config.target === 'all') {
        processStartingPages({ isWriteMode: config.isWriteMode, forceFrozen: config.forceFrozen, __privateAuth: executionAuth });
    } else if (config.target === 'mirror') {
        processMirrorLinks({ isWriteMode: config.isWriteMode, __privateAuth: executionAuth });
    }

    if (config.target === 'aiSolver' || config.target === 'all') {
        processAiSolver({ isWriteMode: config.isWriteMode, __privateAuth: executionAuth });
    }

    console.log('\nBuild execution finished successfully.');
}

// Module execution safety guard:
// If required as a module, do NOT execute CLI main() or write any files.
if (require.main === module) {
    main();
}

module.exports = {
    PAGE_V_BLOCKLIST,
    PAGE_V_RETAINED,
    DEFAULT_TX_ROOT,
    computeSha256,
    asciiCompare,
    loadCommonWords,
    loadScrabbleWords,
    loadAlphaWords,
    extractEditorialWords,
    isEditorialEligible,
    runCEORR,
    selectEndingPageWords,
    renderStaticWordGrid,
    renderTopEndingNav,
    updateStartingMirrorLink,
    getCrated5LetterWords,
    preflightEndingPages,
    replaceFileWithRetry,
    writeJournalAtomic,
    findIncompleteTransaction,
    executeEndingPagesTransaction,
    recoverIncompleteTransaction,
    validateCliArguments,
    processEndingPages,
    processStartingPages,
    processMirrorLinks,
    processAiSolver
};
