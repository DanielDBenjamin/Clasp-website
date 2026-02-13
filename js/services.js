// Populate the Services page from content/services.json
(async function initServicesPage() {
  try {
    const response = await fetch('/content/services.json');
    if (!response.ok) {
      console.error('Failed to load services.json');
      return;
    }

    const services = await response.json();

    // Hero section
    const badgeEl = document.getElementById('services-badge');
    if (badgeEl && services.sectionLabel) {
      badgeEl.textContent = `⚡ ${services.sectionLabel}`;
    }

    const headlineEl = document.getElementById('services-headline');
    if (headlineEl && services.heading) {
      headlineEl.textContent = services.heading;
    }

    const descEl = document.getElementById('services-description');
    if (descEl && services.description) {
      descEl.textContent = services.description;
    }

    // Stats grid
    const statsGrid = document.getElementById('services-stats-grid');
    if (statsGrid && Array.isArray(services.stats)) {
      statsGrid.innerHTML = services.stats.map(stat => `
        <div class="stat-card">
          <div class="stat-number">${stat.number}</div>
          <div class="stat-label">${stat.label}</div>
        </div>
      `).join('');
    }

    // Services grid
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid && Array.isArray(services.services)) {
      servicesGrid.innerHTML = services.services.map(service => `
        <div class="card">
          <div class="card-content">
            <span class="icon">${service.icon || '🛡️'}</span>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error initializing Services page:', err);
  }
})();
