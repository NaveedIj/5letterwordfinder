/**
 * SEO Manager
 * Dynamically renders SEO content, updates metadata, and injects Schema.
 */
document.addEventListener('DOMContentLoaded', () => {
    const wordLength = document.body.getAttribute('data-word-length');
    if (!wordLength || !SEO_DATA[wordLength]) {
        console.warn('SEO Manager: No SEO data found for word length:', wordLength);
        return;
    }

    const data = SEO_DATA[wordLength];

    // 1. Update Metadata
    document.title = data.title;
    
    // Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', data.description);
    }

    // 2. Update H1 and Subheading
    const h1 = document.querySelector('h1.title');
    const subheading = document.querySelector('p.subtitle');
    
    if (h1) h1.textContent = data.h1;
    if (subheading) subheading.textContent = data.subheading;

    // 3. Render Content Boxes
    renderInfoSections(data);
    
    // 4. Render Specialized Sections (Patterns & Guides)
    renderSpecializedSections(data);

    // 5. Inject JSON-LD Schema
    injectJSONLD(data);
});

/**
 * Renders the main informational content boxes.
 */
function renderInfoSections(data) {
    const contentContainer = document.querySelector('.info-content');
    if (!contentContainer) return;

    let html = '';
    
    // Render content sections with alternating colors
    data.content.forEach((section, index) => {
        const colorClass = index % 2 === 0 ? 'blue' : 'purple';
        html += `
            <div class="info-box ${colorClass}">
                <h2>${section.title}</h2>
                <p>${section.text}</p>
            </div>
        `;
    });

    // Append FAQ box if data exists
    if (data.faqs && data.faqs.length > 0) {
        html += `
            <div class="info-box green">
                <h2>FAQ</h2>
                ${data.faqs.map(faq => `
                    <p><strong>${faq.question}</strong><br>${faq.answer}</p>
                `).join('')}
            </div>
        `;
    }

    contentContainer.innerHTML = html;
}

/**
 * Renders Popular Patterns and Helpful Guides sections using existing CSS.
 */
function renderSpecializedSections(data) {
    const infoSection = document.querySelector('.info-section');
    if (!infoSection) return;

    const specializedContainer = document.createElement('div');
    specializedContainer.className = 'info-content mt-6'; // Reuses existing grid
    specializedContainer.style.marginTop = '4rem';

    let html = '';

    // Specialized Section 1: Popular Patterns
    if (data.patterns && data.patterns.length > 0) {
        html += `
            <div class="info-box yellow">
                <h2>Popular Patterns</h2>
                <ul class="clean-list">
                    ${data.patterns.map(p => `
                        <li><a href="${p.query}" style="color: inherit; text-decoration: none;">${p.label}</a></li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    // Specialized Section 2: Helpful Guides
    if (data.guides && data.guides.length > 0) {
        html += `
            <div class="info-box blue">
                <h2>Helpful Guides</h2>
                <ul class="clean-list">
                    ${data.guides.map(g => `
                        <li><a href="${g.link}" style="color: inherit; text-decoration: none;">${g.label}</a></li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    // Specialized Section 3: Word Tools (Cross-linking)
    html += `
        <div class="info-box purple">
            <h2>Word Tools</h2>
            <ul class="clean-list">
                <li><a href="/" style="color: inherit; text-decoration: none;">5 Letter Word Finder</a></li>
                <li><a href="4-letter-word-finder.html" style="color: inherit; text-decoration: none;">4 Letter Word Finder</a></li>
                <li><a href="6-letter-word-finder.html" style="color: inherit; text-decoration: none;">6 Letter Word Finder</a></li>
                <li><a href="7-letter-word-finder.html" style="color: inherit; text-decoration: none;">7 Letter Word Finder</a></li>
            </ul>
        </div>
    `;

    specializedContainer.innerHTML = html;
    infoSection.appendChild(specializedContainer);
}

/**
 * Injects JSON-LD FAQ and WebApplication schema.
 */
function injectJSONLD(data) {
    // FAQ Schema
    if (data.faqs && data.faqs.length > 0) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": data.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(faqSchema);
        document.head.appendChild(script);
    }
}
