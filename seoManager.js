/**
 * SEO Manager
 * Dynamically renders SEO content and updates metadata based on page context.
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
    const contentContainer = document.querySelector('.info-content');
    if (contentContainer) {
        let html = '';
        
        // Loop through content sections
        data.content.forEach((section, index) => {
            const colorClass = index % 2 === 0 ? 'blue' : 'purple';
            html += `
                <div class="info-box ${colorClass}">
                    <h2>${section.title}</h2>
                    <p>${section.text}</p>
                </div>
            `;
        });

        // Add FAQ section if container exists and data has FAQs
        if (data.faqs && data.faqs.length > 0) {
            html += `
                <div class="info-box blue">
                    <h2>FAQ</h2>
                    ${data.faqs.map(faq => `
                        <p><strong>${faq.q}</strong><br>${faq.a}</p>
                    `).join('')}
                </div>
            `;
        }

        contentContainer.innerHTML = html;
    }
});
