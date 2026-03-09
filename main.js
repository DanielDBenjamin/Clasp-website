// ==========================================
// CLASP - Main JavaScript (ScrollSpy & Smooth Scroll)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Check if the link points to an ID on the *current* page
      const isSamePage = this.pathname === window.location.pathname || (this.pathname === '/' && window.location.pathname.endsWith('index.html'));
      
      if (isSamePage && this.hash) {
        e.preventDefault();
        const target = document.querySelector(this.hash);
        
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, null, this.hash);
        }
      }
    });
  });

  // 2. The "Motion Sensor" (Intersection Observer) for the Standards Section
  const standardsSection = document.getElementById('standards');
  const standardsNavLink = document.querySelector('.nav-links a[href*="#standards"]');

  if (standardsSection && standardsNavLink) {
    // Set up the sensor: it triggers when 30% of the section is visible on screen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Section is on screen: Turn link green
          standardsNavLink.classList.add('nav-active');
        } else {
          // Section is off screen: Remove green
          standardsNavLink.classList.remove('nav-active');
        }
      });
    }, { threshold: 0.3 });

    // Start watching the section
    observer.observe(standardsSection);
  }
  
  // 3. Fallback for direct links (e.g., coming from the Services page directly to the Standards section)
  if (window.location.hash === '#standards' && standardsNavLink) {
      standardsNavLink.classList.add('nav-active');
  }
});