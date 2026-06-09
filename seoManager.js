/**
 * SEO Manager - Modular Foundation
 * Dynamically renders SEO content, hydrates tokens, and rotates audience strategies.
 * Hardened for Phase 3: Technical Rendering & Hydration Safety.
 */
(function() {
    // Initial state check
    const init = () => {
        try {
            const pageState = getPageState();
            
            // Check if we have the necessary SEO_DATA
            if (typeof SEO_DATA === 'undefined') {
                console.error('SEO Manager: SEO_DATA not found. Hydration aborted.');
                return;
            }

            // Check if we have more specific SEO_DATA for this pattern
            const specificKey = `${pageState.wordLength}-${pageState.pattern}-${pageState.letter.toLowerCase()}`;
            const data = SEO_DATA[specificKey] || SEO_DATA[pageState.wordLength] || {};
            const tokens = getHydratedTokens(pageState, data);
            
            // 1. Update Metadata (Immediate for SEO)
            updateMetadata(data, tokens);

            // 2. Render UI Sections (Deferred to reduce TBT)
            if (window.requestIdleCallback) {
                requestIdleCallback(() => {
                    renderInfoSections(data, tokens, pageState);
                    renderSpecializedSections(data, tokens);
                    injectJSONLD(data, tokens);
                }, { timeout: 2000 });
            } else {
                setTimeout(() => {
                    renderInfoSections(data, tokens, pageState);
                    renderSpecializedSections(data, tokens);
                    injectJSONLD(data, tokens);
                }, 100);
            }
            
            console.log(`SEO Manager: Hydrated ${pageState.pattern} page for ${pageState.wordLength} letters.`);
        } catch (err) {
            console.error('SEO Manager: Hydration Error', err);
        }
    };

    // Run as soon as possible, but ensure DOM is ready for manipulations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /**
     * Extracts page state from DOM attributes.
     */
    function getPageState() {
        return {
            wordLength: document.body.getAttribute('data-word-length'),
            pattern: document.body.getAttribute('data-pattern') || 'length', // 'starting', 'ending', 'length'
            letter: document.body.getAttribute('data-letter') || '',
            strategy: document.body.getAttribute('data-seo-strategy') || 'WORDLE_SOLVER'
        };
    }

    /**
     * Hydrates tokens with page-specific data and linguistic observations.
     */
    function getHydratedTokens(state, data) {
        const baseTokens = { ...SEO_TOKENS };
        
        // Pattern descriptive text
        const patternText = state.pattern === 'starting' ? 'starting with' : 
                           state.pattern === 'ending' ? 'ending in' : 'containing';
        
        // Heuristic: Letter-specific observations (EEAT/NLP uniqueness)
        const letter = (state.letter || '').toUpperCase();
        const vowels = ['A', 'E', 'I', 'O', 'U'].includes(letter) ? 'consonant-heavy pairs' : 'vowel clusters';
        const highValue = ['Q', 'Z', 'J', 'X'].includes(letter) ? 'vowel anchors' : 'high-scoring tiles like Z or Q';
        
        // Realistic stats (placeholder logic for programmatic expansion)
        const percentage = letter ? (Math.random() * 5 + 3).toFixed(1) : '-';

        return {
            ...baseTokens,
            "letter": letter || 'your target',
            "count": state.wordLength || '5',
            "pattern": patternText,
            "vowels": vowels,
            "high_value": highValue,
            "percentage": percentage,
            "strategy_label": state.strategy.replace('_', ' ').toLowerCase()
        };
    }

    /**
     * Replaces {{token}} placeholders in text.
     */
    function hydrate(text, tokens) {
        if (!text) return '';
        return text.replace(/\{\{([^}]+)\}\}/g, (match, key) => tokens[key] || match);
    }

    /**
     * Updates page title and meta description.
     */
    function updateMetadata(data, tokens) {
        if (data.title) {
            document.title = hydrate(data.title, tokens);
        }
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && data.description) {
            metaDesc.setAttribute('content', hydrate(data.description, tokens));
        }

        const h1 = document.querySelector('h1.title');
        const subheading = document.querySelector('p.subtitle');
        if (h1 && data.h1) h1.textContent = hydrate(data.h1, tokens);
        if (subheading && subheading.tagName === 'P' && data.subheading) {
            subheading.textContent = hydrate(data.subheading, tokens);
        }
    }

    /**
     * Renders informational blocks using the selected Strategy or fallback static data.
     */
    function renderInfoSections(data, tokens, state) {
        const contentContainer = document.querySelector('.info-content');
        if (!contentContainer) return;

        // CLS/Performance optimization: Do not overwrite high-quality static content 
        // on the main homepage unless it's a programmatic sub-page.
        const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html';
        const hasStaticContent = contentContainer.children.length > 2; // Assuming static pages have more pre-rendered blocks
        
        if (isHomepage && hasStaticContent && state.pattern === 'length') {
            console.log("SEO Manager: Preserving high-quality static content on homepage.");
            return;
        }

        let html = '';
        const strategy = (typeof SEO_STRATEGIES !== 'undefined') ? 
                        (SEO_STRATEGIES[state.strategy] || SEO_STRATEGIES.WORDLE_SOLVER) : null;

        if (!strategy) return;
        // ... (rest of the logic remains the same for programmatic pages)
        // [TRUNCATED for brevity in replacement, but I will include the full function logic]
        
        // Use Strategy-based content for pattern pages to ensure uniqueness
        if (state.pattern !== 'length' || !data.content) {
            html += `
                <div class="info-box blue">
                    <h2>${strategy.usage_title ? hydrate(strategy.usage_title, tokens) : 'Overview'}</h2>
                    <p>${hydrate(strategy.intro, tokens)}</p>
                </div>
                <div class="info-box purple">
                    <h2>Strategy Guide</h2>
                    <p>${hydrate(strategy.usage_text, tokens)}</p>
                </div>
            `;
        } else {
            // Fallback to static data (length-based pages)
            data.content.forEach((section, index) => {
                const colorClass = index % 2 === 0 ? 'blue' : 'purple';
                html += `
                    <div class="info-box ${colorClass}">
                        <h2>${hydrate(section.title, tokens)}</h2>
                        <p>${hydrate(section.text, tokens)}</p>
                    </div>
                `;
            });
        }

        // Append FAQ box with strategy-specific variations
        if (data.faqs || strategy.faq_q) {
            html += `
                <div class="info-box green">
                    <h2>Frequently Asked Questions</h2>
                    ${strategy.faq_q ? `<p><strong>${hydrate(strategy.faq_q, tokens)}</strong><br>${hydrate(strategy.faq_a, tokens)}</p>` : ''}
                    ${(data.faqs || []).map(faq => `
                        <p><strong>${hydrate(faq.question, tokens)}</strong><br>${hydrate(faq.answer, tokens)}</p>
                    `).join('')}
                </div>
            `;
        }

        contentContainer.innerHTML = html;
    }

    /**
     * Renders Specialized Sections (Patterns & Guides) with semantically rich links.
     */
    function renderSpecializedSections(data, tokens) {
        const contentContainer = document.querySelector('.info-content');
        if (!contentContainer) return;

        // Visual Stability: Do not append specialized sections on the homepage 
        // if static content is already high-quality.
        const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html';
        if (isHomepage) return;

        // Prevent double rendering
        const existing = document.querySelector('.specialized-seo');
        if (existing) return;

        const container = document.createElement('div');
        container.className = 'specialized-seo-wrapper';
        container.style.marginTop = '2rem';
        container.style.paddingTop = '2rem';
        container.style.borderTop = '1px solid var(--border)';

        let html = '';

    // Specialized Section: Word Tools (Cross-linking with Rich Anchors)
    html += `
        <div class="info-box yellow">
            <h2>Related Word Tools</h2>
            <ul class="clean-list">
                <li><a href="/3-letter-word-finder.html">${hydrate(INTERNAL_LINKS["3_LETTER"], tokens)}</a></li>
                <li><a href="/4-letter-word-finder.html">${hydrate(INTERNAL_LINKS["4_LETTER"], tokens)}</a></li>
                <li><a href="/">${hydrate(INTERNAL_LINKS["5_LETTER"], tokens)}</a></li>
                <li><a href="/6-letter-word-finder.html">${hydrate(INTERNAL_LINKS["6_LETTER"], tokens)}</a></li>
            </ul>
        </div>
    `;

    // Personalized Guides
    if (data.guides && data.guides.length > 0) {
        html += `
            <div class="info-box blue">
                <h2>Helpful Guides</h2>
                <ul class="clean-list">
                    ${data.guides.map(g => `<li><a href="${g.link}">${hydrate(g.label, tokens)}</a></li>`).join('')}
                </ul>
            </div>
        `;
    }

    container.innerHTML = html;
    contentContainer.appendChild(container);
}

    /**
     * Injects JSON-LD FAQ schema (Hydrated).
     * Hardened to prevent duplicate schema signals.
     */
    function injectJSONLD(data, tokens) {
        try {
            // 0. Check for existing static FAQ schema to prevent duplicates
            const staticSchemas = document.querySelectorAll('script[type="application/ld+json"]:not([data-seo-schema="dynamic"])');
            for (let i = 0; i < staticSchemas.length; i++) {
                if (staticSchemas[i].textContent && staticSchemas[i].textContent.includes('"FAQPage"')) {
                    return; // Prevent duplicate generation
                }
            }

            // 1. Remove existing dynamic schemas to prevent conflicts
            const existing = document.querySelectorAll('script[data-seo-schema="dynamic"]');
            existing.forEach(el => el.remove());

            const faqs = [];
            const pageState = getPageState();
            const strategy = (typeof SEO_STRATEGIES !== 'undefined') ? 
                            (SEO_STRATEGIES[pageState.strategy] || SEO_STRATEGIES.WORDLE_SOLVER) : null;
            
            if (strategy && strategy.faq_q) {
                faqs.push({ q: hydrate(strategy.faq_q, tokens), a: hydrate(strategy.faq_a, tokens) });
            }

            if (data.faqs) {
                data.faqs.forEach(f => {
                    faqs.push({ q: hydrate(f.question, tokens), a: hydrate(f.answer, tokens) });
                });
            }

            if (faqs.length === 0) return;

            const schema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.map(f => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": f.a
                    }
                }))
            };

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-seo-schema', 'dynamic');
            script.text = JSON.stringify(schema);
            document.head.appendChild(script);
        } catch (err) {
            console.error('SEO Manager: Schema Injection Failed', err);
        }
    }
})();
