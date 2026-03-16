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

// --- Secure Contact Form Submission ---
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Stop the page from reloading
      
      // Visual feedback that it's working
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = 'Sending...';
      submitBtn.style.opacity = '0.7';
      submitBtn.disabled = true;
      formStatus.style.display = 'none'; // Hide previous messages
      
      const formData = new FormData(contactForm);

      try {
        // Send data to our secure Cloudflare Function
        const response = await fetch('contact.php', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Success state
          formStatus.style.display = 'block';
          formStatus.style.backgroundColor = '#d1fae5'; // Light green
          formStatus.style.color = '#065f46'; // Dark green text
          formStatus.innerText = 'Message sent successfully! Our advisory team will be in touch shortly.';
          
          contactForm.reset();
          
          // Reset Turnstile widget so they can't submit twice with the same token
          if (typeof turnstile !== 'undefined') {
            turnstile.reset();
          }
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        // Error state
        formStatus.style.display = 'block';
        formStatus.style.backgroundColor = '#fee2e2'; // Light red
        formStatus.style.color = '#991b1b'; // Dark red text
        formStatus.innerText = 'Oops! Something went wrong. Please try again or email info@clasp.co.za directly.';
      } finally {
        // Restore button state
        submitBtn.innerText = originalBtnText;
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
      }
    });
  }
});