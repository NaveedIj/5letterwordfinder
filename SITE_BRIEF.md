# SEO Site Brief: 5-Letter Word Finder Tool

**Production URL:** `https://www.5letterwordfindertool.com/`  
**Hosting Provider:** Vercel  
**Architecture:** Pure Static HTML/CSS/JS (Jamstack), Node.js SSG build script for programmatic SEO pages  

---

## 1. PROJECT STRUCTURE

```text
5-letter-word-finder/
|-- .github/
|   `-- workflows/
|-- css/
|   `-- styles.css
|-- data/
|   |-- 3.json              (24.97 KB, 2,130 words)
|   |-- 4.json              (91.23 KB, 7,186 words)
|   |-- 6.json              (437.61 KB, 29,874 words)
|   |-- 7.json              (656.22 KB, 41,998 words)
|   |-- 8.json              (857.09 KB, 51,627 words)
|   |-- scrabble.json       (217.67 KB, 15,921 words)
|   |-- wordle.json         (31.66 KB, 2,315 words)
|   `-- wordle-common.json  (20.76 KB, 2,656 words)
|-- 3-letter-words-starting-with-a.html ... 3-letter-words-starting-with-z.html (26 pages)
|-- 4-letter-words-starting-with-a.html ... 4-letter-words-starting-with-z.html (26 pages)
|-- 5-letter-words-starting-with-a.html ... 5-letter-words-starting-with-z.html (26 pages)
|-- 6-letter-words-starting-with-a.html ... 6-letter-words-starting-with-z.html (26 pages)
|-- 7-letter-words-starting-with-a.html ... 7-letter-words-starting-with-z.html (26 pages)
|-- 8-letter-words-starting-with-a.html ... 8-letter-words-starting-with-z.html (26 pages)
|-- 3-letter-word-finder.html
|-- 4-letter-word-finder.html
|-- 6-letter-word-finder.html
|-- 7-letter-word-finder.html
|-- 8-letter-word-finder.html
|-- wordle-solver.html
|-- scrabble-word-finder.html
|-- game.html
|-- about.html
|-- contact.html
|-- privacy.html
|-- terms.html
|-- build-programmatic-seo.js
|-- index.html
|-- favicon.ico
|-- og-image.png
|-- preview.png
|-- robots.txt
|-- sitemap.xml
|-- script.js
|-- vercel.json
|-- words.js               (1,413.29 KB, 148,736 words array)
`-- words_alpha.txt        (4,135.65 KB, 370,106 words)
```

---

## 2. TECH STACK & DEPENDENCIES

- **Frontend Tech Stack:** Standard HTML5, CSS3, Vanilla JavaScript (ES6+). Zero heavy client-side frameworks (No React, Vue, Angular, or jQuery).
- **Build & Generator System:** Node.js static site generator script (`build-programmatic-seo.js`) executed locally or during build steps to output programmatic SEO landing pages (A-Z starting letter pages for lengths 3 through 8).
- **Dependencies (`package.json`):** None (No third-party runtime package dependencies).
- **Hosting & Infrastructure:** Deployed on Vercel Edge Network with non-www to www 301 redirects and automatic HTTPS redirection configured via `vercel.json`.

---

## 3. HOMEPAGE SOURCE (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>5 Letter Word Finder – Instant Wordle & Scrabble Solver</title>
    <meta name="description"
        content="Find 5-letter words instantly with our free Word Finder. Filter by letter positions, misplaced letters, and excluded tiles to solve daily Wordle & Scrabble puzzles fast.">
    <meta name="keywords"
        content="5 letter word finder, wordle solver, five letter words, scrabble help, word generator">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://www.5letterwordfindertool.com/">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">

    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="5 Letter Word Finder – Instant Wordle & Scrabble Solver">
    <meta property="og:description"
        content="Find 5-letter words instantly with our free Word Finder. Filter by letter positions, misplaced letters, and excluded tiles to solve daily Wordle & Scrabble puzzles fast.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.5letterwordfindertool.com/">
    <meta property="og:image" content="https://www.5letterwordfindertool.com/preview.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="5 Letter Word Finder – Instant Wordle & Scrabble Solver">
    <meta name="twitter:description"
        content="Find 5-letter words instantly with our free Word Finder. Filter by letter positions, misplaced letters, and excluded tiles to solve daily Wordle & Scrabble puzzles fast.">
    <meta name="twitter:image" content="https://www.5letterwordfindertool.com/preview.png">
    
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    
    <!-- Non-blocking Google Fonts Loading -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap" as="style">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap" media="print" onload="this.media='all'">
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap">
    </noscript>
    
    <!-- Optimized CSS Loading -->
    <link rel="stylesheet" href="style.css">

    <!-- SEO Logic (Phase 3 Hardened) -->
    <script src="seo-data.js" defer></script>
    <script src="seoManager.js" defer></script>

    <!-- Phase 1.5: Theme Persistence & White Flash Prevention -->
    <script>
        (function() {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
            document.documentElement.classList.add(isDark ? 'theme-dark' : 'theme-light');
            document.documentElement.style.backgroundColor = isDark ? '#0f172a' : '#f8fafc';
        })();
    </script>
    <!-- Consolidated Schema.org JSON-LD Graph -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://www.5letterwordfindertool.com/#organization",
          "name": "5 Letter Word Finder Tool",
          "url": "https://www.5letterwordfindertool.com/",
          "logo": {
            "@type": "ImageObject",
            "@id": "https://www.5letterwordfindertool.com/#logo",
            "url": "https://www.5letterwordfindertool.com/preview.png",
            "contentUrl": "https://www.5letterwordfindertool.com/preview.png",
            "caption": "5 Letter Word Finder Tool Logo"
          },
          "sameAs": [
            "https://www.linkedin.com/company/5-letter-word-finder-tool",
            "https://www.facebook.com/profile.php?id=61590811286427",
            "https://www.pinterest.com/5letterwordfindertool/",
            "https://x.com/5letterwordfind"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://www.5letterwordfindertool.com/#website",
          "url": "https://www.5letterwordfindertool.com/",
          "name": "5 Letter Word Finder Tool",
          "description": "A Smart 5 Letter Word Finder for Wordle, Scrabble & Crosswords",
          "publisher": {
            "@id": "https://www.5letterwordfindertool.com/#organization"
          },
          "inLanguage": "en-US"
        },
        {
          "@type": "WebPage",
          "@id": "https://www.5letterwordfindertool.com/#webpage",
          "url": "https://www.5letterwordfindertool.com/",
          "name": "5 Letter Word Finder & Wordle Solver",
          "description": "Find 5-letter words instantly with our free Word Finder. Solve Wordle, Scrabble, crosswords and other word puzzles using smart search filters.",
          "isPartOf": {
            "@id": "https://www.5letterwordfindertool.com/#website"
          },
          "mainEntity": {
            "@id": "https://www.5letterwordfindertool.com/#webapp"
          },
          "inLanguage": "en-US"
        },
        {
          "@type": "WebApplication",
          "@id": "https://www.5letterwordfindertool.com/#webapp",
          "name": "5 Letter Word Finder Tool",
          "url": "https://www.5letterwordfindertool.com/",
          "description": "An interactive word finder and Wordle solver tool to find 5-letter words by including or excluding specific letters.",
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "FAQPage",
          "@id": "https://www.5letterwordfindertool.com/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do I filter 5-letter words with this tool?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Enter known letters in the correct position boxes (green), misplaced letters in the yellow row, and letters not in the word into the excluded box. The solver updates matching candidate words in real time as you type."
              }
            },
            {
              "@type": "Question",
              "name": "What is the difference between Wordle Mode and Full Dictionary Mode?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Wordle Mode filters across our 2,309-word curated daily solution list. Full Dictionary Mode searches our broader 15,921-word 5-letter list for Scrabble and crossword filtering."
              }
            },
            {
              "@type": "Question",
              "name": "How does the solver handle duplicate or repeated letters?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The filter engine tracks letter frequency automatically. If you enter duplicate letters into the input boxes or yellow slots, candidate words must contain at least that many letter occurrences."
              }
            },
            {
              "@type": "Question",
              "name": "Can I sort matching words by Scrabble score?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Use the order dropdown in the sidebar to sort results by Scrabble face values from highest to lowest or lowest to highest."
              }
            },
            {
              "@type": "Question",
              "name": "Are my search queries private?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Word matching and letter filtering run locally in your browser. Your letter inputs and search queries are not sent to our server."
              }
            }
          ]
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://www.5letterwordfindertool.com/#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.5letterwordfindertool.com/"
            }
          ]
        }
      ]
    }
    </script>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WW6EJYTTML"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WW6EJYTTML');
</script>
<!-- Microsoft Clarity Analytics -->
<script>
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "pxv43j2o89");
</script>
<style>
    .info-section .info-box {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        height: 100%;
    }
    .info-section .info-box ul {
        margin-top: 0;
    }
    .info-section details.faq-details {
        margin-bottom: 0.75rem;
        border-bottom: 1px solid var(--border);
        padding-bottom: 0.5rem;
    }
    .info-section details.faq-details:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
    .info-section summary.faq-summary {
        font-weight: 700;
        color: var(--text-primary);
        cursor: pointer;
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.95rem;
        user-select: none;
        padding: 0.25rem 0;
    }
    .info-section summary.faq-summary::-webkit-details-marker {
        display: none;
    }
    .info-section summary.faq-summary::after {
        content: "+";
        font-size: 1.2rem;
        font-weight: 400;
        color: var(--accent-light);
        margin-left: 0.5rem;
        transition: transform 0.2s ease;
    }
    .info-section details[open] summary.faq-summary::after {
        content: "−";
    }
    .info-section .faq-answer {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-top: 0.5rem;
        line-height: 1.5;
    }
    .info-content.faq-content {
        display: flex;
        justify-content: center;
    }
    .info-content.faq-content .info-box {
        width: 100%;
        max-width: 800px;
    }
    .letter-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: var(--radius-xl);
        justify-content: center;
    }
    .letter-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        background: var(--bg-elevated);
        color: var(--text-primary);
        text-decoration: none;
        border-radius: var(--radius-md);
        font-weight: 700;
        font-family: 'Outfit', sans-serif;
        transition: all var(--transition-fast);
        border: 1px solid var(--border);
        font-size: 1rem;
    }
    .letter-link:hover {
        background: var(--accent);
        color: white;
        border-color: var(--accent-light);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
</style>
</head>

<body data-word-length="5" data-pattern="length" data-seo-strategy="WORDLE_SOLVER" style="--word-len: 5;">
    <header class="saas-header">
        <nav class="nav-container-header" aria-label="Main Navigation">
            <!-- BRANDING -->
            <a href="/" class="brand-container">
                <span class="brand-name">Word Finder <span>Tool</span></span>
                <span class="brand-tagline-header">Instant Word & Puzzle Solver</span>
            </a>

            <!-- HAMBURGER BUTTON -->
            <button class="menu-toggle" aria-label="Toggle Menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            <!-- NAVIGATION -->
            <ul class="nav-menu">
                <li><a href="/" class="nav-menu-link active">Home</a></li>
                <li><a href="ai-word-solver" class="nav-menu-link">AI Word Solver</a></li>
                <li><a href="3-letter-word-finder.html" class="nav-menu-link">3 Letter</a></li>
                <li><a href="4-letter-word-finder.html" class="nav-menu-link">4 Letter</a></li>
                <li><a href="6-letter-word-finder.html" class="nav-menu-link">6 Letter</a></li>
                <li><a href="7-letter-word-finder.html" class="nav-menu-link">7 Letter</a></li>
                <li><a href="8-letter-word-finder.html" class="nav-menu-link">8 Letter</a></li>
            </ul>

            <!-- CTA BUTTON -->
            <div class="nav-cta">
                <a href="/#tool-section" class="btn-cta-header">Try Tool</a>
            </div>
        </nav>
    </header>

    <main>

        <!-- Navigation Overlay -->
        <div class="nav-overlay" id="navOverlay" aria-hidden="true"></div>

        <!-- Background Glow -->
        <div class="bg-glow"></div>

        <!-- Help Modal -->
        <div class="modal" id="helpModal" aria-hidden="true">
            <div class="modal-overlay" id="modalOverlay"></div>
            <div class="modal-content" id="helpModalContent">
                <!-- Content hydrated from template on demand -->
                <div class="loading-spinner-container" style="padding: 4rem; text-align: center;">
                    <div class="spinner"></div>
                    <p style="margin-top: 1rem; color: var(--text-muted);">Loading guide...</p>
                </div>
            </div>
        </div>

        <template id="help-modal-template">
                <button class="modal-close" id="closeModalBtn" aria-label="Close help">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <section class="showcase-section">
                    <div class="section-badge">How to Use</div>
                    <h3 class="showcase-title">Powerful Filtering Modes</h3>
                    <p class="showcase-subtitle">Master the word finder with these three search constraints - the same
                        logic
                        Wordle uses.</p>

                    <div class="showcase-grid">
                        <!-- Correct Position -->
                        <div class="showcase-card">
                            <div class="card-status-bar green"></div>
                            <div class="showcase-icon green">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <div class="showcase-visual">
                                <div class="mini-box correct">S</div>
                                <div class="mini-box empty"></div>
                                <div class="mini-box empty"></div>
                                <div class="mini-box empty"></div>
                                <div class="mini-box empty"></div>
                            </div>
                            <h3>Correct Position</h3>
                            <p>Enter letters where you know their <strong>exact position</strong>. Filters for words
                                that
                                match this pattern perfectly.</p>
                        </div>

                        <!-- Wrong Position -->
                        <div class="showcase-card">
                            <div class="card-status-bar yellow"></div>
                            <div class="showcase-icon yellow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <div class="showcase-visual">
                                <div class="mini-box empty"></div>
                                <div class="mini-box present">E</div>
                                <div class="mini-box empty"></div>
                                <div class="mini-box empty"></div>
                                <div class="mini-box empty"></div>
                            </div>
                            <h3>Wrong Position</h3>
                            <p>Letters that are in the word but <strong>not in this spot</strong>. Ensures the letter
                                exists
                                elsewhere.</p>
                        </div>

                        <!-- Excluded Letters -->
                        <div class="showcase-card">
                            <div class="card-status-bar gray"></div>
                            <div class="showcase-icon gray">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                            </div>
                            <div class="excluded-demo">
                                <span class="bad-letter">X</span>
                                <span class="bad-letter">Y</span>
                                <span class="bad-letter">Z</span>
                            </div>
                            <h3>Excluded Letters</h3>
                            <p>Instantly remove any words containing <strong>these characters</strong>. Prunes your
                                search
                                space dramatically.</p>
                        </div>
                    </div>
                </section>
        </template>


        <!-- Side Navigation Panel -->
        <aside class="nav-panel" id="navPanel" aria-label="Main Menu">
            <div class="nav-container">
                <div class="nav-header">
                    <div class="nav-title"
                        style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">
                        Menu</div>
                    <button class="btn-close-nav" id="closeNavBtn" aria-label="Close menu">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <nav class="nav-links">
                    <a href="game.html" class="nav-link"
                        style="text-decoration: none; display: flex; align-items: center; gap: 0.75rem;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <text x="7" y="16" font-family="sans-serif" font-weight="bold" font-size="10">W</text>
                        </svg>
                        Play Wordle
                    </a>
                    <div class="nav-divider"></div>
                    <p class="nav-section-label">Word finders</p>
                    <a href="ai-word-solver" class="nav-link">AI Word Solver</a>
                    <a href="3-letter-word-finder.html" class="nav-link">3 Letter Word Finder</a>
                    <a href="4-letter-word-finder.html" class="nav-link">4 Letter Word Finder</a>
                    <a href="/" class="nav-link nav-link--current">5 Letter Word Finder</a>
                    <a href="6-letter-word-finder.html" class="nav-link">6 Letter Word Finder</a>
                    <a href="7-letter-word-finder.html" class="nav-link">7 Letter Word Finder</a>
                    <a href="8-letter-word-finder.html" class="nav-link">8 Letter Word Finder</a>
                    <div class="nav-divider"></div>
                    <p class="nav-section-label">Information</p>
                    <a href="about.html" class="nav-link">About Us</a>
                    <a href="contact.html" class="nav-link">Contact Us</a>
                    <a href="privacy.html" class="nav-link">Privacy Policy</a>
                    <div class="nav-divider"></div>
                    <div class="nav-setting">
                        <span class="setting-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
                            </svg>
                        </span>
                        <span class="setting-text">Dark Mode</span>
                        <label class="toggle">
                            <input type="checkbox" id="darkModeToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </nav>
            </div>
        </aside>

        <div class="container">



            <!-- ======================== HERO SECTION ======================== -->
            <section class="header">

                <h1 class="title">5 Letter Word Finder – Instant Wordle &amp; Scrabble Solver</h1>
                <p class="tagline">A Smart 5 Letter Word Finder for Wordle, Scrabble & Crosswords</p>
                <p class="subtitle">Search and filter 5-letter words using exact letter positions, misplaced tile clues, and excluded letter filters. Built to help you find matching candidate words for daily Wordle puzzles, Scrabble plays, and crossword clues fast.</p>
            </section>

            <!-- Tool Input -->
            <div class="pattern-box hero-container" id="tool-section" role="search" aria-label="Word search filters">
                <!-- Persistent Warning / Validation Banner (Option B) -->
                <div class="filter-warning-banner" id="conflictWarning" aria-live="polite" style="display: none;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span id="conflictWarningText">Filter conflict detected.</span>
                </div>

                <div class="hero-row">
                    <span class="row-label">
                        <span class="row-label-dot green-dot"></span>
                        Correct Position
                    </span>
                    <div class="pattern-grid" id="patternGrid">
                        <input type="text" class="char-input" maxlength="1" autocomplete="off" spellcheck="false"
                            autofocus id="pos0" aria-label="Letter position 1">
                        <input type="text" class="char-input" maxlength="1" autocomplete="off" spellcheck="false"
                            id="pos1" aria-label="Letter position 2">
                        <input type="text" class="char-input" maxlength="1" autocomplete="off" spellcheck="false"
                            id="pos2" aria-label="Letter position 3">
                        <input type="text" class="char-input" maxlength="1" autocomplete="off" spellcheck="false"
                            id="pos3" aria-label="Letter position 4">
                        <input type="text" class="char-input" maxlength="1" autocomplete="off" spellcheck="false"
                            id="pos4" aria-label="Letter position 5">
                    </div>
                </div>

                <div class="hero-row">
                    <span class="row-label">
                        <span class="row-label-dot yellow-dot"></span>
                        Wrong position (yellow)
                    </span>
                    <div class="wrong-pos-grid" id="wrongPosGrid">
                        <input type="text" class="wrong-pos-input" maxlength="2" placeholder="-" id="w0"
                            aria-label="Wrong position letters for slot 1">
                        <input type="text" class="wrong-pos-input" maxlength="2" placeholder="-" id="w1"
                            aria-label="Wrong position letters for slot 2">
                        <input type="text" class="wrong-pos-input" maxlength="2" placeholder="-" id="w2"
                            aria-label="Wrong position letters for slot 3">
                        <input type="text" class="wrong-pos-input" maxlength="2" placeholder="-" id="w3"
                            aria-label="Wrong position letters for slot 4">
                        <input type="text" class="wrong-pos-input" maxlength="2" placeholder="-" id="w4"
                            aria-label="Wrong position letters for slot 5">
                    </div>
                    <p class="row-hint">Letters here are in the answer but not in that column-same as Wordle yellow.</p>
                </div>

                <div class="hero-row">
                    <span class="row-label">
                        <span class="row-label-dot gray-dot"></span>
                        Excluded (gray)
                    </span>
                    <label for="excludes" class="sr-only">Letters to exclude from the word</label>
                    <input type="text" id="excludes" class="text-input excluded-input hero-excludes"
                        placeholder="Letters not in the word" autocomplete="off" spellcheck="false"
                        aria-label="Letters to exclude from results">
                    <p class="row-hint">Ignored for letters you already set as green, yellow, or must-include.</p>
                </div>

                <!-- Optional Advanced Filters Section -->
                <details class="advanced-filters-details" id="advancedFiltersDetails">
                    <summary class="advanced-filters-summary">
                        <span>Advanced Filters (Must Include &amp; Repeat Settings)</span>
                        <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </summary>
                    <div class="advanced-filters-content">
                        <div class="hero-row">
                            <span class="row-label">
                                <span class="row-label-dot teal-dot"></span>
                                Must include (any position)
                            </span>
                            <label for="mustInclude" class="sr-only">Letters that must appear in the word</label>
                            <input type="text" id="mustInclude" class="text-input must-include-input hero-excludes"
                                placeholder="Extra letters that must appear (EE = need two E's)" autocomplete="off"
                                spellcheck="false" aria-label="Letters that must appear anywhere, with repeats counting">
                            <p class="row-hint">Use this for "unknown position" letters: repeats count, e.g.
                                <strong>ABBC</strong>
                                needs two B's.
                            </p>
                        </div>

                        <div class="hero-row hero-row--toggle">
                            <label class="repeat-toggle"
                                title="When on, yellow slots add to minimum letter counts (handles double letters). When off, each yellow letter only needs to appear once.">
                                <input type="checkbox" id="repeatSensitive" checked>
                                <span class="repeat-toggle-ui" aria-hidden="true"></span>
                                <span class="repeat-toggle-text"><strong>Repeat-aware</strong> - match Wordle-style letter
                                    counts
                                    (doubles, etc.)</span>
                            </label>
                        </div>
                    </div>
                </details>

                <div class="hero-actions">
                    <button type="button" class="btn btn-primary" id="findBtn"
                        aria-label="Apply filters and scroll to results">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        Find My Words
                    </button>
                    <button type="button" class="btn btn-secondary" id="resetBtn" aria-label="Clear all search filters">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                            </path>
                        </svg>
                        Clear all
                    </button>
                </div>
            </div>

            <div class="hero-extras"
                style="display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-top: 1rem; margin-bottom: 4rem;">
                <button class="btn-help" id="helpBtn" title="How to use">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    How It Works
                </button>

                <!-- Quick stats bar -->
                <div class="hero-stats" id="heroStats">
                    <div class="hero-stat" aria-live="polite">
                        <span class="hero-stat-num" id="statWordCount">2,309</span>
                        <span class="hero-stat-label">Words in list</span>
                    </div>
                    <div class="hero-stat-divider"></div>
                    <div class="hero-stat">
                        <span class="hero-stat-num">Live</span>
                        <span class="hero-stat-label">Results</span>
                    </div>
                    <div class="hero-stat-divider"></div>
                    <div class="hero-stat">
                        <span class="hero-stat-num">0</span>
                        <span class="hero-stat-label">Server calls</span>
                    </div>
                </div>
                <p class="privacy-badge">🛡️ <strong>Browser-Based Privacy:</strong> Word-matching logic runs locally inside your browser, so your letter inputs and search queries are not sent to our server.</p>
            </div>



            <!-- ======================== MAIN CONTENT GRID ======================== -->
            <div class="main-grid">
                <aside class="sidebar">
                    <!-- Play Wordle CTA -->
                    <a href="game.html" class="play-wordle-card">
                        <span class="play-wordle-text">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <text x="7" y="16" font-family="sans-serif" font-weight="bold" font-size="10">W</text>
                            </svg>
                            Play Wordle
                        </span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>

                    <!-- Dictionary Toggle -->
                    <div class="card" id="dictCard">
                        <div class="card-title"
                            style="font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z">
                                </path>
                            </svg>
                            Dictionary
                        </div>
                        <div class="dictionary-controls" id="dictToggle">
                            <div class="toggle-item active" data-dict="strict">Wordle</div>
                            <div class="toggle-item" data-dict="broad">Full</div>
                        </div>
                        <p class="text-xs text-muted">Wordle: curated list of common daily solution words. Full: comprehensive dictionary list for Scrabble and anagram puzzles.</p>
                    </div>

                    <!-- Sort & Scrabble -->
                    <div class="card">
                        <div class="card-title"
                            style="font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M3 6h18M7 12h10M10 18h4"></path>
                            </svg>
                            Sort &amp; scores
                        </div>
                        <label class="sidebar-label" for="sortSelect">Order</label>
                        <select id="sortSelect" class="select-input" aria-label="Sort results">
                            <option value="alpha-asc">A to Z</option>
                            <option value="alpha-desc">Z to A</option>
                            <option value="score-desc">Scrabble: high to low</option>
                            <option value="score-asc">Scrabble: low to high</option>
                        </select>
                        <label class="sidebar-label sidebar-label--spaced">
                            <input type="checkbox" id="showScrabble" checked class="checkbox-inline">
                            Show Scrabble face values
                        </label>
                    </div>

                    <!-- Letter Tracker -->
                    <div class="card">
                        <div class="card-title"
                            style="font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="4" y1="21" x2="4" y2="14"></line>
                                <line x1="4" y1="10" x2="4" y2="3"></line>
                                <circle cx="12" cy="12" r="3"></circle>
                                <line x1="12" y1="21" x2="12" y2="15"></line>
                                <line x1="12" y1="9" x2="12" y2="3"></line>
                                <line x1="20" y1="21" x2="20" y2="16"></line>
                                <line x1="20" y1="12" x2="20" y2="3"></line>
                            </svg>
                            Letter Tracker
                        </div>
                        <div class="tracker-grid" id="letterTracker">
                            <!-- A-Z generated by JS -->
                        </div>
                    </div>
                </aside>

                <!-- Results Panel -->
                <section class="card results-card" aria-live="polite" aria-label="Word search results">
                    <div class="results-info">
                        <div class="card-title results-heading"
                            style="margin-bottom: 0; font-size: 1.25rem; font-weight: 800;">Matches</div>
                        <div class="flex items-center gap-2 results-actions">
                            <span class="results-count" id="resultsCount">0 words</span>
                            <button class="btn btn-primary" id="copyBtn" disabled aria-label="Copy all results">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2.5">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                Copy all
                            </button>
                        </div>
                    </div>
                    <div class="results-list" id="resultsList">
                        <!-- Results generated by JS -->
                    </div>
                </section>
            </div>

            <!-- ======================== INFO CARDS ======================== -->
            <!-- ======================== SEO CONTENT SECTION ======================== -->
            <div id="seo-placeholder" class="lazy-section">
                <section class="info-section">
                    <div class="info-section-header">
                        <h2 class="info-section-title">How to Use the 5 Letter Word Finder</h2>
                        <p class="info-section-sub">Filter matching candidate words using exact tile positions, misplaced letter clues, and dataset options.</p>
                        <p class="editorial-meta">Lexicon Datasets Verified • <a href="about.html" style="color: inherit; text-decoration: underline;">Editorial Policy &amp; Word List Sources</a></p>
                    </div>

                    <!-- Filter Diagram -->
                    <figure class="filter-diagram-container" style="max-width: 800px; margin: 0 auto 2.5rem auto; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-md); color: var(--text-secondary);">
                        <svg viewBox="0 0 760 270" width="100%" height="100%" role="img" aria-labelledby="filter-diag-title filter-diag-desc" style="display: block; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
                            <title id="filter-diag-title">Word Finder Tile Filter System Explanation</title>
                            <desc id="filter-diag-desc">Visual diagram showing three 5-letter tile rows explaining the filter colors: Green for Correct Position, Yellow for Misplaced Position, and Gray for Excluded Letters.</desc>
                            
                            <!-- ROW 1: GREEN / CORRECT POSITION -->
                            <g transform="translate(10, 10)">
                                <rect x="0" y="0" width="52" height="52" rx="8" fill="var(--correct, #10b981)" stroke="var(--correct, #10b981)" stroke-width="2"/>
                                <text x="26" y="34" font-size="24" font-weight="800" fill="#ffffff" text-anchor="middle">C</text>
                                
                                <rect x="60" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="86" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">R</text>
                                
                                <rect x="120" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="146" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">A</text>
                                
                                <rect x="180" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="206" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">N</text>
                                
                                <rect x="240" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="266" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">E</text>
                                
                                <text x="310" y="24" font-size="16" font-weight="700" fill="var(--correct, #10b981)">Correct Position (Green)</text>
                                <text x="310" y="44" font-size="13" font-weight="400" fill="currentColor">Letter 'C' is in the word and in the exact 1st slot.</text>
                            </g>
                            
                            <!-- ROW 2: YELLOW / MISPLACED POSITION -->
                            <g transform="translate(10, 95)">
                                <rect x="0" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="26" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">S</text>
                                
                                <rect x="60" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="86" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">L</text>
                                
                                <rect x="120" y="0" width="52" height="52" rx="8" fill="var(--present, #f59e0b)" stroke="var(--present, #f59e0b)" stroke-width="2"/>
                                <text x="146" y="34" font-size="24" font-weight="800" fill="#ffffff" text-anchor="middle">A</text>
                                
                                <rect x="180" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="206" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">T</text>
                                
                                <rect x="240" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="266" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">E</text>
                                
                                <text x="310" y="24" font-size="16" font-weight="700" fill="var(--present, #f59e0b)">Wrong Position (Yellow)</text>
                                <text x="310" y="44" font-size="13" font-weight="400" fill="currentColor">Letter 'A' exists in the word, but not in the 3rd slot.</text>
                            </g>
                            
                            <!-- ROW 3: GRAY / EXCLUDED LETTER -->
                            <g transform="translate(10, 180)">
                                <rect x="0" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="26" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">B</text>
                                
                                <rect x="60" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="86" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">O</text>
                                
                                <rect x="120" y="0" width="52" height="52" rx="8" fill="var(--absent, #475569)" stroke="var(--absent, #475569)" stroke-width="2"/>
                                <text x="146" y="34" font-size="24" font-weight="800" fill="#ffffff" text-anchor="middle">U</text>
                                
                                <rect x="180" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="206" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">N</text>
                                
                                <rect x="240" y="0" width="52" height="52" rx="8" fill="var(--bg-elevated, #334155)" stroke="var(--border, #475569)" stroke-width="1.5"/>
                                <text x="266" y="34" font-size="24" font-weight="700" fill="var(--text-primary, #f1f5f9)" text-anchor="middle">D</text>
                                
                                <text x="310" y="24" font-size="16" font-weight="700" fill="currentColor">Not in Word (Gray)</text>
                                <text x="310" y="44" font-size="13" font-weight="400" fill="currentColor">Letter 'U' is confirmed absent from the target word.</text>
                            </g>
                        </svg>
                    </figure>

                    <div class="info-content">
                        <!-- Box 1: Core Filtering Mechanics -->
                        <div class="info-box blue">
                            <h3>1. Search &amp; Pattern Filters</h3>
                            <p>Our 5-letter word finder narrows down matching candidates in real time as you enter puzzle feedback:</p>
                            <ul class="clean-list">
                                <li><strong>Correct Position (Green):</strong> Enter letters whose exact 1st–5th slot position you already know.</li>
                                <li><strong>Wrong Position (Yellow):</strong> Enter letters that exist in the word but belong in a different slot.</li>
                                <li><strong>Excluded Letters (Gray):</strong> Enter confirmed incorrect letters to eliminate all matching words.</li>
                                <li><strong>Must Include &amp; Repeats:</strong> Filter for required letters regardless of slot, including double-letter occurrences (e.g., two E's for <em>ABBEY</em>).</li>
                            </ul>
                        </div>

                        <!-- Box 2: Dataset Modes -->
                        <div class="info-box green">
                            <h3>2. Wordle Mode vs. Full Dictionary Mode</h3>
                            <p>Select the underlying word list that matches your specific word game:</p>
                            <ul class="clean-list">
                                <li><strong>Wordle Mode:</strong> Filters against our 2,309-word list of common solution words used in daily Wordle puzzles.</li>
                                <li><strong>Full Dictionary Mode:</strong> Searches our broader 15,921-word 5-letter list for Scrabble, anagrams, and crossword puzzles.</li>
                            </ul>
                        </div>

                        <!-- Box 3: Strategic Openings -->
                        <div class="info-box purple">
                            <h3>3. Strategic Opening Guesses</h3>
                            <p>Choosing an opening 5-letter word with a useful mix of letters can help reveal clues and narrow the candidate list early:</p>
                            <ul class="clean-list">
                                <li><strong>Vowel-Oriented Openers:</strong> Words like <em>AUDIO</em> or <em>ADIEU</em> test multiple vowels in a single turn.</li>
                                <li><strong>Consonant-Oriented Openers:</strong> Words such as <em>CRANE</em>, <em>SLATE</em>, or <em>ALTER</em> test multiple common consonants.</li>
                                <li><strong>Common Word Endings:</strong> Words ending in <strong>E</strong> or <strong>Y</strong> represent common structural patterns (e.g., <em>STARE</em>, <em>HEAVY</em>).</li>
                            </ul>
                        </div>

                        <!-- Box 4: Scrabble Use Case -->
                        <div class="info-box blue">
                            <h3>4. Scrabble &amp; Crossword Helper</h3>
                            <p>Use the finder to solve board game tiles and crossword blanks:</p>
                            <ul class="clean-list">
                                <li><strong>Sort by Scrabble Values:</strong> Order candidate words from highest to lowest face value to maximize your turn points.</li>
                                <li><strong>Crossword Blanks:</strong> Use green position slots to fill in missing letters when surrounding board tiles are placed.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>


            <!-- ======================== EXPLORE MORE TOOLS ======================== -->
            <div id="tools-placeholder" class="lazy-section">
                <section class="tools-section">
                    <div class="info-section-header">
                        <h2 class="info-section-title">Explore More Word Tools</h2>
                        <p class="info-section-sub">Discover specialized word finders, AI solvers, and Scrabble tools.</p>
                    </div>
                    <div class="tools-grid">
                        <a href="ai-word-solver" class="tool-card">
                            <div class="tool-card-icon" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;">AI</div>
                            <div class="tool-card-info">
                                <h3>AI Word Solver</h3>
                                <p>Solve Wordle, Scrabble, and crossword puzzles using pattern filters.</p>
                            </div>
                            <span class="tool-card-arrow" aria-hidden="true">→</span>
                        </a>
                        <a href="3-letter-word-finder.html" class="tool-card">
                            <div class="tool-card-icon" style="background: var(--correct); color: white;">3</div>
                            <div class="tool-card-info">
                                <h3>3 Letter Word Finder</h3>
                                <p>Find high-scoring short hooks and tile combinations.</p>
                            </div>
                            <span class="tool-card-arrow" aria-hidden="true">→</span>
                        </a>
                        <a href="4-letter-word-finder.html" class="tool-card">
                            <div class="tool-card-icon" style="background: var(--present); color: white;">4</div>
                            <div class="tool-card-info">
                                <h3>4 Letter Word Finder</h3>
                                <p>Generate short words for crossword clues.</p>
                            </div>
                            <span class="tool-card-arrow" aria-hidden="true">→</span>
                        </a>
                        <a href="6-letter-word-finder.html" class="tool-card">
                            <div class="tool-card-icon" style="background: var(--correct); color: white;">6</div>
                            <div class="tool-card-info">
                                <h3>6 Letter Word Finder</h3>
                                <p>Solve longer puzzles and anagram challenges.</p>
                            </div>
                            <span class="tool-card-arrow" aria-hidden="true">→</span>
                        </a>
                        <a href="7-letter-word-finder.html" class="tool-card">
                            <div class="tool-card-icon" style="background: var(--present); color: white;">7</div>
                            <div class="tool-card-info">
                                <h3>7 Letter Word Finder</h3>
                                <p>Discover 7-letter bingo words and bonus plays.</p>
                            </div>
                            <span class="tool-card-arrow" aria-hidden="true">→</span>
                        </a>
                        <a href="8-letter-word-finder.html" class="tool-card">
                            <div class="tool-card-icon" style="background: var(--accent); color: white;">8</div>
                            <div class="tool-card-info">
                                <h3>8 Letter Word Finder</h3>
                                <p>Build maximum length Scrabble solutions.</p>
                            </div>
                            <span class="tool-card-arrow" aria-hidden="true">→</span>
                        </a>
                        <a href="game.html" class="tool-card">
                            <div class="tool-card-icon" style="background: var(--correct); color: white;">W</div>
                            <div class="tool-card-info">
                                <h3>Wordle Solver Tool</h3>
                                <p>Specialized interactive solver for the daily game.</p>
                            </div>
                            <span class="tool-card-arrow" aria-hidden="true">→</span>
                        </a>
                    </div>
                </section>
            </div>


            <!-- ======================== SEO CONTENT: EXAMPLE WORDS ======================== -->
            <div id="examples-placeholder" class="lazy-section">
                <section class="tools-section">
                    <div class="info-section-header">
                        <h2 class="info-section-title">Example 5-Letter Words for Wordle &amp; Scrabble</h2>
                        <p class="info-section-sub">Candidate word patterns and strategic opening choices.</p>
                    </div>
                    <div style="max-width: 800px; margin: 0 auto; padding: 2rem; background: var(--bg-card); border-radius: 1rem; border: 1px solid var(--border-color);">
                        <p>When solving daily word puzzles, choosing strong starting words can help reveal letter clues efficiently. Whether you are using a 5 Letter Word Finder to solve your daily Wordle, finding high-scoring anagrams in Scrabble, or filling in tricky crossword blanks, studying candidate patterns helps narrow down possibilities quickly. If you enjoy longer word games, explore our <a
                                href="6-letter-word-finder.html">6-letter word finder</a> or check out popular starting words below.</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); border-left: 3px solid var(--accent); padding-left: 0.75rem; margin: 1rem 0;"><strong>Lexicon Sources:</strong> Word lists are drawn from English word-game and dictionary datasets used by the site's different tools, including a 2,309-word Wordle-oriented list and a broader 15,921-word 5-letter list.</p>
                        <ul
                            style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 0.5rem; list-style: none; padding: 0; margin-top: 1rem;">
                            <li>ADIEU</li>
                            <li>ALERT</li>
                            <li>ALIEN</li>
                            <li>ALTER</li>
                            <li>AUDIO</li>
                            <li>BLAME</li>
                            <li>BLIND</li>
                            <li>BLOCK</li>
                            <li>BOARD</li>
                            <li>BRAIN</li>
                            <li>BREAD</li>
                            <li>BREAK</li>
                            <li>BRING</li>
                            <li>BROWN</li>
                            <li>BUILD</li>
                            <li>CATCH</li>
                            <li>CAUSE</li>
                            <li>CHAIN</li>
                            <li>CHAIR</li>
                            <li>CHART</li>
                            <li>CHASE</li>
                            <li>CHIEF</li>
                            <li>CHILD</li>
                            <li>CLASS</li>
                            <li>CLEAN</li>
                            <li>CLEAR</li>
                            <li>CLOCK</li>
                            <li>CLOSE</li>
                            <li>COACH</li>
                            <li>COAST</li>
                            <li>COUNT</li>
                            <li>COURT</li>
                            <li>COVER</li>
                            <li>CRANE</li>
                            <li>CRAZY</li>
                            <li>CREAM</li>
                            <li>CRIME</li>
                            <li>CROSS</li>
                            <li>CROWD</li>
                            <li>CROWN</li>
                            <li>DANCE</li>
                            <li>DEATH</li>
                            <li>DEPTH</li>
                            <li>DOUBT</li>
                            <li>DRAFT</li>
                            <li>DREAM</li>
                            <li>DRINK</li>
                            <li>DRIVE</li>
                            <li>EARTH</li>
                            <li>EMPTY</li>
                        </ul>
                    </div>
                </section>
            </div>

            <!-- PRE-RENDERED STRATEGY & FAQ SECTION -->
            <section class="info-section" style="margin-top: 4rem;">
                <div class="info-section-header">
                    <h2 class="info-section-title">5 Letter Word Finder FAQs</h2>
                    <p class="info-section-sub">Frequently asked questions about filtering candidate words and dataset options.</p>
                </div>

                <div class="info-content faq-content">
                    <div class="info-box green">
                        <h3>Frequently Asked Questions</h3>
                        <details class="faq-details">
                            <summary class="faq-summary">How do I filter 5-letter words with this tool?</summary>
                            <p class="faq-answer">Enter known letters in the correct position boxes (green), misplaced letters in the yellow row, and letters not in the word into the excluded box. The solver updates matching candidate words in real time as you type.</p>
                        </details>
                        <details class="faq-details">
                            <summary class="faq-summary">What is the difference between Wordle Mode and Full Dictionary Mode?</summary>
                            <p class="faq-answer">Wordle Mode filters across our 2,309-word curated daily solution list. Full Dictionary Mode searches our broader 15,921-word 5-letter list for Scrabble and crossword filtering.</p>
                        </details>
                        <details class="faq-details">
                            <summary class="faq-summary">How does the solver handle duplicate or repeated letters?</summary>
                            <p class="faq-answer">The filter engine tracks letter frequency automatically. If you enter duplicate letters into the input boxes or yellow slots, candidate words must contain at least that many letter occurrences.</p>
                        </details>
                        <details class="faq-details">
                            <summary class="faq-summary">Can I sort matching words by Scrabble score?</summary>
                            <p class="faq-answer">Yes. Use the order dropdown in the sidebar to sort results by Scrabble face values from highest to lowest or lowest to highest.</p>
                        </details>
                        <details class="faq-details">
                            <summary class="faq-summary">Are my search queries private?</summary>
                            <p class="faq-answer">Yes. Word matching and letter filtering run locally in your browser. Your letter inputs and search queries are not sent to our server.</p>
                        </details>
                    </div>
                </div>
            </section>

            <!-- ======================== POPULAR WORD SEARCHES ======================== -->
            <section class="tools-section" style="margin-top: 4rem;">
                <div class="info-section-header">
                    <h2 class="info-section-title">Popular Word Searches</h2>
                    <p class="info-section-sub">Some of our most searched 5-letter word lists for Wordle and puzzle solving:</p>
                </div>
                <div class="tools-grid" style="max-width: 900px; margin: 0 auto;">
                    <a href="5-letter-words-starting-with-l.html" class="tool-card">
                        <div class="tool-card-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">L</div>
                        <div class="tool-card-info">
                            <h3 style="font-size: 1.05rem; margin-bottom: 0.25rem;">5 Letter Words Starting with L</h3>
                            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Popular Wordle starters like LEAST, LARGE, and LIGHT.</p>
                        </div>
                    </a>
                    <a href="5-letter-words-starting-with-m.html" class="tool-card">
                        <div class="tool-card-icon" style="background: rgba(99, 102, 241, 0.15); color: #6366f1;">M</div>
                        <div class="tool-card-info">
                            <h3 style="font-size: 1.05rem; margin-bottom: 0.25rem;">5 Letter Words Starting with M</h3>
                            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Top puzzle answers like MATCH, MODEL, and MAGIC.</p>
                        </div>
                    </a>
                    <a href="5-letter-words-starting-with-h.html" class="tool-card">
                        <div class="tool-card-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">H</div>
                        <div class="tool-card-info">
                            <h3 style="font-size: 1.05rem; margin-bottom: 0.25rem;">5 Letter Words Starting with H</h3>
                            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">High-frequency openers like HOUSE, HEART, and HEAVY.</p>
                        </div>
                    </a>
                </div>
            </section>

            <!-- ======================== ALPHABETICAL INDEX ======================== -->
            <section class="tools-section" style="margin-top: 4rem; margin-bottom: 4rem;">
                <div class="info-section-header">
                    <h2 class="info-section-title">Browse 5 Letter Words by Starting Letter</h2>
                    <p class="info-section-sub">Explore full word lists categorized alphabetically from A to Z.</p>
                </div>
                <div class="letter-nav" style="max-width: 800px; margin: 0 auto;">
                    <a href="5-letter-words-starting-with-a.html" class="letter-link">A</a>
                    <a href="5-letter-words-starting-with-b.html" class="letter-link">B</a>
                    <a href="5-letter-words-starting-with-c.html" class="letter-link">C</a>
                    <a href="5-letter-words-starting-with-d.html" class="letter-link">D</a>
                    <a href="5-letter-words-starting-with-e.html" class="letter-link">E</a>
                    <a href="5-letter-words-starting-with-f.html" class="letter-link">F</a>
                    <a href="5-letter-words-starting-with-g.html" class="letter-link">G</a>
                    <a href="5-letter-words-starting-with-h.html" class="letter-link">H</a>
                    <a href="5-letter-words-starting-with-i.html" class="letter-link">I</a>
                    <a href="5-letter-words-starting-with-j.html" class="letter-link">J</a>
                    <a href="5-letter-words-starting-with-k.html" class="letter-link">K</a>
                    <a href="5-letter-words-starting-with-l.html" class="letter-link">L</a>
                    <a href="5-letter-words-starting-with-m.html" class="letter-link">M</a>
                    <a href="5-letter-words-starting-with-n.html" class="letter-link">N</a>
                    <a href="5-letter-words-starting-with-o.html" class="letter-link">O</a>
                    <a href="5-letter-words-starting-with-p.html" class="letter-link">P</a>
                    <a href="5-letter-words-starting-with-q.html" class="letter-link">Q</a>
                    <a href="5-letter-words-starting-with-r.html" class="letter-link">R</a>
                    <a href="5-letter-words-starting-with-s.html" class="letter-link">S</a>
                    <a href="5-letter-words-starting-with-t.html" class="letter-link">T</a>
                    <a href="5-letter-words-starting-with-u.html" class="letter-link">U</a>
                    <a href="5-letter-words-starting-with-v.html" class="letter-link">V</a>
                    <a href="5-letter-words-starting-with-w.html" class="letter-link">W</a>
                    <a href="5-letter-words-starting-with-x.html" class="letter-link">X</a>
                    <a href="5-letter-words-starting-with-y.html" class="letter-link">Y</a>
                    <a href="5-letter-words-starting-with-z.html" class="letter-link">Z</a>
                </div>
            </section>

            <section class="tools-section" style="margin-top: 4rem; margin-bottom: 4rem;">
                <div class="info-section-header">
                    <h2 class="info-section-title">Browse 5 Letter Words by Ending Letter</h2>
                    <p class="info-section-sub">Explore full word lists categorized alphabetically from A to Z.</p>
                </div>
                <div class="letter-nav" style="max-width: 800px; margin: 0 auto;">
                    <a href="5-letter-words-ending-with-a.html" class="letter-link">A</a>
                    <a href="5-letter-words-ending-with-b.html" class="letter-link">B</a>
                    <a href="5-letter-words-ending-with-c.html" class="letter-link">C</a>
                    <a href="5-letter-words-ending-with-d.html" class="letter-link">D</a>
                    <a href="5-letter-words-ending-with-e.html" class="letter-link">E</a>
                    <a href="5-letter-words-ending-with-f.html" class="letter-link">F</a>
                    <a href="5-letter-words-ending-with-g.html" class="letter-link">G</a>
                    <a href="5-letter-words-ending-with-h.html" class="letter-link">H</a>
                    <a href="5-letter-words-ending-with-i.html" class="letter-link">I</a>
                    <a href="5-letter-words-ending-with-j.html" class="letter-link">J</a>
                    <a href="5-letter-words-ending-with-k.html" class="letter-link">K</a>
                    <a href="5-letter-words-ending-with-l.html" class="letter-link">L</a>
                    <a href="5-letter-words-ending-with-m.html" class="letter-link">M</a>
                    <a href="5-letter-words-ending-with-n.html" class="letter-link">N</a>
                    <a href="5-letter-words-ending-with-o.html" class="letter-link">O</a>
                    <a href="5-letter-words-ending-with-p.html" class="letter-link">P</a>
                    <a href="5-letter-words-ending-with-q.html" class="letter-link">Q</a>
                    <a href="5-letter-words-ending-with-r.html" class="letter-link">R</a>
                    <a href="5-letter-words-ending-with-s.html" class="letter-link">S</a>
                    <a href="5-letter-words-ending-with-t.html" class="letter-link">T</a>
                    <a href="5-letter-words-ending-with-u.html" class="letter-link">U</a>
                    <a href="5-letter-words-ending-with-v.html" class="letter-link">V</a>
                    <a href="5-letter-words-ending-with-w.html" class="letter-link">W</a>
                    <a href="5-letter-words-ending-with-x.html" class="letter-link">X</a>
                    <a href="5-letter-words-ending-with-y.html" class="letter-link">Y</a>
                    <a href="5-letter-words-ending-with-z.html" class="letter-link">Z</a>
                </div>
            </section>

        </div><!-- end .container -->

    </main>

    <!-- ======================== FOOTER ======================== -->
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-grid">
                <!-- 1. BRAND SECTION -->
                <div class="footer-col brand-col">
                    <div class="footer-logo-container">
                        <a href="/">Word Finder <span>Tool</span></a>
                    </div>
                    <p class="footer-tagline">Instant Word & Puzzle Solver</p>
                    <p class="footer-desc">Free, privacy-focused word tool designed to help players solve Wordle, Scrabble, and crossword puzzles.</p>
                    <div class="social-icons">
                        <a href="https://www.linkedin.com/company/5-letter-word-finder-tool" target="_blank" rel="noopener noreferrer" class="icon" aria-label="Follow us on LinkedIn">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.18-3.46c-1.34 0-1.94.75-2.28 1.25V9.43h-2.58v9.07h2.58v-4.57c0-1.21.23-2.39 1.74-2.39 1.49 0 1.5 1.39 1.5 2.47v4.56h2.22zM6.6 8.35c.83 0 1.5-.68 1.5-1.5 0-.83-.67-1.5-1.5-1.5S5.1 6.02 5.1 6.85c0 .82.67 1.5 1.5 1.5zM5.3 18.5h2.58V9.43H5.3v9.07z"/></svg>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61590811286427" target="_blank" rel="noopener noreferrer" class="icon" aria-label="Follow us on Facebook">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54V12h2.54V9.79c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.95h-2.33v7C18.34 21.19 22 17.04 22 12.06c0-5.53-4.5-10.02-10-10.02z"/></svg>
                        </a>
                        <a href="https://www.pinterest.com/5letterwordfindertool/" target="_blank" rel="noopener noreferrer" class="icon" aria-label="Follow us on Pinterest">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/></svg>
                        </a>
                        <a href="https://x.com/5letterwordfind" target="_blank" rel="noopener noreferrer" class="icon" aria-label="Follow us on X (Twitter)">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                    </div>
                </div>

                <!-- 2. QUICK LINKS -->
                <div class="footer-col">
                    <h3 class="footer-heading">Quick Links</h3>
                    <ul class="footer-links-list">
                        <li><a href="/">Home</a></li>
                        <li><a href="ai-word-solver">AI Word Solver</a></li>
                        <li><a href="3-letter-word-finder.html">3 Letter Word Finder</a></li>
                        <li><a href="4-letter-word-finder.html">4 Letter Word Finder</a></li>
                        <li><a href="6-letter-word-finder.html">6 Letter Word Finder</a></li>
                        <li><a href="7-letter-word-finder.html">7 Letter Word Finder</a></li>
                        <li><a href="8-letter-word-finder.html">8 Letter Word Finder</a></li>
                    </ul>
                </div>

                <!-- 3. RESOURCES -->
                <div class="footer-col">
                    <h3 class="footer-heading">Resources</h3>
                    <ul class="footer-links-list">
                        <li><a href="5-letter-words-starting-with-a.html">5 Letter Words Starting with A</a></li>
                        <li><a href="5-letter-words-ending-with-e.html">5 Letter Words Ending with E</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="contact.html">Contact</a></li>
                        <li><a href="privacy.html">Privacy Policy</a></li>
                    </ul>
                </div>

                <!-- 4. CTA / TRUST -->
                <div class="footer-col cta-col">
                    <h3 class="footer-heading">Level Up Your Game</h3>
                    <p class="footer-trust-text">Helping players solve word puzzles faster.</p>
                    <a href="/#tool-section" class="btn-footer-cta">Try Word Finder</a>
                </div>
            </div>
            
            <div class="footer-bottom-bar">
                <p>&copy; 2026 Word Finder Tool. All rights reserved.</p>
                <p class="footer-editorial-line">Word lists are cross-referenced with standard 5-letter English word game and dictionary datasets. Learn more on our <a href="about.html" style="color: var(--text-muted); text-decoration: underline;">About Us</a> page.</p>
            </div>
        </div>
    </footer>

    <div class="toast" id="toast"></div>

    <script src="./words.js" defer></script>
    <script src="./script.js" defer></script>
</body>

</html>




```

---

## 4. TOOL LOGIC & DATASET SUMMARY

### Tool Logic (`script.js`)

```javascript
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
        resultsCount.textContent = `${activeList ? activeList.length.toLocaleString() : '2,309'} words available`;
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


```

### Word List Datasets Inventory

- `words.js`: 1,413.29 KB (Contains global JavaScript array `WORDS` with 148,736 entries for client-side search filtering).
- `data/wordle-common.json`: 20.76 KB (2,656 words - curated common Wordle solutions).
- `data/wordle.json`: 31.66 KB (2,315 words - full valid Wordle answer list).
- `data/scrabble.json`: 217.67 KB (15,921 words - tournament Scrabble 5-letter list).
- `data/3.json`: 24.97 KB (2,130 words - 3-letter dictionary).
- `data/4.json`: 91.23 KB (7,186 words - 4-letter dictionary).
- `data/6.json`: 437.61 KB (29,874 words - 6-letter dictionary).
- `data/7.json`: 656.22 KB (41,998 words - 7-letter dictionary).
- `data/8.json`: 857.09 KB (51,627 words - 8-letter dictionary).
- `words_alpha.txt`: 4,135.65 KB (370,106 words - English language raw wordlist source).

---

## 5. ROBOTS.TXT

```text
User-agent: *
Allow: /

Sitemap: https://www.5letterwordfindertool.com/sitemap.xml

```

---

## 6. SITEMAP.XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.5letterwordfindertool.com/3-letter-word-finder.html</loc>
    <lastmod>2026-06-03</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/4-letter-word-finder.html</loc>
    <lastmod>2026-06-03</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-a.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-b.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-c.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-d.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-e.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-f.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-g.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-h.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-i.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-j.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-k.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-l.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-m.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-n.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-o.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-p.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-q.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-r.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-s.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-t.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-u.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-v.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-w.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-x.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-y.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-ending-with-z.html</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-a.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-b.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-c.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-d.html</loc>
    <lastmod>2026-06-07</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-e.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-f.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-g.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-h.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-i.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-j.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-k.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-l.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-m.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-n.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-o.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-p.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-q.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-r.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-s.html</loc>
    <lastmod>2026-06-03</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-t.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-u.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-v.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-w.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-x.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-y.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/5-letter-words-starting-with-z.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/6-letter-word-finder.html</loc>
    <lastmod>2026-06-03</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/7-letter-word-finder.html</loc>
    <lastmod>2026-06-03</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/8-letter-word-finder.html</loc>
    <lastmod>2026-06-03</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/about.html</loc>
    <lastmod>2026-05-10</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/contact.html</loc>
    <lastmod>2026-05-10</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/game.html</loc>
    <lastmod>2026-05-10</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/</loc>
    <lastmod>2026-06-03</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/privacy.html</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://www.5letterwordfindertool.com/ai-word-solver</loc>
    <lastmod>2026-07-24</lastmod>
  </url>
</urlset>


```

---

## 7. REDIRECTS & DOMAIN CONFIGURATION (`vercel.json`)

```json
{
  "rewrites": [
    {
      "source": "/ai-word-solver",
      "destination": "/ai-word-solver.html"
    }
  ],
  "redirects": [
    {
      "source": "/5-letter-word-finder.html",
      "destination": "/",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}

```

### URL Normalization & Redirect Strategy:
- **Canonical Domain:** `https://www.5letterwordfindertool.com/`
- **Domain Redirects:** All requests to `5letterwordfindertool.com` (non-www) return a `301 Moved Permanently` to `https://www.5letterwordfindertool.com/$1`.
- **Protocol Redirects:** Vercel automatically forces HTTP requests to HTTPS with `301 Moved Permanently`.
- **Trailing Slashes:** Standard clean relative link structure across all `.html` pages.

---

## 8. PROGRAMMATIC TEMPLATE GENERATION (`build-programmatic-seo.js`)

The project uses `build-programmatic-seo.js` to automatically generate targeted programmatic letter pages across word lengths (3-8 letters, A-Z). Below is the core generator logic:

```javascript
const fs = require('fs');
const path = require('path');

// 1. Load word dictionary
const wordsAlphaPath = path.join(__dirname, 'words_alpha.txt');
const allWords = fs.readFileSync(wordsAlphaPath, 'utf8')
    .split(/\r?\n/)
    .map(w => w.trim().toLowerCase())
    .filter(w => w.length > 0);

console.log(`Loaded total dictionary words: ${allWords.length}`);

// Common high-frequency Wordle / Scrabble openers & priority words for better curation
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

function getCrated5LetterWords(filterFn, maxCount = 150) {
    const matching = allWords.filter(w => w.length === 5 && filterFn(w));
    // Sort priority openers first, then alphabetical
    matching.sort((a, b) => {
        const aPri = priorityOpeners.has(a) ? 1 : 0;
        const bPri = priorityOpeners.has(b) ? 1 : 0;
        if (aPri !== bPri) return bPri - aPri;
        return a.localeCompare(b);
    });
    return matching.slice(0, maxCount);
}

// 2. Build pre-rendered word grid HTML
function renderStaticWordGrid(words) {
    if (!words || words.length === 0) {
        return '<p class="text-muted" style="grid-column: 1/-1; text-align: center;">No words found.</p>';
    }
    return words.map(w => `                        <div class="word-item">${w.toUpperCase()}</div>`).join('\n');
}

// 3. Process 26 Starting Letter Pages (5-letter-words-starting-with-a.html to z.html)
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
let updatedStartingCount = 0;

for (const letter of letters) {
    const fileName = `5-letter-words-starting-with-${letter}.html`;
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Get top curated words starting with letter
    const matchingWords = getCrated5LetterWords(w => w.startsWith(letter), 150);
    const gridHtml = renderStaticWordGrid(matchingWords);

    // Conditional transparency disclaimer
    let disclaimerHtml = '';
    if (matchingWords.length === 150) {
        disclaimerHtml = '\n                    <p class="text-muted" style="margin-top: 1rem; font-size: 0.9rem; text-align: center;">Showing 150 words from our dictionary list. Use the Word Finder tool above to explore more matching words.</p>';
    } else if (matchingWords.length > 0) {
        disclaimerHtml = `\n                    <p class="text-muted" style="margin-top: 1rem; font-size: 0.9rem; text-align: center;">Showing all ${matchingWords.length} matching words from our dictionary list.</p>`;
    }

    // Remove any previously injected disclaimer notice
    content = content.replace(/\s*<p class="text-muted" style="margin-top: 1rem; font-size: 0\.9rem; text-align: center;">[\s\S]*?<\/p>/g, '');

    // Match exact wordGrid container cleanly
    const wordGridRegex = /<div id="wordGrid" class="word-grid">[\s\S]*?<\/div>(?=\s*(?:<h3>|<h2|<section|<\/div>|\$))/;
    if (wordGridRegex.test(content)) {
        content = content.replace(wordGridRegex, `<div id="wordGrid" class="word-grid">\n${gridHtml}\n                    </div>${disclaimerHtml}`);
    }

    // Ensure self-referential canonical URL
    const canonicalUrl = `https://www.5letterwordfindertool.com/5-letter-words-starting-with-${letter}.html`;
    const canonicalRegex = /<link rel="canonical" href="[^"]*">/;
    if (canonicalRegex.test(content)) {
        content = content.replace(canonicalRegex, `<link rel="canonical" href="${canonicalUrl}">`);
    } else {
        content = content.replace('</head>', `    <link rel="canonical" href="${canonicalUrl}">\n</head>`);
    }

    // Ensure robots index, follow
    if (!content.includes('name="robots"')) {
        content = content.replace('</head>', `    <meta name="robots" content="index, follow">\n</head>`);
    }

    // Remove client-side DOMContentLoaded overwrite for wordGrid to prevent layout shift & preserve pre-rendered HTML
    content = content.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/gi, '');

    fs.writeFileSync(filePath, content, 'utf8');
    updatedStartingCount++;
}

console.log(`Updated ${updatedStartingCount} starting letter pages with static HTML word grids.`);

// 4. Process 26 Ending Letter Pages (e.g., e, s, t, y, z...)
let updatedEndingCount = 0;

for (const letter of letters) {
    const fileName = `5-letter-words-ending-with-${letter}.html`;
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Get top curated words ending with letter
    const matchingWords = getCrated5LetterWords(w => w.endsWith(letter), 150);

    // Conditional transparency disclaimer
    let disclaimerHtml = '';
    if (matchingWords.length === 150) {
        disclaimerHtml = '\n                    <p class="text-muted" style="margin-top: 1rem; font-size: 0.9rem; text-align: center;">Showing 150 words from our dictionary list. Use the Word Finder tool above to explore more matching words.</p>';
    } else if (matchingWords.length > 0) {
        disclaimerHtml = `\n                    <p class="text-muted" style="margin-top: 1rem; font-size: 0.9rem; text-align: center;">Showing all ${matchingWords.length} matching words from our dictionary list.</p>`;
    }

    // Remove any previously injected disclaimer notice
    content = content.replace(/\s*<p class="text-muted" style="margin-top: 1rem; font-size: 0\.9rem; text-align: center;">[\s\S]*?<\/p>/g, '');

    // For ending letter pages, insert disclaimer right after closing .info-content container or before .seo-guide-section
    if (content.includes('</section>') && !content.includes(disclaimerHtml)) {
        content = content.replace(/(<section class="seo-guide-section" style="margin-top: 4rem;">)/, `${disclaimerHtml}\n\n            $1`);
    }

    const canonicalUrl = `https://www.5letterwordfindertool.com/5-letter-words-ending-with-${letter}.html`;
    const canonicalRegex = /<link rel="canonical" href="[^"]*">/;
    if (canonicalRegex.test(content)) {
        content = content.replace(canonicalRegex, `<link rel="canonical" href="${canonicalUrl}">`);
    }

    if (!content.includes('name="robots"')) {
        content = content.replace('</head>', `    <meta name="robots" content="index, follow">\n</head>`);
    }

    content = content.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/gi, '');

    fs.writeFileSync(filePath, content, 'utf8');
    updatedEndingCount++;
}

console.log(`Updated ${updatedEndingCount} ending letter pages with static HTML word grids.`);

// 5. Verify & Update Canonical and Meta for AI Word Solver (ai-word-solver.html)
const aiSolverPath = path.join(__dirname, 'ai-word-solver.html');
if (fs.existsSync(aiSolverPath)) {
    let aiContent = fs.readFileSync(aiSolverPath, 'utf8');
    const aiCanonical = `https://www.5letterwordfindertool.com/ai-word-solver`;
    
    aiContent = aiContent.replace(
        /<link rel="canonical" href="[^"]*">/,
        `<link rel="canonical" href="${aiCanonical}">`
    );

    if (!aiContent.includes('name="robots"')) {
        aiContent = aiContent.replace('</head>', `    <meta name="robots" content="index, follow">\n</head>`);
    }

    fs.writeFileSync(aiSolverPath, aiContent, 'utf8');
    console.log(`Updated ai-word-solver.html canonical and indexability rules.`);
}

console.log("Programmatic SEO Pre-rendering Build Complete!");

```

---

## 9. HOSTING & PRODUCTION ENVIRONMENT

- **Production URL:** `https://www.5letterwordfindertool.com/`
- **Hosting Platform:** Vercel
- **Deployment Branch:** `main` (auto-deploys via git push)

---

## 10. THIRD-PARTY SERVICES & ANALYTICS INVENTORY

The site loads the following 3rd-party scripts and resources:

1. **Google Tag Manager (GA4):**
   - Stream ID: `G-WW6EJYTTML`
   - Script URL: `https://www.googletagmanager.com/gtag/js?id=G-WW6EJYTTML`
   - Purpose: Web analytics & user tracking.

2. **Microsoft Clarity:**
   - Project ID: `pxv43j2o89`
   - Script URL: `https://www.clarity.ms/tag/pxv43j2o89`
   - Purpose: Heatmaps, session recordings, UX analytics.

3. **Google Fonts:**
   - URL: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`
   - Preconnect domains: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`
   - Purpose: Typography styling (Inter font family).
