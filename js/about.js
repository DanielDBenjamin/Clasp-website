// Populate the About page from content/about.json
(async function initAboutPage() {
  try {
    const response = await fetch('/content/about.json');
    if (!response.ok) {
      console.error('Failed to load about.json');
      return;
    }

    const about = await response.json();

    // Headline
    const headlineEl = document.getElementById('about-headline');
    if (headlineEl && about.headline) {
      headlineEl.textContent = about.headline;
    }

    // Story
    const storyEl = document.getElementById('about-story');
    if (storyEl && about.story) {
      // Preserve paragraphs
      storyEl.innerHTML = about.story
        .split('\n\n')
        .map(p => `<p>${p}</p>`)
        .join('');
    }

    // Mission
    const missionEl = document.getElementById('about-mission');
    if (missionEl && about.mission) {
      missionEl.textContent = about.mission;
    }

    // Team grid
    const teamGrid = document.getElementById('team-grid');
    if (teamGrid && Array.isArray(about.team)) {
      teamGrid.innerHTML = about.team
        .map(member => `
          <div class="card">
            <div class="card-content">
              ${member.image ? `<div class="team-avatar" style="background-image: url('${member.image}');"></div>` : ''}
              <h3>${member.name}</h3>
              <p class="team-role">${member.role}</p>
              <p class="team-bio">${member.bio}</p>
            </div>
          </div>
        `)
        .join('');
    }
  } catch (err) {
    console.error('Error initializing About page:', err);
  }
})();

