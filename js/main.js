// Load a single JSON content file
async function loadJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error('Failed to load ' + path);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Populate hero section (text only — links stay as defined in HTML)
function populateHero(hero) {
  if (!hero) return;

  const section = document.querySelector('.hero');
  if (!section) return;

  const badge = section.querySelector('.hero-badge');
  const headline = section.querySelector('h1');
  const subheadline = section.querySelector('.hero-content > p');

  if (badge) badge.textContent = hero.badge;
  if (headline) {
    const words = hero.headline.split(' ');
    const highlighted = words.slice(-2).join(' ');
    const rest = words.slice(0, -2).join(' ');
    headline.innerHTML = rest + ' <span class="highlight">' + highlighted + '</span>';
  }
  if (subheadline) subheadline.textContent = hero.subheadline;
}

// Populate contact section
function populateContact(contact) {
  if (!contact) return;

  const headline = document.querySelector('#contact h2');
  const description = document.querySelector('#contact .section-header p');

  if (headline) headline.textContent = contact.headline;
  if (description) description.textContent = contact.description;
}

// Smooth scrolling for anchor links only
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Contact form handling
function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(form);
    var data = Object.fromEntries(formData);
    console.log('Security assessment request:', data);

    var btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    var originalText = btn.textContent;
    btn.textContent = '✓ Request Submitted!';
    btn.style.background = 'var(--color-secondary)';
    btn.disabled = true;

    setTimeout(function () {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// Scroll-triggered fade-in animations
function initScrollAnimations() {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  setTimeout(function () {
    document.querySelectorAll('.card, .stat-card').forEach(function (el) {
      observer.observe(el);
    });
  }, 100);
}

// Highlight the active page in the nav
function initActiveNav() {
  var path = window.location.pathname;
  var page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  // Treat root "/" as index.html
  if (page === '' || page === '/') page = 'index.html';

  document.querySelectorAll('nav ul a').forEach(function (link) {
    var href = link.getAttribute('href');

    // Only match exact page links (e.g. "services.html", "about.html", "index.html")
    // Skip links with hash fragments like "index.html#contact"
    if (href === page) {
      link.classList.add('nav-active');
    }
  });
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', async function () {
  // Only load and populate CMS content on the home page
  var path = window.location.pathname;
  var isHomePage = path === '/' || path.endsWith('/index.html') || path.endsWith('/');

  if (isHomePage) {
    var hero = await loadJSON('/content/hero.json');
    var contact = await loadJSON('/content/contact.json');

    populateHero(hero);
    populateContact(contact);
  }

  initActiveNav();
  initSmoothScroll();
  initContactForm();
  initScrollAnimations();
});