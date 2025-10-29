// Make avatar and home clickable to navigate
document.addEventListener('DOMContentLoaded', function() {
  const baseUrl = 'https://blog.digitaldevops.xyz/';

  // Avatar click to go home
  const avatar = document.querySelector('.sidebar-top img, .sidebar-avatar, img[src*="blog_image"]');
  if (avatar) {
    avatar.style.cursor = 'pointer';
    avatar.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = baseUrl;
    });
  }

  // Site title/logo click to go home
  const siteTitle = document.querySelector('.site-title, .navbar-brand, h1 a');
  if (siteTitle) {
    siteTitle.style.cursor = 'pointer';
  }

  // Make entire post preview clickable
  const postPreviews = document.querySelectorAll('.post-preview');
  postPreviews.forEach(preview => {
    const link = preview.querySelector('a[href*="/posts/"]');
    if (link && link.getAttribute('href')) {
      preview.style.cursor = 'pointer';
      preview.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' || e.target.classList.contains('post-tag') || e.target.closest('.post-tag') || e.target.closest('a')) {
          return;
        }
        const href = link.getAttribute('href');
        let absoluteUrl = href;
        if (!href.startsWith('http')) {
          absoluteUrl = baseUrl.replace(/\/$/, '') + (href.startsWith('/') ? href : '/' + href);
        }
        window.location.href = absoluteUrl;
      });
    }
  });

  // Ensure all post title links work
  const postTitles = document.querySelectorAll('.post-title a, .read-more');
  postTitles.forEach(link => {
    if (link.tagName === 'A') {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        link.style.cursor = 'pointer';
        link.style.pointerEvents = 'auto';
      }
    }
  });

  // Find and enhance home navigation links
  const navLinks = document.querySelectorAll('a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent.toLowerCase();

    if (text.includes('home') || href === '/' || href === '/dev-blog/' || href.endsWith('/dev-blog')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = baseUrl;
      });
      link.setAttribute('href', baseUrl);
    }
  });

  // Ensure tag and search links work properly
  const tagLinks = document.querySelectorAll('a[href*="/tags/"], a[href*="/categories/"], a[href*="?search="]');
  tagLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http')) {
      let absoluteUrl = href;
      if (!href.startsWith('http')) {
        absoluteUrl = baseUrl.replace(/\/$/, '') + (href.startsWith('/') ? href : '/' + href);
      }
      link.setAttribute('href', absoluteUrl);
    }
  });
});

// Premier League Table Widget
document.addEventListener('DOMContentLoaded', function() {
  const premierLeagueWidget = document.getElementById('premier-league-widget');

  if (premierLeagueWidget) {
    loadPremierLeagueWidget();
  }
});

function loadPremierLeagueWidget() {
  const widget = document.getElementById('premier-league-widget');

  try {
    // Using Football Data API (free tier)
    const API_KEY = 'YOUR_API_KEY_HERE';
    const response = fetch('https://api.football-data.org/v4/competitions/PL/standings', {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    response.json().then(data => {
      displayPremierLeagueWidget(data.standings[0].table.slice(0, 6));
    });
  } catch (error) {
    console.error('Error loading Premier League widget:', error);
    displayFallbackWidget();
  }
}

function displayPremierLeagueWidget(teams) {
  const widget = document.getElementById('premier-league-widget');

  let html = '<h4 style="margin: 0 0 0.5rem 0; font-size: 0.95rem; color: #00bfff;">⚽ Top 6</h4>';
  html += '<div class="league-table" style="font-size: 0.75rem;">';
  html += '<div class="table-header" style="grid-template-columns: 25px 1fr 30px;">';
  html += '<span class="pos">#</span>';
  html += '<span class="team">Team</span>';
  html += '<span class="pts">Pts</span>';
  html += '</div>';

  teams.forEach((team, index) => {
    const position = index + 1;
    const teamName = team.team.name.replace('FC', '').replace('United', 'Utd').trim();
    const points = team.points;

    html += '<div class="table-row" style="grid-template-columns: 25px 1fr 30px;">';
    html += `<span class="pos" style="text-align: center; font-weight: bold;">${position}</span>`;
    html += `<span class="team" style="font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${teamName}</span>`;
    html += `<span class="pts" style="text-align: center; font-weight: bold; color: #ffd700;">${points}</span>`;
    html += '</div>';
  });

  html += '</div>';
  html += '<div class="table-footer" style="margin-top: 0.5rem; text-align: center; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.1);">';
  html += '<a href="https://www.premierleague.com/tables" target="_blank" class="table-link" style="font-size: 0.7rem;">View Full →</a>';
  html += '</div>';

  widget.innerHTML = html;
}

function displayFallbackWidget() {
  const widget = document.getElementById('premier-league-widget');

  const fallbackData = [
    { pos: 1, team: 'Arsenal', pts: 24 },
    { pos: 2, team: 'Liverpool', pts: 22 },
    { pos: 3, team: 'Aston Villa', pts: 20 },
    { pos: 4, team: 'Man City', pts: 19 },
    { pos: 5, team: 'Tottenham', pts: 18 },
    { pos: 6, team: 'Newcastle', pts: 17 }
  ];

  let html = '<h4 style="margin: 0 0 0.5rem 0; font-size: 0.95rem; color: #00bfff;">⚽ Top 6</h4>';
  html += '<div class="league-table" style="font-size: 0.75rem;">';
  html += '<div class="table-header" style="grid-template-columns: 25px 1fr 30px;">';
  html += '<span class="pos">#</span>';
  html += '<span class="team">Team</span>';
  html += '<span class="pts">Pts</span>';
  html += '</div>';

  fallbackData.forEach(team => {
    html += '<div class="table-row" style="grid-template-columns: 25px 1fr 30px;">';
    html += `<span class="pos" style="text-align: center; font-weight: bold;">${team.pos}</span>`;
    html += `<span class="team" style="font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${team.team}</span>`;
    html += `<span class="pts" style="text-align: center; font-weight: bold; color: #ffd700;">${team.pts}</span>`;
    html += '</div>';
  });

  html += '</div>';
  html += '<div class="table-footer" style="margin-top: 0.5rem; text-align: center; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.7rem; color: #999;">';
  html += 'Oct 29, 2025<br>';
  html += '<a href="https://www.premierleague.com/tables" target="_blank" class="table-link" style="font-size: 0.7rem;">View Full →</a>';
  html += '</div>';

  widget.innerHTML = html;
}
