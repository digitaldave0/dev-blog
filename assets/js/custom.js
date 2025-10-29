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

  // Make entire post preview clickable - but don't interfere with links
  const postPreviews = document.querySelectorAll('.post-preview');
  postPreviews.forEach(preview => {
    const link = preview.querySelector('a[href*="/posts/"]');
    if (link && link.getAttribute('href')) {
      preview.style.cursor = 'pointer';
      preview.addEventListener('click', function(e) {
        // Don't override any link clicks - just let default behavior happen
        if (e.target.tagName === 'A' || e.target.closest('a')) {
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

  // Tag and search links should work with default behavior
  // No need to manipulate href - Jekyll handles these correctly
});

// Premier League Table Widget
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded fired for Premier League widget');
  
  // Use a small delay to ensure DOM is fully ready
  setTimeout(function() {
    const premierLeagueTable = document.getElementById('premier-league-table');
    console.log('Premier League table element:', premierLeagueTable);
    
    if (premierLeagueTable) {
      loadPremierLeagueTable();
    } else {
      console.error('Premier League table element not found');
    }
  }, 100);
});

function loadPremierLeagueTable() {
  const container = document.getElementById('premier-league-table');
  console.log('loadPremierLeagueTable called, container:', container);

  if (!container) {
    console.error('Table container not found');
    return;
  }

  try {
    // Using Football Data API (free tier)
    const API_KEY = 'YOUR_API_KEY_HERE';
    console.log('Attempting to fetch Premier League data from API');
    
    fetch('https://api.football-data.org/v4/competitions/PL/standings', {
      headers: {
        'X-Auth-Token': API_KEY
      }
    })
    .then(response => {
      console.log('API response received:', response);
      if (!response.ok) {
        throw new Error('API request failed with status: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log('API data received:', data);
      if (data.standings && data.standings[0] && data.standings[0].table) {
        displayPremierLeagueTable(data.standings[0].table.slice(0, 6));
      } else {
        console.warn('Data structure not as expected, using fallback');
        displayFallbackTable();
      }
    })
    .catch(error => {
      console.error('Error loading Premier League table:', error);
      displayFallbackTable();
    });
  } catch (error) {
    console.error('Error in loadPremierLeagueTable:', error);
    displayFallbackTable();
  }
}

function displayPremierLeagueTable(teams) {
  const container = document.getElementById('premier-league-table');

  let html = '<div class="league-table" style="font-size: 0.75rem;">';
  html += '<div class="table-header" style="grid-template-columns: 30px 1fr 35px;">';
  html += '<span class="pos">#</span>';
  html += '<span class="team">Team</span>';
  html += '<span class="pts">Pts</span>';
  html += '</div>';

  teams.forEach((team, index) => {
    const position = index + 1;
    const teamName = team.team.name.replace('FC', '').replace('United', 'Utd').trim();
    const points = team.points;

    html += '<div class="table-row" style="grid-template-columns: 30px 1fr 35px;">';
    html += `<span class="pos" style="text-align: center; font-weight: bold;">${position}</span>`;
    html += `<span class="team" style="font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${teamName}</span>`;
    html += `<span class="pts" style="text-align: center; font-weight: bold; color: #ffd700;">${points}</span>`;
    html += '</div>';
  });

  html += '</div>';
  html += '<div class="table-footer" style="margin-top: 0.5rem; text-align: center; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.1);">';
  html += '<a href="https://www.premierleague.com/tables" target="_blank" class="table-link" style="font-size: 0.7rem;">View Full Table →</a>';
  html += '</div>';

  container.innerHTML = html;
}

function displayFallbackTable() {
  const container = document.getElementById('premier-league-table');

  const fallbackData = [
    { pos: 1, team: 'Arsenal', pts: 24 },
    { pos: 2, team: 'Liverpool', pts: 22 },
    { pos: 3, team: 'Aston Villa', pts: 20 },
    { pos: 4, team: 'Man City', pts: 19 },
    { pos: 5, team: 'Tottenham', pts: 18 },
    { pos: 6, team: 'Newcastle', pts: 17 }
  ];

  let html = '<div class="league-table" style="font-size: 0.75rem;">';
  html += '<div class="table-header" style="grid-template-columns: 30px 1fr 35px;">';
  html += '<span class="pos">#</span>';
  html += '<span class="team">Team</span>';
  html += '<span class="pts">Pts</span>';
  html += '</div>';

  fallbackData.forEach(team => {
    html += '<div class="table-row" style="grid-template-columns: 30px 1fr 35px;">';
    html += `<span class="pos" style="text-align: center; font-weight: bold;">${team.pos}</span>`;
    html += `<span class="team" style="font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${team.team}</span>`;
    html += `<span class="pts" style="text-align: center; font-weight: bold; color: #ffd700;">${team.pts}</span>`;
    html += '</div>';
  });

  html += '</div>';
  html += '<div class="table-footer" style="margin-top: 0.5rem; text-align: center; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.7rem; color: #999;">';
  html += 'Oct 29, 2025<br>';
  html += '<a href="https://www.premierleague.com/tables" target="_blank" class="table-link" style="font-size: 0.7rem;">View Full Table →</a>';
  html += '</div>';

  container.innerHTML = html;
}
