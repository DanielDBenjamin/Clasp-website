// Content loader for static site
(function() {
    'use strict';

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Content files to load
    const contentFiles = [
        'content/hero.json',
        'content/about.json',
        'content/services.json',
        'content/contact.json'
    ];

    // Load all content files
    async function loadContent() {
        const contentPromises = contentFiles.map(file => 
            fetch(file)
                .then(response => {
                    if (!response.ok) {
                        console.warn(`Failed to load ${file}`);
                        return null;
                    }
                    return response.json();
                })
                .catch(error => {
                    console.warn(`Error loading ${file}:`, error);
                    return null;
                })
        );

        const contents = await Promise.all(contentPromises);
        
        // Map content to objects
        const content = {
            hero: contents[0] || {},
            about: contents[1] || {},
            services: contents[2] || {},
            contact: contents[3] || {}
        };

        // Populate the page with content
        populateContent(content);
    }

    // Populate content into DOM
    function populateContent(content) {
        // Hero section
        if (content.hero) {
            setTextContent('.hero-headline', content.hero.headline);
            setTextContent('.hero-subline', content.hero.subline);
            setTextContent('.hero-cta', content.hero.cta_text);
            if (content.hero.cta_url) {
                const ctaLink = document.querySelector('.hero-cta');
                if (ctaLink) {
                    ctaLink.href = content.hero.cta_url;
                }
            }
        }

        // About section
        if (content.about) {
            setTextContent('[data-content="about.title"]', content.about.title);
            setTextContent('.about-description', content.about.description);
            setTextContent('.nav-brand', content.about.company_name);
            setTextContent('[data-content="about.company_name"]', content.about.company_name);
            
            // Set about image if provided
            if (content.about.image) {
                const imageContainer = document.querySelector('[data-image="about.image"]');
                if (imageContainer && !imageContainer.querySelector('img')) {
                    const img = document.createElement('img');
                    img.src = content.about.image;
                    img.alt = content.about.title || 'About us';
                    imageContainer.appendChild(img);
                }
            }
        }

        // Services section
        if (content.services && content.services.items && Array.isArray(content.services.items)) {
            const servicesGrid = document.querySelector('.services-grid');
            if (servicesGrid) {
                servicesGrid.innerHTML = '';
                content.services.items.forEach(service => {
                    const card = createServiceCard(service);
                    servicesGrid.appendChild(card);
                });
            }
        }
        if (content.services && content.services.title) {
            setTextContent('[data-content="services.title"]', content.services.title);
        }

        // Contact section
        if (content.contact) {
            if (content.contact.title) {
                setTextContent('[data-content="contact.title"]', content.contact.title);
            }
            setTextContent('[data-content="contact.email"]', content.contact.email);
            setTextContent('[data-content="contact.phone"]', content.contact.phone);
            setTextContent('[data-content="contact.address"]', content.contact.address);

            // Social links
            if (content.contact.social && Array.isArray(content.contact.social)) {
                const socialContainer = document.querySelector('.social-links');
                if (socialContainer) {
                    socialContainer.innerHTML = '';
                    content.contact.social.forEach(link => {
                        const socialLink = document.createElement('a');
                        socialLink.href = link.url;
                        socialLink.textContent = link.name;
                        socialLink.className = 'social-link';
                        socialLink.target = '_blank';
                        socialLink.rel = 'noopener noreferrer';
                        socialContainer.appendChild(socialLink);
                    });
                }
            }
        }
    }

    // Helper function to set text content
    function setTextContent(selector, text) {
        if (!text) return;
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }

    // Create a service card element
    function createServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'service-card';

        const icon = document.createElement('div');
        icon.className = 'service-icon';
        icon.textContent = service.icon || '⚡';
        card.appendChild(icon);

        const title = document.createElement('h3');
        title.className = 'service-title';
        title.textContent = service.title || '';
        card.appendChild(title);

        const description = document.createElement('p');
        description.className = 'service-description';
        description.textContent = service.description || '';
        card.appendChild(description);

        return card;
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Load content when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadContent);
    } else {
        loadContent();
    }
})();
