const WORD_LENGTH = parseInt(document.body.dataset.wordLength || '5', 10) || 5;
const IS_WORDLE_LENGTH = WORD_LENGTH === 5;

const charInputs = Array.from(document.querySelectorAll('.char-input'));
const wrongPosInputs = Array.from(document.querySelectorAll('.wrong-pos-input'));
const excludesInput = document.getElementById('excludes');
const mustIncludeInput = document.getElementById('mustInclude');
const repeatSensitiveInput = document.getElementById('repeatSensitive');
const resetBtn = document.getElementById('resetBtn');
const findBtn = document.getElementById('findBtn');
const resultsList = document.getElementById('resultsList');
const resultsCount = document.getElementById('resultsCount');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');
const statWordCount = document.getElementById('statWordCount');
const sortSelect = document.getElementById('sortSelect');
const showScrabbleInput = document.getElementById('showScrabble');

let commonList = [];
const fullList = typeof wordList !== 'undefined' ? wordList : [];
let currentDict = IS_WORDLE_LENGTH ? 'common' : 'full';

// Visual Stability: Synchronously initialize activeList based on data-attributes
// to prevent "0" or "-" jumping to a real number during async fetch.
let activeList = IS_WORDLE_LENGTH 
    ? fullList.filter(w => w.length === 5) 
    : fullList.filter(w => w.length === WORD_LENGTH);

let currentResults = [];

/**
 * Loads the primary common dataset from JSON
 * Provides a cleaner, SEO-safe word list for the public-facing UI.
 */
async function loadCommonDataset() {
    if (!IS_WORDLE_LENGTH) {
        activeList = fullList.filter(w => w.length === WORD_LENGTH);
        return;
    }
    
    try {
        const response = await fetch('/data/wordle-common.json');
        if (!response.ok) throw new Error('Dataset fetch failed');
        commonList = await response.json();
        
        // If the current dictionary is set to common, update activeList and refresh UI
        // This only happens once on startup or when the toggle is triggered.
        if (currentDict === 'common') {
            const oldLength = activeList.length;
            activeList = commonList;
            
            // Only re-render if the dataset actually changed
            if (oldLength !== activeList.length) {
                updateResults();
                initStats();
            }
        }
    } catch (err) {
        console.warn("Falling back to internal dictionary:", err);
        commonList = fullList.filter(w => w.length === 5);
        if (currentDict === 'common') {
            activeList = commonList;
            updateResults();
            initStats();
        }
    }
}





const dictToggle = document.getElementById('dictToggle');
const dictCard = document.getElementById('dictCard');
const playWordleCard = document.querySelector('.play-wordle-card');
const letterTracker = document.getElementById('letterTracker');

const navPanel = document.getElementById('navPanel');
const navOverlay = document.getElementById('navOverlay');
const closeNavBtn = document.getElementById('closeNavBtn');
const darkModeToggle = document.getElementById('darkModeToggle');

const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');

const SCRABBLE = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
    N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

function scrabbleScore(word) {
    let s = 0;
    for (const c of word.toUpperCase()) {
        if (SCRABBLE[c] !== undefined) s += SCRABBLE[c];
    }
    return s;
}

function countLetters(str) {
    const o = {};
    for (const c of str) {
        if (/[A-Z]/.test(c)) o[c] = (o[c] || 0) + 1;
    }
    return o;
}

function mergeCounts(a, b) {
    const o = { ...a };
    for (const [k, v] of Object.entries(b)) {
        o[k] = (o[k] || 0) + v;
    }
    return o;
}


const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let trackerState = {};


function parseMustInclude(raw) {
    return countLetters(raw.toUpperCase().replace(/[^A-Z]/g, ''));
}

function yellowMultiset(wrongPosArr) {
    const o = {};
    for (const chars of wrongPosArr) {
        for (const c of (chars || '').toUpperCase()) {
            if (/[A-Z]/.test(c)) o[c] = (o[c] || 0) + 1;
        }
    }
    return o;
}

function greenCountsFromPattern(pattern) {
    const o = {};
    for (let i = 0; i < WORD_LENGTH; i++) {
        const p = pattern[i];
        if (p !== '_' && p !== '?' && /[A-Z]/.test(p)) o[p] = (o[p] || 0) + 1;
    }
    return o;
}

function meetsMinimumCounts(upperWord, minimums) {
    const wc = countLetters(upperWord);
    for (const [c, need] of Object.entries(minimums)) {
        if ((wc[c] || 0) < need) return false;
    }
    return true;
}

function getEffectiveExcludes(excludeList, pattern, wrongPosArr, mustIncludeCounts) {
    const required = new Set();
    for (let i = 0; i < WORD_LENGTH; i++) {
        const p = pattern[i];
        if (p !== '_' && p !== '?' && /[A-Z]/.test(p)) required.add(p);
    }
    for (const chars of wrongPosArr) {
        for (const c of (chars || '').toUpperCase()) {
            if (/[A-Z]/.test(c)) required.add(c);
        }
    }
    for (const c of Object.keys(mustIncludeCounts)) required.add(c);
    return excludeList.filter(c => !required.has(c));
}

function detectFilterConflicts(pattern, wrongPosArr, excludesAll, mustIncludeCounts) {
    const conflicts = [];
    const greenSet = new Set(pattern.split('').filter(c => /[A-Z]/.test(c)));
    const yellowSet = new Set(wrongPosArr.join('').split('').filter(c => /[A-Z]/.test(c)));
    const mustSet = new Set(Object.keys(mustIncludeCounts));

    excludesAll.forEach(char => {
        if (greenSet.has(char)) {
            conflicts.push(`Letter '${char}' is marked as Excluded, but also placed in Correct Position.`);
        } else if (yellowSet.has(char)) {
            conflicts.push(`Letter '${char}' is marked as Excluded, but also placed in Wrong Position.`);
        } else if (mustSet.has(char)) {
            conflicts.push(`Letter '${char}' is marked as Excluded, but also set in Must Include.`);
        }
    });
    return conflicts;
}

function updateResults() {
    console.log("updateResults triggered");
    if (typeof activeList !== 'undefined') {
        console.log("activeList length:", activeList.length);
    }
    const pattern = charInputs.map(input => input.value.toUpperCase().trim() || '_').join('');
    const wrongPosArr = wrongPosInputs.map(input => input.value.toUpperCase().trim());
    const repeatSensitive = repeatSensitiveInput ? repeatSensitiveInput.checked : true;

    const mustIncludeCounts = mustIncludeInput ? parseMustInclude(mustIncludeInput.value) : {};

    const excludesRaw = excludesInput.value.toUpperCase().trim();
    const excludesAll = [...new Set(excludesRaw.split('').filter(c => /[A-Z]/.test(c)))];
    
    // Conflict Detection (Option B Implementation)
    const conflicts = detectFilterConflicts(pattern, wrongPosArr, excludesAll, mustIncludeCounts);
    const warningBanner = document.getElementById('conflictWarning');
    const warningText = document.getElementById('conflictWarningText');
    if (warningBanner && warningText) {
        if (conflicts.length > 0) {
            warningText.textContent = conflicts.join(' ');
            warningBanner.style.display = 'flex';
        } else {
            warningBanner.style.display = 'none';
        }
    }

    const greens = greenCountsFromPattern(pattern);
    const effectiveExcludes = getEffectiveExcludes(excludesAll, pattern, wrongPosArr, mustIncludeCounts);

    const sourcePool = activeList;

    const yellowUnique = [...new Set(wrongPosArr.join('').split('').filter(c => /[A-Z]/.test(c)))];

    let minimums;
    if (repeatSensitive) {
        const yellows = yellowMultiset(wrongPosArr);
        minimums = mergeCounts(mergeCounts(greens, yellows), mustIncludeCounts);
    } else {
        minimums = mergeCounts({ ...greens }, mustIncludeCounts);
        for (const c of yellowUnique) {
            minimums[c] = Math.max(minimums[c] || 0, (greens[c] || 0) + 1);
        }
    }

    currentResults = sourcePool.filter(word => {
        const upperWord = word.toUpperCase();
        if (upperWord.length !== WORD_LENGTH) return false;

        for (let i = 0; i < WORD_LENGTH; i++) {
            const pChar = pattern[i];
            if (pChar !== '_' && pChar !== '?' && pChar !== upperWord[i]) return false;
        }

        for (let i = 0; i < WORD_LENGTH; i++) {
            const chars = wrongPosArr[i];
            if (chars) {
                for (const c of chars) {
                    if (/[A-Z]/.test(c) && upperWord[i] === c) return false;
                }
            }
        }

        if (!meetsMinimumCounts(upperWord, minimums)) return false;

        for (const char of effectiveExcludes) {
            if (upperWord.includes(char)) return false;
        }

        return true;
    });

    sortResults();
    updateTracker(yellowUnique, effectiveExcludes);
    renderResults(pattern);
}

function sortResults() {
    const mode = sortSelect ? sortSelect.value : 'alpha-asc';
    const arr = [...currentResults];
    if (mode === 'alpha-asc') {
        arr.sort((a, b) => a.localeCompare(b));
    } else if (mode === 'alpha-desc') {
        arr.sort((a, b) => b.localeCompare(a));
    } else if (mode === 'score-desc') {
        arr.sort((a, b) => scrabbleScore(b) - scrabbleScore(a) || a.localeCompare(b));
    } else if (mode === 'score-asc') {
        arr.sort((a, b) => scrabbleScore(a) - scrabbleScore(b) || a.localeCompare(b));
    }
    currentResults = arr;
}

function updateTracker(includes, excludes) {
    trackerState = {};
    includes.forEach(c => { trackerState[c] = 'included'; });
    excludes.forEach(c => { trackerState[c] = 'excluded'; });
    renderTracker();
}

let lastRenderedHash = '';

function renderResults(pattern = '') {
    const showScores = showScrabbleInput ? showScrabbleInput.checked : false;
    
    // Performance optimization: Generate a signature of the current state to avoid redundant DOM work
    const renderHash = `${currentResults.length}-${activeList ? activeList.length : 0}-${pattern}-${showScores}-${currentDict}-${hasAnyFilter()}`;
    if (renderHash === lastRenderedHash) return;

    if (!hasAnyFilter()) {
        // Initial Empty State: Interactive Starter Word Suggestions
        const starterWords = ['CRANE', 'AUDIO', 'SLATE', 'ADIEU', 'RAISE'];
        const chipsHtml = starterWords.map(w => `<button type="button" class="starter-chip" data-starter="${w}">${w}</button>`).join('');
        
        resultsList.innerHTML = `
            <div class="empty-state starter-empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4l3 3"></path>
                </svg>
                <p class="empty-title">Ready to find words!</p>
                <p class="empty-sub">Type your known green or yellow letters above, or click a popular starter word to test:</p>
                <div class="starter-chips">${chipsHtml}</div>
            </div>
        `;
        copyBtn.disabled = true;
    } else if (currentResults.length === 0) {
        // Valid Search with Zero Results
        resultsList.innerHTML = `
            <div class="empty-state zero-results-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <p class="empty-title">No 5-letter words match these filters</p>
                <p class="empty-sub">Try clearing excluded letters or switching from Wordle to Full dictionary in the sidebar.</p>
                <button type="button" class="btn btn-secondary btn-sm" id="emptyResetBtn" style="margin-top: 0.75rem;">Clear All Filters</button>
            </div>
        `;
        copyBtn.disabled = true;
        document.getElementById('emptyResetBtn')?.addEventListener('click', resetFilters);
    } else {
        const limit = currentDict === 'common' ? 200 : 1000;
        const displayResults = currentResults.slice(0, limit);
        const wordGrid = displayResults.map(word => {
            const upperWord = word.toUpperCase();
            let highlightedWord = '';
            for (let i = 0; i < WORD_LENGTH; i++) {
                const isMatch = pattern && pattern[i] && pattern[i] !== '_' && pattern[i].toUpperCase() === upperWord[i];
                if (isMatch) {
                    highlightedWord += `<span class="char-match">${upperWord[i]}</span>`;
                } else {
                    highlightedWord += upperWord[i];
                }
            }
            const score = scrabbleScore(word);
            const scoreHtml = showScores ? `<span class="word-score" title="Scrabble face value">${score}</span>` : '';
            return `<div class="word-item" data-word="${upperWord}" title="Click to copy">${highlightedWord}${scoreHtml}</div>`;
        }).join('');

        resultsList.innerHTML = wordGrid;
        copyBtn.disabled = false;
    }

    if (!hasAnyFilter()) {
        resultsCount.textContent = `${activeList ? activeList.length.toLocaleString() : '2,656'} words available`;
    } else if (currentResults.length === 0) {
        resultsCount.textContent = `0 matching words`;
    } else {
        const limit = currentDict === 'common' ? 200 : 1000;
        const countText = `${currentResults.length.toLocaleString()} matching word${currentResults.length !== 1 ? 's' : ''}`;
        resultsCount.textContent = currentResults.length > limit ? `${countText} (showing first ${limit})` : countText;
    }
    
    lastRenderedHash = renderHash;
}

function renderTracker() {
    if (!letterTracker) return;
    letterTracker.innerHTML = alphabet.map(char => {
        const state = trackerState[char] || '';
        return `<div class="tracker-letter ${state}">${char}</div>`;
    }).join('');
}

function hasAnyFilter() {
    return charInputs.some(input => input.value.trim()) ||
           wrongPosInputs.some(input => input.value.trim()) ||
           (mustIncludeInput && mustIncludeInput.value.trim()) ||
           excludesInput.value.trim();
}

function resetFilters() {
    charInputs.forEach(input => { input.value = ''; });
    wrongPosInputs.forEach(input => { input.value = ''; });
    excludesInput.value = '';
    if (mustIncludeInput) mustIncludeInput.value = '';
    if (repeatSensitiveInput) repeatSensitiveInput.checked = true;
    updateResults();
    charInputs[0].focus();
}

function copyResults() {
    if (currentResults.length === 0) return;
    const text = currentResults.join(', ');
    copyToClipboard(text, 'Copied all results!');
}

function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg);
        }).catch(() => fallbackCopy(text, successMsg));
    } else {
        fallbackCopy(text, successMsg);
    }
}

function fallbackCopy(text, successMsg) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast(successMsg);
    } catch (err) {
        showToast('Copy failed');
    }
    document.body.removeChild(textarea);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function toggleTheme(e) {
    const isDark = e.target.checked;
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(isDark ? 'theme-dark' : 'theme-light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    darkModeToggle.checked = isDark;
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(isDark ? 'theme-dark' : 'theme-light');
    darkModeToggle.checked = isDark;
}

function toggleNav(open) {
    navPanel.classList.toggle('active', open);
    navOverlay.classList.toggle('active', open);
}

function wireCharInputs() {
    const last = charInputs.length - 1;
    charInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
            e.target.value = val;

            if (val && index < last) {
                charInputs[index + 1].focus();
            }
            updateResults();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                charInputs[index - 1].focus();
            }
        });
    });
}

function wireWrongInputs() {
    const last = wrongPosInputs.length - 1;
    wrongPosInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
            e.target.value = val;

            if (val.length === 1 && index < last) {
                wrongPosInputs[index + 1].focus();
            }
            updateResults();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                wrongPosInputs[index - 1].focus();
            }
        });
    });
}

[excludesInput, mustIncludeInput].forEach(el => {
    if (el) {
        el.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
            updateResults();
        });
    }
});

if (repeatSensitiveInput) {
    repeatSensitiveInput.addEventListener('change', () => updateResults());
}

function toggleModal(show) {
    if (show) {
        // Hydrate content if needed
        const contentEl = document.getElementById('helpModalContent');
        const template = document.getElementById('help-modal-template');
        if (contentEl && template && contentEl.querySelector('.loading-spinner-container')) {
            contentEl.innerHTML = '';
            contentEl.appendChild(template.content.cloneNode(true));
            
            // Re-wire events for the newly injected content
            const newCloseBtn = contentEl.querySelector('#closeModalBtn');
            if (newCloseBtn) newCloseBtn.addEventListener('click', () => toggleModal(false));
        }

        helpModal.classList.add('show');
        helpModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    } else {
        helpModal.classList.remove('show');
        helpModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}


if (helpBtn) helpBtn.addEventListener('click', () => toggleModal(true));
// Initial wire-up for existing close button (if any) or overlay
if (closeModalBtn) closeModalBtn.addEventListener('click', () => toggleModal(false));
if (modalOverlay) modalOverlay.addEventListener('click', () => toggleModal(false));


window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && helpModal.classList.contains('show')) {
        toggleModal(false);
    }
});

if (resetBtn) resetBtn.addEventListener('click', resetFilters);
if (findBtn) {
    findBtn.addEventListener('click', () => {
        updateResults();
        resultsList?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}
if (copyBtn) copyBtn.addEventListener('click', copyResults);
if (darkModeToggle) darkModeToggle.addEventListener('change', toggleTheme);

if (closeNavBtn) closeNavBtn.addEventListener('click', () => toggleNav(false));
if (navOverlay) navOverlay.addEventListener('click', () => toggleNav(false));

if (dictToggle && IS_WORDLE_LENGTH) {
    dictToggle.addEventListener('click', (e) => {
        const item = e.target.closest('.toggle-item');
        if (!item) return;

        document.querySelectorAll('#dictToggle .toggle-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        
        // Terminology: 'strict' maps to commonList, 'broad' to fullList
        const mode = item.dataset.dict;
        currentDict = (mode === 'strict') ? 'common' : 'extended';
        
        if (currentDict === "common") {
            activeList = commonList.length ? commonList : fullList.filter(w => w.length === WORD_LENGTH);
        } else {
            activeList = fullList.filter(w => w.length === WORD_LENGTH);
        }
        
        console.log(`Dictionary switched to: ${currentDict} (${activeList.length} words)`);
        updateResults();
        initStats();
    });
}

if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        sortResults();
        const pattern = charInputs.map(input => input.value.toUpperCase().trim() || '_').join('');
        renderResults(pattern);
    });
}

if (showScrabbleInput) {
    showScrabbleInput.addEventListener('change', () => {
        const pattern = charInputs.map(input => input.value.toUpperCase().trim() || '_').join('');
        renderResults(pattern);
    });
}

if (resultsList) {
    resultsList.addEventListener('click', (e) => {
        const starterChip = e.target.closest('.starter-chip');
        if (starterChip) {
            const word = starterChip.getAttribute('data-starter');
            if (word && word.length === 5) {
                resetFilters();
                for (let i = 0; i < 5; i++) {
                    if (charInputs[i]) charInputs[i].value = word[i];
                }
                updateResults();
                return;
            }
        }
        const wordItem = e.target.closest('.word-item');
        if (wordItem) {
            const text = wordItem.getAttribute('data-word') || wordItem.textContent.replace(/\d+/g, '').trim();
            wordItem.classList.add('copied-flash');
            setTimeout(() => wordItem.classList.remove('copied-flash'), 200);
            copyToClipboard(text, `Copied "${text}"!`);
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === '/' && !charInputs.some(input => document.activeElement === input)) {
        e.preventDefault();
        charInputs[0].focus();
    }
});

function initStats() {
    if (!statWordCount) return;
    let n = 0;
    if (activeList) {
        n = activeList.length;
    }
    const formatted = n ? n.toLocaleString() : '-';
    
    // Visual Stability: Only update if different to avoid layout thrashing/jitter
    if (statWordCount.textContent !== formatted) {
        statWordCount.textContent = formatted;
    }
}

function initLengthUi() {
    if (!IS_WORDLE_LENGTH) {
        if (dictCard) dictCard.hidden = true;
        if (playWordleCard) playWordleCard.hidden = true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Phase 1.5: Immediate Synchronous Render for Stability
    initStats();
    updateResults();
    
    // Theme is now partially handled by CSS/HTML, but we ensure state parity
    if (darkModeToggle) {
        darkModeToggle.checked = document.documentElement.classList.contains('theme-dark');
    }
    
    initLengthUi();
    
    // Startup Flow: 
    // 1. Async background load for wordle-common (if needed)
    loadCommonDataset();

    wireCharInputs();
    wireWrongInputs();
    if (charInputs[0]) charInputs[0].focus();

    // Smooth scroll for "Try Tool" button
    document.querySelectorAll('a[href="#tool-section"], a[href="/#tool-section"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const toolSection = document.querySelector('#tool-section');
            if (toolSection) {
                e.preventDefault();
                toolSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Responsive Header Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");

    if (menuToggle) {
        menuToggle.addEventListener("click", function (e) {
            e.preventDefault();
            toggleNav(true);
        });
    }

    // --- LAZY HYDRATION SYSTEM ---
    const LazyHydrator = {
        hydrate(placeholderId, templateId, delay = 0) {
            const placeholder = document.getElementById(placeholderId);
            const template = document.getElementById(templateId);
            if (!placeholder || !template) return;

            const action = () => {
                placeholder.classList.remove('is-loading');
                placeholder.innerHTML = '';
                placeholder.appendChild(template.content.cloneNode(true));
                placeholder.classList.add('is-hydrated');
                
                // If it's the SEO placeholder, it might have links that need smooth scroll
                if (placeholderId === 'seo-placeholder') {
                    this.wireSmoothScroll(placeholder);
                }
            };

            if (delay > 0) {
                setTimeout(action, delay);
            } else if ('requestIdleCallback' in window) {
                requestIdleCallback(action);
            } else {
                setTimeout(action, 200);
            }
        },

        wireSmoothScroll(container) {
            container.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href').slice(1);
                    const target = document.getElementById(targetId);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        },

        hydrateFooterIcons() {
            const container = document.getElementById('social-icons-footer');
            if (!container) return;

            const icons = [
                { label: 'Facebook', path: 'M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54V12h2.54V9.79c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.95h-2.33v7C18.34 21.19 22 17.04 22 12.06c0-5.53-4.5-10.02-10-10.02z' },
                { label: 'Twitter', path: 'M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' },
                { label: 'LinkedIn', path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.18-3.46c-1.34 0-1.94.75-2.28 1.25V9.43h-2.58v9.07h2.58v-4.57c0-1.21.23-2.39 1.74-2.39 1.49 0 1.5 1.39 1.5 2.47v4.56h2.22zM6.6 8.35c.83 0 1.5-.68 1.5-1.5 0-.83-.67-1.5-1.5-1.5S5.1 6.02 5.1 6.85c0 .82.67 1.5 1.5 1.5zM5.3 18.5h2.58V9.43H5.3v9.07z' }
            ];

            container.innerHTML = icons.map(icon => `
                <span class="icon" aria-label="${icon.label}">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="${icon.path}"></path>
                    </svg>
                </span>
            `).join('');
        }
    };

    // Hydrate non-critical components progressively
    window.addEventListener('load', () => {
        LazyHydrator.hydrateFooterIcons();
    });

    // Page-specific Enhancement: Auto-prefill for SEO Landing Pages
    const path = window.location.pathname;

    
    // Pattern: starting-with-X.html
    const startingMatch = path.match(/starting-with-([a-z])\.html/i);
    if (startingMatch) {
        const letter = startingMatch[1].toUpperCase();
        const inputs = document.querySelectorAll('.char-input');
        if (inputs.length > 0) {
            const firstInput = inputs[0];
            if (!firstInput.value) {
                firstInput.value = letter;
                firstInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // Focus the first empty input to guide the user
            const emptyInput = Array.from(inputs).find(input => !input.value);
            if (emptyInput) {
                setTimeout(() => emptyInput.focus(), 50);
            }
        }
    }

    // Pattern: ending-with-X.html
    const endingMatch = path.match(/ending-with-([a-z])\.html/i);
    if (endingMatch) {
        const letter = endingMatch[1].toUpperCase();
        const inputs = document.querySelectorAll('.char-input');
        if (inputs.length > 0) {
            const lastInput = inputs[inputs.length - 1];
            if (!lastInput.value) {
                lastInput.value = letter;
                lastInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // Always ensure the first box is focused for "ending with" pages
            if (inputs[0]) setTimeout(() => inputs[0].focus(), 50);
        }
    }
});

