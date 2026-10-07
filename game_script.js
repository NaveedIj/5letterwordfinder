const WORD_LIST = [
    'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again',
    'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'align', 'alike', 'alive', 'allow',
    'alone', 'along', 'alter', 'amber', 'amend', 'angel', 'anger', 'angle', 'angry', 'apart',
    'apple', 'apply', 'arena', 'argue', 'arise', 'armor', 'array', 'arrow', 'aside', 'asset',
    'audio', 'avoid', 'award', 'aware', 'badly', 'basis', 'beach', 'began', 'begin', 'being',
    'below', 'bench', 'billy', 'birth', 'black', 'blade', 'blame', 'blank', 'blind', 'block',
    'blood', 'board', 'boost', 'booth', 'bound', 'brain', 'brand', 'brave', 'bread', 'break',
    'breed', 'brief', 'bring', 'broad', 'broke', 'brown', 'build', 'built', 'buyer', 'cable',
    'calif', 'carry', 'catch', 'cause', 'chain', 'chair', 'chart', 'chase', 'cheap', 'check',
    'chest', 'chief', 'child', 'china', 'chose', 'civil', 'claim', 'class', 'clean', 'clear',
    'click', 'clock', 'close', 'coach', 'coast', 'could', 'count', 'court', 'cover', 'craft',
    'crash', 'crazy', 'cream', 'crime', 'cross', 'crowd', 'crown', 'crude', 'curve', 'cycle',
    'daily', 'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'depth', 'doing', 'doubt',
    'dozen', 'draft', 'drama', 'drank', 'drawn', 'dream', 'dress', 'drill', 'drink', 'drive',
    'drove', 'dying', 'eager', 'early', 'earth', 'eight', 'elect', 'elite', 'empty', 'enemy',
    'enjoy', 'enter', 'entry', 'equal', 'error', 'event', 'every', 'exact', 'exist', 'extra',
    'faith', 'false', 'fault', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first',
    'fixed', 'flash', 'fleet', 'floor', 'fluid', 'focus', 'force', 'forth', 'forty', 'forum',
    'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny', 'giant',
    'given', 'glass', 'globe', 'going', 'grace', 'grade', 'grand', 'grant', 'grass', 'great',
    'green', 'gross', 'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'harry',
    'heart', 'heavy', 'hence', 'henry', 'horse', 'hotel', 'house', 'human', 'ideal', 'image',
    'imply', 'index', 'inner', 'input', 'issue', 'japan', 'jimmy', 'joint', 'jones', 'judge',
    'known', 'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least',
    'leave', 'legal', 'lemon', 'level', 'lewis', 'light', 'limit', 'links', 'lives', 'local',
    'logic', 'loose', 'lower', 'lucky', 'lunch', 'lying', 'magic', 'major', 'maker', 'march',
    'maria', 'match', 'maybe', 'mayor', 'meant', 'media', 'metal', 'might', 'minor', 'minus',
    'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'movie',
    'music', 'needs', 'never', 'newly', 'night', 'noise', 'north', 'noted', 'novel', 'nurse',
    'occur', 'ocean', 'offer', 'often', 'order', 'organ', 'other', 'ought', 'paint', 'panel',
    'paper', 'party', 'peace', 'peter', 'phase', 'phone', 'photo', 'piece', 'pilot', 'pitch',
    'place', 'plain', 'plane', 'plant', 'plate', 'point', 'pound', 'power', 'press', 'price',
    'pride', 'prime', 'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick',
    'quiet', 'quite', 'radio', 'raise', 'range', 'rapid', 'ratio', 'reach', 'ready', 'refer',
    'right', 'rival', 'river', 'robin', 'roger', 'roman', 'rough', 'round', 'route', 'royal',
    'rural', 'scale', 'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall', 'shape',
    'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shirt', 'shock', 'shoot',
    'short', 'shown', 'sight', 'since', 'sixth', 'sixty', 'sized', 'skill', 'sleep', 'slide',
    'small', 'smart', 'smile', 'smith', 'smoke', 'solid', 'solve', 'sorry', 'sound', 'south',
    'space', 'spare', 'speak', 'speed', 'spend', 'spent', 'split', 'spoke', 'sport', 'staff',
    'stage', 'stake', 'stand', 'start', 'state', 'steam', 'steel', 'stick', 'still', 'stock',
    'stone', 'stood', 'store', 'storm', 'story', 'strip', 'stuck', 'study', 'stuff', 'style',
    'sugar', 'suite', 'super', 'sweet', 'table', 'taken', 'taste', 'taxes', 'teach', 'terry',
    'texas', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thing', 'think',
    'third', 'those', 'three', 'threw', 'throw', 'tight', 'times', 'title', 'today', 'topic',
    'total', 'touch', 'tough', 'tower', 'track', 'trade', 'train', 'treat', 'trend', 'trial',
    'tried', 'tries', 'truck', 'truly', 'trust', 'truth', 'twice', 'under', 'undue', 'union',
    'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'video',
    'virus', 'visit', 'vital', 'vocal', 'voice', 'waste', 'watch', 'water', 'wheel', 'where',
    'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world', 'worry', 'worse',
    'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote', 'young', 'youth', 'zebra'
];

const KEYBOARD_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
];

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;
const EPOCH_DATE = new Date('2024-01-01');

let targetWord = '';
let currentAttempt = 0;
let currentGuess = '';
let gameOver = false;
let keyStates = {};
let guesses = [];
let hintUsed = false;
let revealedLetters = { correct: {}, present: new Set() };
let gameMode = 'daily';

// Audio Context Handlers
let audioCtx = null;
function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSynth(freq, type, duration, volume = 0.05) {
    if (!getSettings().sound) return;
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const sounds = {
    flip: () => playSynth(440, 'sine', 0.1),
    error: () => playSynth(150, 'square', 0.2),
    click: () => playSynth(800, 'sine', 0.05, 0.02), // Short click sound
    win: () => {
        playSynth(523, 'sine', 0.1);
        setTimeout(() => playSynth(659, 'sine', 0.1), 100);
        setTimeout(() => playSynth(784, 'sine', 0.2), 200);
    },
    loss: () => {
        playSynth(300, 'square', 0.2);
        setTimeout(() => playSynth(200, 'square', 0.3), 200);
    }
};

const elements = {
    gameBoard: document.getElementById('gameBoard'),
    keyboard: document.getElementById('keyboard'),
    message: document.getElementById('message'),
    settingsBtn: document.getElementById('settingsBtn'),
    menuBtn: document.getElementById('menuBtn'),
    navPanel: document.getElementById('navPanel'),
    navOverlay: document.getElementById('navOverlay'),
    closeNavBtn: document.getElementById('closeNavBtn'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    soundToggle: document.getElementById('soundToggle'),
    activeModeTag: document.getElementById('activeModeTag'),
    settingsModal: document.getElementById('settingsModal'),
    howToModal: document.getElementById('howToModal'),
    gameOverModal: document.getElementById('gameOverModal'),
    statsModal: document.getElementById('statsModal'),
    hintBtn: document.getElementById('hintBtn'),
    mainNewGameBtn: document.getElementById('mainNewGameBtn'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    onboardDoneBtn: document.getElementById('onboardDoneBtn')
};

function getSettings() {
    const defaults = {
        dailyMode: true,
        hardMode: false,
        animations: true,
        theme: 'dark',
        sound: true
    };
    const saved = localStorage.getItem('wordleSettings_v3');
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
}

function saveSettings(settings) {
    localStorage.setItem('wordleSettings_v3', JSON.stringify(settings));
}

function getStats() {
    const defaults = { played: 0, won: 0, currentStreak: 0, bestStreak: 0 };
    const saved = localStorage.getItem('wordleStats_v3');
    return saved ? JSON.parse(saved) : defaults;
}

function saveStats(stats) {
    localStorage.setItem('wordleStats_v3', JSON.stringify(stats));
    updateStatsDisplay();
}

function updateStatsDisplay() {
    const stats = getStats();
    const wr = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;

    // Update main stats panel
    document.getElementById('statPlayed').textContent = stats.played;
    document.getElementById('statWinRate').textContent = wr + '%';
    document.getElementById('statStreak').textContent = stats.currentStreak;
    document.getElementById('statBestStreak').textContent = stats.bestStreak;

    // Update modal stats panel
    const modalPlayed = document.getElementById('modalStatPlayed');
    const modalWinRate = document.getElementById('modalStatWinRate');
    const modalStreak = document.getElementById('modalStatStreak');
    const modalBestStreak = document.getElementById('modalStatBestStreak');

    if (modalPlayed) modalPlayed.textContent = stats.played;
    if (modalWinRate) modalWinRate.textContent = wr + '%';
    if (modalStreak) modalStreak.textContent = stats.currentStreak;
    if (modalBestStreak) modalBestStreak.textContent = stats.bestStreak;
}

function applyTheme() {
    const s = getSettings();
    document.body.className = s.theme === 'light' ? 'theme-light' : 'theme-dark';
    if (!s.animations) document.body.classList.add('animations-disabled');
    elements.darkModeToggle.checked = s.theme === 'dark';
    elements.soundToggle.checked = s.sound;
    document.getElementById('hardModeToggle').checked = s.hardMode;
    document.getElementById('animationsToggle').checked = s.animations;
}

let commonList = [];
const fullList = typeof wordList !== 'undefined' ? wordList : [];

async function loadGameDataset() {
    try {
        const response = await fetch('/data/wordle-common.json');
        if (!response.ok) throw new Error('Dataset fetch failed');
        commonList = await response.json();
    } catch (err) {
        console.warn('Falling back to internal word list:', err);
        commonList = WORD_LIST;
    }
}

function getActiveWordList() {
    return (commonList && commonList.length > 0) ? commonList : WORD_LIST;
}

function getDayNumber() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.floor((today.getTime() - EPOCH_DATE.getTime()) / 86400000);
}

function initGame(mode = 'daily') {
    gameMode = mode;
    const day = getDayNumber();
    const list = getActiveWordList();

    if (mode === 'daily') {
        const saved = localStorage.getItem(`wordle_daily_v3_${day}`);
        if (saved) {
            const state = JSON.parse(saved);
            targetWord = state.targetWord;
            currentAttempt = state.currentAttempt;
            guesses = state.guesses;
            gameOver = state.gameOver;
            hintUsed = state.hintUsed;
            keyStates = state.keyStates;
        } else {
            targetWord = list[day % list.length].toUpperCase();
            resetLocalState();
        }
    } else {
        targetWord = list[Math.floor(Math.random() * list.length)].toUpperCase();
        resetLocalState();
    }

    currentGuess = '';
    revealedLetters = { correct: {}, present: new Set() };

    renderBoard();
    renderKeyboard();
    updateStatsDisplay();
    updateUI();
}

function resetLocalState() {
    currentAttempt = 0;
    guesses = [];
    gameOver = false;
    hintUsed = false;
    keyStates = {};
    elements.playAgainBtn.style.display = 'none';
}

function saveState() {
    if (gameMode !== 'daily') return;
    const day = getDayNumber();
    const state = { targetWord, currentAttempt, guesses, gameOver, hintUsed, keyStates };
    localStorage.setItem(`wordle_daily_v3_${day}`, JSON.stringify(state));
}

function renderBoard() {
    elements.gameBoard.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        row.dataset.row = i;
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.col = j;
            if (i < guesses.length) {
                const letter = guesses[i][j];
                tile.textContent = letter;
                tile.classList.add('filled');
                if (letter !== '.') {
                    applyColorsToTile(tile, letter, j, guesses[i]);
                }
            }
            row.appendChild(tile);
        }
        elements.gameBoard.appendChild(row);
    }
}

function applyColorsToTile(tile, letter, pos, guess) {
    if (letter === targetWord[pos]) {
        tile.classList.add('correct');
        revealedLetters.correct[pos] = letter;
    } else if (targetWord.includes(letter)) {
        tile.classList.add('present');
    } else {
        tile.classList.add('absent');
    }
}

function renderKeyboard() {
    elements.keyboard.innerHTML = '';
    KEYBOARD_LAYOUT.forEach(row => {
        const kbRow = document.createElement('div');
        kbRow.className = 'keyboard-row';
        row.forEach(key => {
            const btn = document.createElement('button');
            btn.className = 'key';
            if (key === 'ENTER' || key === 'BACK') btn.classList.add('wide');
            btn.textContent = key;
            btn.dataset.key = key;
            if (keyStates[key]) btn.classList.add(keyStates[key]);
            btn.onclick = () => { initAudio(); sounds.click(); handleInput(key); };
            kbRow.appendChild(btn);
        });
        elements.keyboard.appendChild(kbRow);
    });
}

function handleInput(key) {
    if (gameOver) return;
    if (key === 'ENTER') submitGuess();
    else if (key === 'BACK' || key === 'BACKSPACE') deleteLetter();
    else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) addLetter(key);
}

function addLetter(l) {
    currentGuess += l;
    const tile = document.querySelector(`[data-row="${currentAttempt}"] [data-col="${currentGuess.length - 1}"]`);
    if (tile) {
        tile.textContent = l;
        tile.classList.add('filled');
    }
}

function deleteLetter() {
    if (currentGuess.length === 0) return;
    const tile = document.querySelector(`[data-row="${currentAttempt}"] [data-col="${currentGuess.length - 1}"]`);
    if (tile) {
        tile.textContent = '';
        tile.classList.remove('filled');
    }
    currentGuess = currentGuess.slice(0, -1);
}

function validateHardMode(guess) {
    const s = getSettings();
    if (!s.hardMode) return { valid: true };

    // Check correct positions
    for (let i in revealedLetters.correct) {
        if (guess[i] !== revealedLetters.correct[i]) {
            return { valid: false, msg: `Position ${parseInt(i) + 1} must be ${revealedLetters.correct[i]}` };
        }
    }
    return { valid: true };
}

function submitGuess() {
    if (currentGuess.length !== WORD_LENGTH) return showMsg('Not enough letters', 'error');
    if (!isWordValid(currentGuess)) return showMsg('Invalid word', 'error');

    const validation = validateHardMode(currentGuess);
    if (!validation.valid) return showMsg(validation.msg, 'error');

    const guess = currentGuess;
    guesses.push(guess);
    const row = document.querySelector(`[data-row="${currentAttempt}"]`);
    const tiles = row.querySelectorAll('.tile');

    tiles.forEach((t, i) => {
        setTimeout(() => {
            applyColorsToTile(t, guess[i], i, guess);
            updateKeyState(guess[i], i);
            sounds.flip();
        }, i * 150);
    });

    setTimeout(() => {
        if (guess === targetWord) {
            handleEnd(true);
        } else if (currentAttempt === MAX_ATTEMPTS - 1) {
            handleEnd(false);
        } else {
            currentAttempt++;
            currentGuess = '';
        }
        saveState();
    }, 1000);
}

function handleEnd(won) {
    gameOver = true;
    const stats = getStats();
    stats.played++;
    if (won) {
        stats.won++;
        stats.currentStreak++;
        if (stats.currentStreak > stats.bestStreak) stats.bestStreak = stats.currentStreak;
        sounds.win();
        showMsg('Brilliant!', 'success');
    } else {
        stats.currentStreak = 0;
        sounds.loss();
        showMsg(`The word was ${targetWord}`, 'info');
    }
    saveStats(stats);
    setTimeout(showGameOver, 1500);
}

function updateKeyState(l, pos) {
    const key = document.querySelector(`[data-key="${l}"]`);
    if (!key) return;
    if (l === targetWord[pos]) {
        key.className = 'key correct';
        keyStates[l] = 'correct';
    } else if (targetWord.includes(l) && keyStates[l] !== 'correct') {
        key.className = 'key present';
        keyStates[l] = 'present';
    } else if (!targetWord.includes(l)) {
        key.className = 'key absent';
        keyStates[l] = 'absent';
    }
}



function showMsg(t, type) {
    elements.message.textContent = t;
    elements.message.className = `message show ${type}`;
    if (type === 'error') sounds.error();
    setTimeout(() => elements.message.classList.remove('show'), 2000);
}

function updateUI() {
    elements.activeModeTag.textContent = gameMode === 'daily' ? 'Daily Challenge' : 'Free Play';
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeBtn = document.getElementById(gameMode === 'daily' ? 'menuDailyBtn' : 'menuFreeBtn');
    if (activeBtn) activeBtn.classList.add('active');
    elements.playAgainBtn.style.display = (gameOver && gameMode === 'free') ? 'block' : 'none';
}

function triggerConfetti() {
    const modalContent = elements.gameOverModal.querySelector('.modal-content');
    if (!modalContent) return;
    const container = document.createElement('div');
    container.className = 'confetti-container';
    const colors = ['#8b5cf6', '#d946ef', '#10b981', '#f59e0b', '#38bdf8'];
    for (let i = 0; i < 30; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = (Math.random() * 0.5) + 's';
        piece.style.animationDuration = (1.8 + Math.random() * 1.2) + 's';
        container.appendChild(piece);
    }
    modalContent.appendChild(container);
    setTimeout(() => container.remove(), 3500);
}

function showGameOver() {
    elements.gameOverModal.classList.add('active');
    const won = guesses.length > 0 && guesses[guesses.length - 1] === targetWord;
    document.getElementById('gameResult').textContent = won ? 'Victory!' : 'Keep Trying';
    document.getElementById('wordReveal').textContent = `The word was ${targetWord}`;
    if (won) triggerConfetti();
    renderShareGrid();
    updateUI();
}

function renderShareGrid() {
    let grid = '';
    guesses.forEach(g => {
        if (g.includes('.')) { grid += '💎\n'; return; }
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (g[i] === targetWord[i]) grid += '🟩';
            else if (targetWord.includes(g[i])) grid += '🟨';
            else grid += '⬜';
        }
        grid += '\n';
    });
    document.getElementById('shareGrid').textContent = grid;
}

function copyResults() {
    const shareText = document.getElementById('shareGrid').textContent;
    const settings = getSettings();
    const dayNum = getDayNumber();
    const attempts = guesses[guesses.length - 1] === targetWord ? guesses.length : 'X';

    let header = settings.dailyMode
        ? `Wordle #${dayNum} ${attempts}/6${settings.hardMode ? '*' : ''}\n\n`
        : `Wordle ${attempts}/6${settings.hardMode ? '*' : ''}\n\n`;

    const fullText = header + shareText;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText).then(() => {
            showMsg('Results copied!', 'success');
        }).catch(() => {
            fallbackCopy(fullText);
        });
    } else {
        fallbackCopy(fullText);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showMsg('Results copied!', 'success');
    } catch (err) {
        showMsg('Copy failed', 'error');
    }
    document.body.removeChild(textarea);
}

// Event Listeners
const headerMenuToggle = document.querySelector(".menu-toggle");
if (headerMenuToggle) {
    headerMenuToggle.onclick = (e) => { e.preventDefault(); toggleNav(true); };
}
if (elements.menuBtn) elements.menuBtn.onclick = () => toggleNav(true);
elements.closeNavBtn.onclick = () => toggleNav(false);
elements.navOverlay.onclick = () => toggleNav(false);
elements.settingsBtn.onclick = () => elements.settingsModal.classList.add('active');
document.getElementById('closeSettingsBtn').onclick = () => elements.settingsModal.classList.remove('active');
document.getElementById('menuDailyBtn').onclick = () => { initGame('daily'); toggleNav(false); };
document.getElementById('menuFreeBtn').onclick = () => { initGame('free'); toggleNav(false); };
document.getElementById('menuHowToBtn').onclick = () => { elements.howToModal.classList.add('active'); toggleNav(false); };
elements.onboardDoneBtn.onclick = () => elements.howToModal.classList.remove('active');
document.getElementById('closeHowToBtn').onclick = () => elements.howToModal.classList.remove('active');
document.getElementById('menuStatsBtn').onclick = () => { elements.statsModal.classList.add('active'); toggleNav(false); };
document.getElementById('closeStatsBtn').onclick = () => elements.statsModal.classList.remove('active');
document.getElementById('closeGameOverBtn').onclick = () => elements.gameOverModal.classList.remove('active');
document.getElementById('shareBtn').onclick = copyResults;
elements.hintBtn.onclick = useHint;
if (elements.mainNewGameBtn) elements.mainNewGameBtn.onclick = () => initGame('free');
elements.playAgainBtn.onclick = () => initGame('free');
document.getElementById('menuResetBtn').onclick = () => {
    if (confirm('Reset current game?')) {
        // Clear the saved state for current mode
        if (gameMode === 'daily') {
            const day = getDayNumber();
            localStorage.removeItem(`wordle_daily_v3_${day}`);
        }
        initGame(gameMode);
        toggleNav(false);
    }
};

document.getElementById('resetStatsBtn').onclick = () => {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
        localStorage.removeItem('wordleStats_v3');
        updateStatsDisplay();
        showMsg('Statistics reset', 'info');
        toggleNav(false);
    }
};

elements.darkModeToggle.onchange = (e) => {
    const s = getSettings(); s.theme = e.target.checked ? 'dark' : 'light';
    saveSettings(s); applyTheme();
};
elements.soundToggle.onchange = (e) => {
    const s = getSettings(); s.sound = e.target.checked;
    saveSettings(s);
};
document.getElementById('hardModeToggle').onchange = (e) => {
    const s = getSettings(); s.hardMode = e.target.checked;
    saveSettings(s);
};
document.getElementById('animationsToggle').onchange = (e) => {
    const s = getSettings(); s.animations = e.target.checked;
    saveSettings(s); applyTheme();
};

document.onkeydown = (e) => {
    initAudio();
    if (e.key === 'Enter') handleInput('ENTER');
    else if (e.key === 'Backspace') handleInput('BACK');
    else if (/^[a-zA-Z]$/.test(e.key)) handleInput(e.key.toUpperCase());
};

function toggleNav(open) {
    elements.navPanel.classList.toggle('active', open);
    elements.navOverlay.classList.toggle('active', open);
}

// Initialization
applyTheme();
elements.gameBoard.innerHTML = '<div class="board-loading">Loading puzzle data...</div>';
loadGameDataset().then(() => {
    initGame();
});

function isWordValid(word) {
    const lower = word.toLowerCase();
    return (commonList && commonList.includes(lower)) || 
           (fullList && fullList.includes(lower)) || 
           WORD_LIST.includes(lower);
}

function useHint() {
    if (gameOver || hintUsed || currentAttempt >= MAX_ATTEMPTS) return;
    const unrevealed = [];
    for (let i = 0; i < WORD_LENGTH; i++) if (!revealedLetters.correct[i]) unrevealed.push(i);
    if (unrevealed.length === 0) return;

    const pos = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    const letter = targetWord[pos];

    hintUsed = true;
    revealedLetters.correct[pos] = letter;
    
    // Fill current row tile at position
    const row = document.querySelector(`[data-row="${currentAttempt}"]`);
    if (row) {
        const tile = row.querySelector(`[data-col="${pos}"]`);
        if (tile) {
            tile.textContent = letter;
            tile.classList.add('filled', 'correct', 'hint-tile');
        }
    }

    // Auto update currentGuess at that position if empty
    let newGuessArr = (currentGuess + ' '.repeat(WORD_LENGTH)).slice(0, WORD_LENGTH).split('');
    newGuessArr[pos] = letter;
    currentGuess = newGuessArr.join('').trimEnd();

    showMsg(`Hint: ${letter} at position ${pos + 1}!`, 'info');
    saveState();
}

if (!localStorage.getItem('wordle_onboarded_v3')) {
    setTimeout(() => { elements.howToModal.classList.add('active'); localStorage.setItem('wordle_onboarded_v3', 'true'); }, 500);
}
