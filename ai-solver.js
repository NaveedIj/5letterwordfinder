/**
 * AI Word Solver Logic
 * High-performance, client-side pattern matching engine supporting:
 * - Pattern Input (A__LE, C_T, B_RD, __ING) with '_' and '?' wildcards
 * - Starts With, Ends With, Contains, Does Not Contain
 * - Word Length Filtering (3, 4, 5, 6, 7, 8+)
 * - Sorting (Alphabetical, Shortest First, Longest First)
 * - Copy Word / Copy All Results
 */

(function () {
    const fullList = typeof wordList !== 'undefined' ? wordList : [];

    const patternInput = document.getElementById('aiPatternInput');
    const startsWithInput = document.getElementById('aiStartsWith');
    const endsWithInput = document.getElementById('aiEndsWith');
    const containsInput = document.getElementById('aiContains');
    const doesNotContainInput = document.getElementById('aiDoesNotContain');
    const solveBtn = document.getElementById('aiSolveBtn');
    const resetBtn = document.getElementById('aiResetBtn');
    const lengthBtns = document.querySelectorAll('.ai-length-btn');
    const sortSelect = document.getElementById('aiSortSelect');
    const resultsContainer = document.getElementById('aiResultsContainer');
    const resultsCount = document.getElementById('aiResultsCount');
    const copyAllBtn = document.getElementById('aiCopyAllBtn');
    const toast = document.getElementById('toast');

    let selectedLength = 'all';
    let currentResults = [];

    function countLetters(str) {
        const o = {};
        for (const c of str) {
            if (/[A-Z]/.test(c)) o[c] = (o[c] || 0) + 1;
        }
        return o;
    }

    function solveWords() {
        const rawPattern = (patternInput ? patternInput.value : '').toUpperCase().trim();
        const startsWith = (startsWithInput ? startsWithInput.value : '').toUpperCase().trim();
        const endsWith = (endsWithInput ? endsWithInput.value : '').toUpperCase().trim();
        const containsRaw = (containsInput ? containsInput.value : '').toUpperCase().replace(/[^A-Z]/g, '');
        const excludeRaw = (doesNotContainInput ? doesNotContainInput.value : '').toUpperCase().replace(/[^A-Z]/g, '');

        const containsCounts = countLetters(containsRaw);
        const excludeSet = new Set(excludeRaw.split(''));

        currentResults = fullList.filter(word => {
            const upper = word.toUpperCase();
            const len = upper.length;

            // 1. Length Filter
            if (selectedLength === '3' && len !== 3) return false;
            if (selectedLength === '4' && len !== 4) return false;
            if (selectedLength === '5' && len !== 5) return false;
            if (selectedLength === '6' && len !== 6) return false;
            if (selectedLength === '7' && len !== 7) return false;
            if (selectedLength === '8+' && len < 8) return false;

            // 2. Starts With Filter
            if (startsWith && !upper.startsWith(startsWith)) return false;

            // 3. Ends With Filter
            if (endsWith && !upper.endsWith(endsWith)) return false;

            // 4. Pattern Input Filter (_ and ? as wildcards)
            if (rawPattern) {
                // If user typed a pattern without wildcards or length mismatch, handle pattern matching
                if (rawPattern.length === len) {
                    for (let i = 0; i < len; i++) {
                        const pChar = rawPattern[i];
                        if (pChar !== '_' && pChar !== '?' && pChar !== upper[i]) {
                            return false;
                        }
                    }
                } else if (rawPattern.includes('_') || rawPattern.includes('?')) {
                    // Regex construction for variable length or substring pattern match
                    const regexStr = '^' + rawPattern.replace(/[_?]/g, '.') + '$';
                    try {
                        const regex = new RegExp(regexStr);
                        if (!regex.test(upper)) return false;
                    } catch (e) {
                        // In case of invalid regex, fallback to false
                        return false;
                    }
                } else {
                    // Substring match if pattern does not specify wildcards but has different length
                    if (!upper.includes(rawPattern)) return false;
                }
            }

            // 5. Contains (Must Include) Filter
            const wordCounts = countLetters(upper);
            for (const [c, need] of Object.entries(containsCounts)) {
                if ((wordCounts[c] || 0) < need) return false;
            }

            // 6. Exclude Filter
            for (const char of excludeSet) {
                if (upper.includes(char)) return false;
            }

            return true;
        });

        sortResults();
        renderResults();
    }

    function sortResults() {
        const mode = sortSelect ? sortSelect.value : 'alpha-asc';
        if (mode === 'alpha-asc') {
            currentResults.sort((a, b) => a.localeCompare(b));
        } else if (mode === 'length-asc') {
            currentResults.sort((a, b) => a.length - b.length || a.localeCompare(b));
        } else if (mode === 'length-desc') {
            currentResults.sort((a, b) => b.length - a.length || a.localeCompare(b));
        }
    }

    function renderResults() {
        if (!resultsContainer) return;

        if (currentResults.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1rem; text-align: center;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p style="margin-top: 1rem; color: var(--text-muted);">No matching words found. Try adjusting your pattern or filters.</p>
                </div>
            `;
            if (resultsCount) resultsCount.textContent = '0 words';
            if (copyAllBtn) copyAllBtn.disabled = true;
            return;
        }

        const limit = 500;
        const displayList = currentResults.slice(0, limit);

        const html = displayList.map(word => {
            const upper = word.toUpperCase();
            return `
                <div class="ai-result-card">
                    <div class="ai-card-info">
                        <span class="ai-card-word">${upper}</span>
                        <span class="ai-card-meta">${upper.length} Letters</span>
                    </div>
                    <button type="button" class="ai-copy-btn" data-word="${upper}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                    </button>
                </div>
            `;
        }).join('');

        resultsContainer.innerHTML = html;
        if (copyAllBtn) copyAllBtn.disabled = false;

        const countText = `${currentResults.length.toLocaleString()} word${currentResults.length !== 1 ? 's' : ''}`;
        if (resultsCount) {
            resultsCount.textContent = currentResults.length > limit ? `${countText} (showing first ${limit})` : countText;
        }
    }

    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    function copyToClipboard(text, msg) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => showToast(msg)).catch(() => fallbackCopy(text, msg));
        } else {
            fallbackCopy(text, msg);
        }
    }

    function fallbackCopy(text, msg) {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try {
            document.execCommand('copy');
            showToast(msg);
        } catch (e) {
            showToast('Copy failed');
        }
        document.body.removeChild(area);
    }

    // Event Listeners
    if (patternInput) {
        patternInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z_?]/g, '');
            solveWords();
        });
    }

    [startsWithInput, endsWithInput, containsInput, doesNotContainInput].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                solveWords();
            });
        }
    });

    lengthBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lengthBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedLength = btn.dataset.length;
            solveWords();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortResults();
            renderResults();
        });
    }

    if (solveBtn) {
        solveBtn.addEventListener('click', () => {
            solveWords();
            resultsContainer?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (patternInput) patternInput.value = '';
            if (startsWithInput) startsWithInput.value = '';
            if (endsWithInput) endsWithInput.value = '';
            if (containsInput) containsInput.value = '';
            if (doesNotContainInput) doesNotContainInput.value = '';
            lengthBtns.forEach(b => b.classList.remove('active'));
            if (lengthBtns[0]) lengthBtns[0].classList.add('active');
            selectedLength = 'all';
            solveWords();
            patternInput?.focus();
        });
    }

    if (copyAllBtn) {
        copyAllBtn.addEventListener('click', () => {
            if (currentResults.length === 0) return;
            copyToClipboard(currentResults.join(', '), 'Copied all results!');
        });
    }

    if (resultsContainer) {
        resultsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.ai-copy-btn');
            if (btn) {
                const word = btn.dataset.word;
                if (word) copyToClipboard(word, `Copied "${word}"!`);
            }
        });
    }

    // Theme & Navigation Panel Event Handlers
    const navPanel = document.getElementById('navPanel');
    const navOverlay = document.getElementById('navOverlay');
    const closeNavBtn = document.getElementById('closeNavBtn');
    const menuToggle = document.querySelector('.menu-toggle');
    const darkModeToggle = document.getElementById('darkModeToggle');

    function toggleNav(open) {
        if (navPanel) navPanel.classList.toggle('active', open);
        if (navOverlay) navOverlay.classList.toggle('active', open);
    }

    if (menuToggle) menuToggle.addEventListener('click', () => toggleNav(true));
    if (closeNavBtn) closeNavBtn.addEventListener('click', () => toggleNav(false));
    if (navOverlay) navOverlay.addEventListener('click', () => toggleNav(false));

    if (darkModeToggle) {
        darkModeToggle.checked = document.documentElement.classList.contains('theme-dark');
        darkModeToggle.addEventListener('change', (e) => {
            const isDark = e.target.checked;
            document.documentElement.classList.remove('theme-dark', 'theme-light');
            document.documentElement.classList.add(isDark ? 'theme-dark' : 'theme-light');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        solveWords();
    });
})();
