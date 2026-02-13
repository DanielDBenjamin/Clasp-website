// Load all content files
async function loadContent() {
    try {
      const [hero, services, about, contact] = await Promise.all([
        fetch('/content/hero.json').then(r => r.json()),
        fetch('/content/services.json').then(r => r.json()),
        fetch('/content/about.json').then(r => r.json()),
        fetch('/content/contact.json').then(r => r.json())
      ]);
      
      return { hero, services, about, contact };
    } catch (error) {
      console.error('Error loading content:', error);
      return null;
    }
  }
  
  // Populate hero section
  function populateHero(hero) {
    const badge = document.querySelector('.hero-badge');
    const headline = document.querySelector('.hero h1');
    const subheadline = document.querySelector('.hero p');
    const ctaBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');
    
    if (badge) badge.textContent = hero.badge;
    if (headline) {
      const parts = hero.headline.split(' ');
      const lastTwo = parts.slice(-2).join(' ');
      const rest = parts.slice(0, -2).join(' ');
      headline.innerHTML = `${rest} <span class="highlight">${lastTwo}</span>`;
    }
    if (subheadline) subheadline.textContent = hero.subheadline;
    if (ctaBtn) {
      ctaBtn.textContent = hero.ctaText;
      ctaBtn.href = hero.ctaLink;
    }
    if (secondaryBtn) {
      secondaryBtn.textContent = hero.secondaryCtaText;
      secondaryBtn.href = hero.secondaryCtaLink;
    }
  }
  
  // Populate stats
  function populateStats(stats) {
    const statsGrid = document.getElementById('stats-grid');
    if (!statsGrid) return;
    
    statsGrid.innerHTML = stats.map(stat => `
      <div class="stat-card">
        <div class="stat-number">${stat.number}</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `).join('');
  }
  
  // Populate services
  function populateServices(data) {
    const sectionLabel = document.querySelector('#services .section-label');
    const sectionHeading = document.querySelector('#services h2');
    const sectionDesc = document.querySelector('#services .section-header p');
    const servicesGrid = document.getElementById('services-grid');
    
    if (sectionLabel) sectionLabel.textContent = data.sectionLabel;
    if (sectionHeading) sectionHeading.textContent = data.heading;
    if (sectionDesc) sectionDesc.textContent = data.description;
    
    if (servicesGrid) {
      servicesGrid.innerHTML = data.services.map(service => `
        <div class="card">
          <div class="card-content">
            <span class="icon">${service.icon}</span>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
          </div>
        </div>
      `).join('');
    }
  }
  
  // Populate contact section
  function populateContact(contact) {
    const headline = document.querySelector('#contact h2');
    const description = document.querySelector('#contact .section-header p');
    
    if (headline) headline.textContent = contact.headline;
    if (description) description.textContent = contact.description;
  }
  
  // Initialize smooth scrolling
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
  
  // Initialize contact form
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      console.log('Security assessment request:', data);
      
      const btn = form.querySelector('.btn-primary');
      const originalText = btn.textContent;
      btn.textContent = '✓ Request Submitted!';
      btn.style.background = 'var(--color-secondary)';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }
  
  // Initialize scroll animations
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  
    setTimeout(() => {
      document.querySelectorAll('.card, .stat-card').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }
  
  // Initialize everything
  document.addEventListener('DOMContentLoaded', async () => {
    const content = await loadContent();
    
    if (content) {
      populateHero(content.hero);
      populateStats(content.services.stats);
      populateServices(content.services);
      populateContact(content.contact);
    }
    
    initSmoothScroll();
    initContactForm();
    initScrollAnimations();
  });