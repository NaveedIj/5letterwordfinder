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

const dictToggle = document.getElementById('dictToggle');
const dictCard = document.getElementById('dictCard');
const playWordleCard = document.querySelector('.play-wordle-card');
const letterTracker = document.getElementById('letterTracker');

const menuBtn = document.getElementById('menuBtn');
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

let currentDict = IS_WORDLE_LENGTH ? 'strict' : 'broad';
let currentResults = [];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let trackerState = {};

function getSourcePool() {
    if (IS_WORDLE_LENGTH && typeof WORDS !== 'undefined') {
        return currentDict === 'strict' ? WORDS.slice(0, 2315) : WORDS;
    }
    const lists = typeof WORD_LISTS_BY_LENGTH !== 'undefined' ? WORD_LISTS_BY_LENGTH : (typeof window !== 'undefined' && window.WORD_LISTS_BY_LENGTH);
    const extra = lists ? lists[WORD_LENGTH] : null;
    return Array.isArray(extra) ? extra : [];
}

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

function filterWords() {
    const pattern = charInputs.map(input => input.value.toUpperCase().trim() || '_').join('');
    const wrongPosArr = wrongPosInputs.map(input => input.value.toUpperCase().trim());
    const repeatSensitive = repeatSensitiveInput ? repeatSensitiveInput.checked : true;

    const mustIncludeCounts = mustIncludeInput ? parseMustInclude(mustIncludeInput.value) : {};

    const excludesRaw = excludesInput.value.toUpperCase().trim();
    const excludesAll = [...new Set(excludesRaw.split('').filter(c => /[A-Z]/.test(c)))];
    const greens = greenCountsFromPattern(pattern);
    const effectiveExcludes = getEffectiveExcludes(excludesAll, pattern, wrongPosArr, mustIncludeCounts);

    const sourcePool = getSourcePool();

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

function renderResults(pattern = '') {
    const showScores = showScrabbleInput ? showScrabbleInput.checked : false;

    if (!hasAnyFilter() || currentResults.length === 0) {
        resultsList.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>${hasAnyFilter() ? 'No matching words. Loosen a filter or toggle repeat-aware.' : 'Type letters above — results update as you go.'}</p>
            </div>
        `;
        copyBtn.disabled = true;
    } else {
        const wordGrid = currentResults.map(word => {
            const upperWord = word.toUpperCase();
            let highlightedWord = '';
            for (let i = 0; i < WORD_LENGTH; i++) {
                const isMatch = pattern && pattern[i] && pattern[i] !== '_' && pattern[i] !== '?' && pattern[i].toUpperCase() === upperWord[i];
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

    resultsCount.textContent = `${currentResults.length.toLocaleString()} word${currentResults.length !== 1 ? 's' : ''}`;
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
    filterWords();
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
            filterWords();
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
            filterWords();
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
            filterWords();
        });
    }
});

if (repeatSensitiveInput) {
    repeatSensitiveInput.addEventListener('change', () => filterWords());
}

function toggleModal(show) {
    if (show) {
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
        filterWords();
        resultsList?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}
if (copyBtn) copyBtn.addEventListener('click', copyResults);
if (darkModeToggle) darkModeToggle.addEventListener('change', toggleTheme);

if (menuBtn) menuBtn.addEventListener('click', () => toggleNav(true));
if (closeNavBtn) closeNavBtn.addEventListener('click', () => toggleNav(false));
if (navOverlay) navOverlay.addEventListener('click', () => toggleNav(false));

if (dictToggle && IS_WORDLE_LENGTH) {
    dictToggle.addEventListener('click', (e) => {
        const item = e.target.closest('.toggle-item');
        if (!item) return;

        document.querySelectorAll('#dictToggle .toggle-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        currentDict = item.dataset.dict;
        filterWords();
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
        const wordItem = e.target.closest('.word-item');
        if (wordItem) {
            const text = wordItem.getAttribute('data-word') || wordItem.textContent.replace(/\d+/g, '').trim();
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
    if (IS_WORDLE_LENGTH && typeof WORDS !== 'undefined') {
        n = WORDS.length;
    } else {
        const lists = typeof WORD_LISTS_BY_LENGTH !== 'undefined' ? WORD_LISTS_BY_LENGTH : (typeof window !== 'undefined' && window.WORD_LISTS_BY_LENGTH);
        if (lists && lists[WORD_LENGTH]) n = lists[WORD_LENGTH].length;
    }
    statWordCount.textContent = n ? n.toLocaleString() : '—';
}

function initLengthUi() {
    if (!IS_WORDLE_LENGTH) {
        if (dictCard) dictCard.hidden = true;
        if (playWordleCard) playWordleCard.hidden = true;
    }
}

loadTheme();
initLengthUi();
initStats();
wireCharInputs();
wireWrongInputs();
filterWords();
if (charInputs[0]) charInputs[0].focus();

// Smooth scroll for "Try Tool" button
document.querySelectorAll('a[href="#tool-section"], a[href="/#tool-section"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const toolSection = document.querySelector('#tool-section');
        if (toolSection) {
            e.preventDefault();
            toolSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
