/**
 * Spanish 5-Letter Word Finder Engine (es-ES)
 * Project: 5letterwordfindertool.com
 * Handles Spanish orthography: strictly preserves Ñ (U+00D1),
 * normalizes acute accents (Á, É, Í, Ó, Ú) and diaeresis (Ü) for matching,
 * and maintains original display orthography.
 */

(function () {
    'use strict';

    const WORD_LENGTH = 5;

    // DOM Elements
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
    const statLiveResults = document.getElementById('statLiveResults');
    const statModeLabel = document.getElementById('statModeLabel');
    const sortSelect = document.getElementById('sortSelect');
    const dictToggle = document.getElementById('dictToggle');
    const conflictWarning = document.getElementById('conflictWarning');
    const conflictWarningText = document.getElementById('conflictWarningText');

    // Navigation and Modals
    const navPanel = document.getElementById('navPanel');
    const navOverlay = document.getElementById('navOverlay');
    const closeNavBtn = document.getElementById('closeNavBtn');
    const menuToggle = document.querySelector('.menu-toggle');
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');

    // State
    let commonList = [];
    let broadList = [];
    let currentDict = 'common'; // 'common' | 'broad'
    let activeEntries = [];     // Array of { raw: string, key: string }
    let currentResults = [];    // Filtered array of { raw: string, key: string }
    let lastRenderedHash = '';

    /**
     * Normalizes a single Spanish character for matching:
     * Folds acute vowels and diaeresis, but strictly preserves Ñ.
     */
    function normalizeChar(c) {
        if (!c) return '';
        const ch = c.toUpperCase();
        if (ch === 'Á' || ch === 'À' || ch === 'Ä') return 'A';
        if (ch === 'É' || ch === 'È' || ch === 'Ë') return 'E';
        if (ch === 'Í' || ch === 'Ì' || ch === 'Ï') return 'I';
        if (ch === 'Ó' || ch === 'Ò' || ch === 'Ö') return 'O';
        if (ch === 'Ú' || ch === 'Ù' || ch === 'Ü') return 'U';
        if (ch === 'Ñ') return 'Ñ';
        return ch;
    }

    /**
     * Normalizes an entire 5-letter Spanish string to canonical matching key [A-ZÑ]{5}.
     */
    function normalizeWordKey(word) {
        if (!word) return '';
        const chars = Array.from(word);
        let key = '';
        for (let i = 0; i < chars.length; i++) {
            key += normalizeChar(chars[i]);
        }
        return key;
    }

    /**
     * Converts a raw word list into normalized entry objects with deterministic collision grouping:
     * - Maps each 5-letter word to its canonical uppercase key [A-ZÑ]{5}.
     * - Groups multiple display spellings sharing the same key (e.g. canto vs cantó).
     * - Sorts display variants deterministically using Spanish collation.
     */
    function processWordList(rawWords) {
        const keyMap = new Map();
        for (let i = 0; i < rawWords.length; i++) {
            const raw = rawWords[i].trim();
            if (Array.from(raw).length === WORD_LENGTH) {
                const key = normalizeWordKey(raw);
                if (/^[A-ZÑ]{5}$/.test(key)) {
                    if (!keyMap.has(key)) {
                        keyMap.set(key, { key: key, displays: [] });
                    }
                    const entry = keyMap.get(key);
                    if (!entry.displays.includes(raw)) {
                        entry.displays.push(raw);
                    }
                }
            }
        }

        const entries = [];
        for (const item of keyMap.values()) {
            item.displays.sort((a, b) => a.localeCompare(b, 'es'));
            entries.push(item);
        }
        return entries;
    }

    /**
     * Loads the Spanish datasets asynchronously.
     */
    async function loadSpanishDatasets() {
        try {
            const [resCommon, resBroad] = await Promise.all([
                fetch('/data/es/wordle-common.json'),
                fetch('/data/es/dictionary.json')
            ]);

            if (resCommon.ok) {
                const rawCommon = await resCommon.json();
                commonList = processWordList(rawCommon);
            }
            if (resBroad.ok) {
                const rawBroad = await resBroad.json();
                broadList = processWordList(rawBroad);
            }
        } catch (err) {
            console.warn('[Buscador de Palabras] Error cargando listas de palabras:', err);
        }

        // Set active dictionary
        activeEntries = currentDict === 'common' ? commonList : broadList;
        updateResults();
        initStats();
    }

    function initStats() {
        if (statWordCount) statWordCount.textContent = activeEntries.length.toLocaleString('es-ES');
        if (statLiveResults) statLiveResults.textContent = currentResults.length.toLocaleString('es-ES');
        if (statModeLabel) {
            statModeLabel.textContent = currentDict === 'common' ? 'MODO WORDLE' : 'DICCIONARIO COMPLETO';
        }
    }

    function hasAnyFilter() {
        const hasPos = charInputs.some(inp => inp.value.trim() !== '');
        const hasWrong = wrongPosInputs.some(inp => inp.value.trim() !== '');
        const hasExcl = excludesInput && excludesInput.value.trim() !== '';
        const hasMust = mustIncludeInput && mustIncludeInput.value.trim() !== '';
        return hasPos || hasWrong || hasExcl || hasMust;
    }

    /**
     * Builds frequency counts of required letters.
     */
    function countLetterFrequency(str) {
        const counts = {};
        for (const char of str) {
            counts[char] = (counts[char] || 0) + 1;
        }
        return counts;
    }

    function meetsMinimumCounts(wordKey, minimums) {
        const wordCounts = countLetterFrequency(wordKey);
        for (const char in minimums) {
            if ((wordCounts[char] || 0) < minimums[char]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Main filtering routine
     */
    function updateResults() {
        // 1. Position letters (Green)
        const posChars = charInputs.map(inp => normalizeChar(inp.value.trim()));
        const pattern = posChars.map(c => c || '_').join('');

        // 2. Misplaced letters (Yellow)
        const wrongPosArr = wrongPosInputs.map(inp => {
            const raw = inp.value.trim();
            const chars = [];
            for (let i = 0; i < raw.length; i++) {
                const norm = normalizeChar(raw[i]);
                if (norm && /^[A-ZÑ]$/.test(norm)) chars.push(norm);
            }
            return chars;
        });

        // 3. Excluded letters (Gray)
        const rawExcludes = excludesInput ? excludesInput.value.trim() : '';
        const excludeChars = [];
        for (let i = 0; i < rawExcludes.length; i++) {
            const norm = normalizeChar(rawExcludes[i]);
            if (norm && /^[A-ZÑ]$/.test(norm) && !excludeChars.includes(norm)) {
                excludeChars.push(norm);
            }
        }

        // 4. Must include (Teal)
        const rawMust = mustIncludeInput ? mustIncludeInput.value.trim() : '';
        const mustChars = [];
        for (let i = 0; i < rawMust.length; i++) {
            const norm = normalizeChar(rawMust[i]);
            if (norm && /^[A-ZÑ]$/.test(norm)) mustChars.push(norm);
        }
        const mustIncludeCounts = countLetterFrequency(mustChars.join(''));

        // Compute minimums (Repeat-aware)
        const isRepeatAware = repeatSensitiveInput ? repeatSensitiveInput.checked : true;
        const yellowFlattened = wrongPosArr.flat();
        const yellowCounts = countLetterFrequency(yellowFlattened.join(''));
        const greenCounts = countLetterFrequency(posChars.filter(c => c).join(''));

        const minimums = {};
        const allTargetLetters = new Set([...Object.keys(mustIncludeCounts), ...Object.keys(yellowCounts), ...Object.keys(greenCounts)]);

        allTargetLetters.forEach(ch => {
            const fromMust = mustIncludeCounts[ch] || 0;
            const fromGreen = greenCounts[ch] || 0;
            const fromYellow = isRepeatAware ? (yellowCounts[ch] || 0) : (yellowCounts[ch] ? 1 : 0);
            minimums[ch] = Math.max(fromMust, fromGreen + fromYellow);
        });

        // Effective Excludes: letters marked gray that aren't green/yellow/must
        const confirmedChars = new Set([...Object.keys(minimums)]);
        const effectiveExcludes = excludeChars.filter(c => !confirmedChars.has(c));

        // Filter active entries
        currentResults = activeEntries.filter(entry => {
            const key = entry.key;

            // Green check: exact slot matching
            for (let i = 0; i < WORD_LENGTH; i++) {
                const p = posChars[i];
                if (p && key[i] !== p) return false;
            }

            // Yellow check: letter cannot be in this slot
            for (let i = 0; i < WORD_LENGTH; i++) {
                const wrongs = wrongPosArr[i];
                for (let j = 0; j < wrongs.length; j++) {
                    if (key[i] === wrongs[j]) return false;
                }
            }

            // Minimum count check
            if (!meetsMinimumCounts(key, minimums)) return false;

            // Excluded letters check
            for (let i = 0; i < effectiveExcludes.length; i++) {
                if (key.includes(effectiveExcludes[i])) return false;
            }

            return true;
        });

        sortResults();
        renderResults(pattern);
    }

    function getActiveSortMode() {
        if (sortSelect && sortSelect.value) {
            return sortSelect.value;
        }
        const activePill = document.querySelector('.sort-pill.active');
        if (activePill && activePill.dataset.sort) {
            return activePill.dataset.sort;
        }
        return 'alpha-asc';
    }

    function sortResults() {
        const mode = getActiveSortMode();
        const arr = [...currentResults];
        if (mode === 'alpha-asc') {
            arr.sort((a, b) => a.key.localeCompare(b.key, 'es'));
        } else if (mode === 'alpha-desc') {
            arr.sort((a, b) => b.key.localeCompare(a.key, 'es'));
        }
        currentResults = arr;
    }

    function renderResults(pattern) {
        const sortMode = getActiveSortMode();
        const filterState = hasAnyFilter();
        const renderHash = `${currentResults.length}-${activeEntries.length}-${pattern}-${currentDict}-${filterState}-${sortMode}`;
        if (renderHash === lastRenderedHash) return;
        lastRenderedHash = renderHash;

        // Update counts
        const countText = `${currentResults.length.toLocaleString('es-ES')} palabra${currentResults.length === 1 ? '' : 's'}`;
        if (resultsCount) resultsCount.textContent = countText;
        if (statLiveResults) statLiveResults.textContent = currentResults.length.toLocaleString('es-ES');

        if (!filterState) {
            // Initial Empty State: Spanish Starter Words
            const starterWords = ['PLAYA', 'CANTO', 'NORTE', 'BARCO', 'CIELO', 'VERDE'];
            const chipsHtml = starterWords.map(w => `<button type="button" class="starter-chip" data-starter="${w}">${w}</button>`).join('');

            resultsList.innerHTML = `
                <div class="empty-state starter-empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 8v4l3 3"></path>
                    </svg>
                    <p class="empty-title">¡Listo para buscar palabras!</p>
                    <p class="empty-sub">Introduce tus letras verdes o amarillas arriba, o pulsa una palabra inicial recomendada:</p>
                    <div class="starter-chips">${chipsHtml}</div>
                </div>
            `;
            if (copyBtn) copyBtn.disabled = true;
        } else if (currentResults.length === 0) {
            // Zero Matches State
            resultsList.innerHTML = `
                <div class="empty-state zero-results-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <p class="empty-title">Ninguna palabra de 5 letras coincide</p>
                    <p class="empty-sub">Prueba a borrar letras excluidas o cambiar al Diccionario completo.</p>
                    <button type="button" class="btn btn-secondary btn-sm" id="emptyResetBtn" style="margin-top: 0.75rem;">Limpiar todos los filtros</button>
                </div>
            `;
            if (copyBtn) copyBtn.disabled = true;
            const emptyResetBtn = document.getElementById('emptyResetBtn');
            if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetFilters);
        } else {
            // Render Results Cards
            const limit = currentDict === 'common' ? 300 : 1000;
            const displayResults = currentResults.slice(0, limit);

            const cardsHtml = displayResults.map(entry => {
                const upperWord = entry.key;
                const displays = entry.displays; // Array of distinct display forms (e.g. ['canto', 'cantó'])
                let highlightedHtml = '';

                for (let i = 0; i < WORD_LENGTH; i++) {
                    const ch = upperWord[i];
                    const isGreen = pattern && pattern[i] && pattern[i] !== '_' && pattern[i] === ch;
                    if (isGreen) {
                        highlightedHtml += `<span class="letter-tile letter-tile-correct">${ch}</span>`;
                    } else {
                        highlightedHtml += `<span class="letter-tile">${ch}</span>`;
                    }
                }

                // Deterministic collision handling: if multiple forms exist, show both clearly
                const displayLabel = displays.join(' / ');
                const subtitleHtml = `<span class="word-card-ortho" title="Ortografía">${displayLabel}</span>`;

                return `
                    <div class="word-card" data-word="${upperWord}">
                        <div class="word-tiles">${highlightedHtml}</div>
                        ${subtitleHtml}
                    </div>
                `;
            }).join('');

            resultsList.innerHTML = `<div class="results-grid">${cardsHtml}</div>`;
            if (copyBtn) copyBtn.disabled = false;
        }
    }

    function resetFilters() {
        charInputs.forEach(inp => { inp.value = ''; });
        wrongPosInputs.forEach(inp => { inp.value = ''; });
        if (excludesInput) excludesInput.value = '';
        if (mustIncludeInput) mustIncludeInput.value = '';
        lastRenderedHash = '';
        updateResults();
        if (charInputs[0]) charInputs[0].focus();
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    // Event Listeners: Green inputs (auto-advance & backspace navigation)
    charInputs.forEach((input, index) => {
        input.addEventListener('input', e => {
            const val = e.target.value;
            if (val) {
                e.target.value = normalizeChar(val);
                if (index < WORD_LENGTH - 1) {
                    charInputs[index + 1].focus();
                }
            }
            updateResults();
        });

        input.addEventListener('keydown', e => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                charInputs[index - 1].focus();
            }
        });
    });

    // Yellow inputs
    wrongPosInputs.forEach((input, index) => {
        input.addEventListener('input', e => {
            const raw = e.target.value;
            const cleaned = Array.from(raw).map(normalizeChar).filter(c => /^[A-ZÑ]$/.test(c)).join('');
            e.target.value = cleaned;
            updateResults();
        });
    });

    // Excludes & Must Include
    if (excludesInput) {
        excludesInput.addEventListener('input', e => {
            const raw = e.target.value;
            const cleaned = Array.from(raw).map(normalizeChar).filter(c => /^[A-ZÑ]$/.test(c)).join('');
            e.target.value = cleaned;
            updateResults();
        });
    }

    if (mustIncludeInput) {
        mustIncludeInput.addEventListener('input', e => {
            const raw = e.target.value;
            const cleaned = Array.from(raw).map(normalizeChar).filter(c => /^[A-ZÑ]$/.test(c)).join('');
            e.target.value = cleaned;
            updateResults();
        });
    }

    if (repeatSensitiveInput) {
        repeatSensitiveInput.addEventListener('change', updateResults);
    }

    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    if (findBtn) {
        findBtn.addEventListener('click', () => {
            updateResults();
            resultsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Starter Chips Delegation
    if (resultsList) {
        resultsList.addEventListener('click', e => {
            const chip = e.target.closest('.starter-chip');
            if (chip && chip.dataset.starter) {
                const word = chip.dataset.starter;
                for (let i = 0; i < WORD_LENGTH; i++) {
                    if (charInputs[i]) charInputs[i].value = word[i] || '';
                }
                updateResults();
            }
        });
    }

    // Sort Pills
    const sortPills = document.querySelectorAll('.sort-pill');
    sortPills.forEach(pill => {
        pill.addEventListener('click', () => {
            sortPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            if (sortSelect) sortSelect.value = pill.dataset.sort;
            lastRenderedHash = '';
            sortResults();
            renderResults();
        });
    });

    // Dictionary Mode Toggle
    if (dictToggle) {
        dictToggle.addEventListener('click', e => {
            const btn = e.target.closest('.toggle-item');
            if (!btn) return;
            dictToggle.querySelectorAll('.toggle-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentDict = btn.dataset.dict === 'broad' ? 'broad' : 'common';
            activeEntries = currentDict === 'common' ? commonList : broadList;
            lastRenderedHash = '';
            initStats();
            updateResults();
        });
    }

    // Copy Results with secure API check and fallback for local HTTP / non-secure contexts
    function copyTextToClipboard(text, count) {
        const successMsg = `¡${count} palabra${count === 1 ? '' : 's'} copiada${count === 1 ? '' : 's'}!`;
        const errorMsg = 'Error al copiar palabras';

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMsg);
            }).catch(() => {
                fallbackCopy(text, successMsg, errorMsg);
            });
        } else {
            fallbackCopy(text, successMsg, errorMsg);
        }
    }

    function fallbackCopy(text, successMsg, errorMsg) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        let successful = false;
        try {
            successful = document.execCommand('copy');
        } catch (err) {
            successful = false;
        } finally {
            document.body.removeChild(textarea);
        }

        if (successful) {
            showToast(successMsg);
        } else {
            showToast(errorMsg);
        }
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (currentResults.length === 0) return;
            const allWords = currentResults.flatMap(entry => entry.displays);
            const uniqueWords = Array.from(new Set(allWords));
            const wordsText = uniqueWords.join('\n');
            copyTextToClipboard(wordsText, uniqueWords.length);
        });
    }

    // Drawer Navigation
    if (menuToggle && navPanel && navOverlay) {
        menuToggle.addEventListener('click', () => {
            navPanel.classList.add('open');
            navOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeNav() {
        if (navPanel) navPanel.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (closeNavBtn) closeNavBtn.addEventListener('click', closeNav);
    if (navOverlay) navOverlay.addEventListener('click', closeNav);

    // Help Modal
    if (helpBtn && helpModal && modalOverlay) {
        helpBtn.addEventListener('click', () => {
            helpModal.classList.add('show');
            modalOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeHelp() {
        if (helpModal) helpModal.classList.remove('show');
        if (modalOverlay) modalOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeHelp);
    if (modalOverlay) modalOverlay.addEventListener('click', closeHelp);

    // Initialize
    loadSpanishDatasets();
})();
