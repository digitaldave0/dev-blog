// Make avatar and home clickable to navigate// Make avatar and home clickable to navigate

document.addEventListener('DOMContentLoaded', function() {document.addEventListener('DOMContentLoaded', function() {

  const baseUrl = 'https://blog.digitaldevops.xyz/';  const baseUrl = 'https://blog.digitaldevops.xyz/';

    

  // Avatar click to go home  // Avatar click to go home

  const avatar = document.querySelector('.sidebar-top img, .sidebar-avatar, img[src*="blog_image"]');  const avatar = document.querySelector('.sidebar-top img, .sidebar-avatar, img[src*="blog_image"]');

  if (avatar) {  if (avatar) {

    avatar.style.cursor = 'pointer';    avatar.style.cursor = 'pointer';

    avatar.addEventListener('click', function(e) {    avatar.addEventListener('click', function(e) {

      e.preventDefault();      e.preventDefault();

      e.stopPropagation();      e.stopPropagation();

      window.location.href = baseUrl;      window.location.href = baseUrl;

    });    });

  }  }



  // Site title/logo click to go home  // Site title/logo click to go home

  const siteTitle = document.querySelector('.site-title, .navbar-brand, h1 a');  const siteTitle = document.querySelector('.site-title, .navbar-brand, h1 a');

  if (siteTitle) {  if (siteTitle) {

    siteTitle.style.cursor = 'pointer';    siteTitle.style.cursor = 'pointer';

  }  }



  // Make entire post preview clickable  // Make entire post preview clickable

  const postPreviews = document.querySelectorAll('.post-preview');  const postPreviews = document.querySelectorAll('.post-preview');

  postPreviews.forEach(preview => {  postPreviews.forEach(preview => {

    const link = preview.querySelector('a[href*="/posts/"]');    const link = preview.querySelector('a[href*="/posts/"]');

    if (link && link.getAttribute('href')) {    if (link && link.getAttribute('href')) {

      preview.style.cursor = 'pointer';      preview.style.cursor = 'pointer';

      preview.addEventListener('click', function(e) {      preview.addEventListener('click', function(e) {

        // Don't navigate if clicking on a link, tag, or other interactive element        // Don't navigate if clicking on a link, tag, or other interactive element

        if (e.target.tagName === 'A' || e.target.classList.contains('post-tag') || e.target.closest('.post-tag') || e.target.closest('a')) {        if (e.target.tagName === 'A' || e.target.classList.contains('post-tag') || e.target.closest('.post-tag') || e.target.closest('a')) {

          return;          return;

        }        }

        const href = link.getAttribute('href');        const href = link.getAttribute('href');

        let absoluteUrl = href;        let absoluteUrl = href;

        if (!href.startsWith('http')) {        if (!href.startsWith('http')) {

          absoluteUrl = baseUrl.replace(/\/$/, '') + (href.startsWith('/') ? href : '/' + href);          absoluteUrl = baseUrl.replace(/\/$/, '') + (href.startsWith('/') ? href : '/' + href);

        }        }

        window.location.href = absoluteUrl;        window.location.href = absoluteUrl;

      });      });

    }    }

  });  });



  // Ensure all post title links work  // Ensure all post title links work

  const postTitles = document.querySelectorAll('.post-title a, .read-more');  const postTitles = document.querySelectorAll('.post-title a, .read-more');

  postTitles.forEach(link => {  postTitles.forEach(link => {

    if (link.tagName === 'A') {    if (link.tagName === 'A') {

      const href = link.getAttribute('href');      const href = link.getAttribute('href');

      if (href && !href.startsWith('#')) {      if (href && !href.startsWith('#')) {

        link.style.cursor = 'pointer';        link.style.cursor = 'pointer';

        link.style.pointerEvents = 'auto';        link.style.pointerEvents = 'auto';

      }      }

    }    }

  });  });



  // Find and enhance home navigation links  // Find and enhance home navigation links

  const navLinks = document.querySelectorAll('a');  const navLinks = document.querySelectorAll('a');

  navLinks.forEach(link => {  navLinks.forEach(link => {

    const href = link.getAttribute('href') || '';    const href = link.getAttribute('href') || '';

    const text = link.textContent.toLowerCase();    const text = link.textContent.toLowerCase();

        

    // Make "Home" links navigate to the full URL    // Make "Home" links navigate to the full URL

    if (text.includes('home') || href === '/' || href === '/dev-blog/' || href.endsWith('/dev-blog')) {    if (text.includes('home') || href === '/' || href === '/dev-blog/' || href.endsWith('/dev-blog')) {

      link.addEventListener('click', function(e) {      link.addEventListener('click', function(e) {

        e.preventDefault();        e.preventDefault();

        window.location.href = baseUrl;        window.location.href = baseUrl;

      });      });

      link.setAttribute('href', baseUrl);      link.setAttribute('href', baseUrl);

    }    }

  });  });



  // Ensure tag and search links work properly  // Ensure tag and search links work properly

  const tagLinks = document.querySelectorAll('a[href*="/tags/"], a[href*="/categories/"], a[href*="?search="]');  const tagLinks = document.querySelectorAll('a[href*="/tags/"], a[href*="/categories/"], a[href*="?search="]');

  tagLinks.forEach(link => {  tagLinks.forEach(link => {

    const href = link.getAttribute('href');    const href = link.getAttribute('href');

    if (href && !href.startsWith('http')) {    if (href && !href.startsWith('http')) {

      // Convert relative URLs to absolute      // Convert relative URLs to absolute

      let absoluteUrl = href;      let absoluteUrl = href;

      if (!href.startsWith('http')) {      if (!href.startsWith('http')) {

        absoluteUrl = baseUrl.replace(/\/$/, '') + (href.startsWith('/') ? href : '/' + href);        absoluteUrl = baseUrl.replace(/\/$/, '') + (href.startsWith('/') ? href : '/' + href);

      }      }

      link.setAttribute('href', absoluteUrl);      link.setAttribute('href', absoluteUrl);

    }    }

  });  });

});});



// Premier League Table Widget// Premier League Table Widget

document.addEventListener('DOMContentLoaded', function() {document.addEventListener('DOMContentLoaded', function() {

  const premierLeagueTable = document.getElementById('premier-league-table');  const premierLeagueTable = document.getElementById('premier-league-table');

  const premierLeagueWidget = document.getElementById('premier-league-widget');  const premierLeagueWidget = document.getElementById('premier-league-widget');

    

  // Try to load in either location  // Try to load in either location

  if (premierLeagueTable) {  if (premierLeagueTable) {

    loadPremierLeagueTable();    loadPremierLeagueTable();

  } else if (premierLeagueWidget) {  } else if (premierLeagueWidget) {

    loadPremierLeagueWidget();    loadPremierLeagueWidget();

  }  }

});});



async function loadPremierLeagueTable() {async function loadPremierLeagueTable() {

  const tableContainer = document.getElementById('premier-league-table');  const tableContainer = document.getElementById('premier-league-table');

    

  try {  try {

    // Using Football Data API (free tier)    // Using Football Data API (free tier)

    // Note: You'll need to sign up for a free API key at https://www.football-data.org/    // Note: You'll need to sign up for a free API key at https://www.football-data.org/

    const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with actual API key    const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with actual API key

    const response = await fetch('https://api.football-data.org/v4/competitions/PL/standings', {    const response = await fetch('https://api.football-data.org/v4/competitions/PL/standings', {

      headers: {      headers: {

        'X-Auth-Token': API_KEY        'X-Auth-Token': API_KEY

      }      }

    });    });

        

    if (!response.ok) {    if (!response.ok) {

      throw new Error('API request failed');      throw new Error('API request failed');

    }    }

        

    const data = await response.json();    const data = await response.json();

    displayPremierLeagueTable(data.standings[0].table.slice(0, 6)); // Top 6 teams    displayPremierLeagueTable(data.standings[0].table.slice(0, 6)); // Top 6 teams

        

  } catch (error) {  } catch (error) {

    console.error('Error loading Premier League table:', error);    console.error('Error loading Premier League table:', error);

    // Fallback to static data for demo    // Fallback to static data for demo

    displayFallbackTable();    displayFallbackTable();

  }  }

}}



async function loadPremierLeagueWidget() {async function loadPremierLeagueWidget() {

  const widget = document.getElementById('premier-league-widget');  const widget = document.getElementById('premier-league-widget');

    

  try {  try {

    // Using Football Data API (free tier)    // Using Football Data API (free tier)

    const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with actual API key    const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with actual API key

    const response = await fetch('https://api.football-data.org/v4/competitions/PL/standings', {    const response = await fetch('https://api.football-data.org/v4/competitions/PL/standings', {

      headers: {      headers: {

        'X-Auth-Token': API_KEY        'X-Auth-Token': API_KEY

      }      }

    });    });

        

    if (!response.ok) {    if (!response.ok) {

      throw new Error('API request failed');      throw new Error('API request failed');

    }    }

        

    const data = await response.json();    const data = await response.json();

    displayPremierLeagueWidget(data.standings[0].table.slice(0, 6)); // Top 6 teams    displayPremierLeagueWidget(data.standings[0].table.slice(0, 6)); // Top 6 teams

        

  } catch (error) {  } catch (error) {

    console.error('Error loading Premier League widget:', error);    console.error('Error loading Premier League widget:', error);

    // Fallback to static data for demo    // Fallback to static data for demo

    displayFallbackWidget();    displayFallbackWidget();

  }  }

}}



function displayPremierLeagueTable(teams) {function displayPremierLeagueTable(teams) {

  const tableContainer = document.getElementById('premier-league-table');  const tableContainer = document.getElementById('premier-league-table');

    

  let html = '<div class="league-table">';  let html = '<div class="league-table">';

  html += '<div class="table-header">';  html += '<div class="table-header">';

  html += '<span class="pos">#</span>';  html += '<span class="pos">#</span>';

  html += '<span class="team">Team</span>';  html += '<span class="team">Team</span>';

  html += '<span class="pts">Pts</span>';  html += '<span class="pts">Pts</span>';

  html += '<span class="form">Form</span>';  html += '<span class="form">Form</span>';

  html += '</div>';  html += '</div>';

    

  teams.forEach((team, index) => {  teams.forEach((team, index) => {

    const position = index + 1;    const position = index + 1;

    const teamName = team.team.name.replace('FC', '').trim();    const teamName = team.team.name.replace('FC', '').trim();

    const points = team.points;    const points = team.points;

    const recentForm = getRecentForm(team.form);    const recentForm = getRecentForm(team.form); // This would need to be calculated from match data

        

    html += '<div class="table-row">';    html += '<div class="table-row">';

    html += `<span class="pos">${position}</span>`;    html += `<span class="pos">${position}</span>`;

    html += `<span class="team">${teamName}</span>`;    html += `<span class="team">${teamName}</span>`;

    html += `<span class="pts">${points}</span>`;    html += `<span class="pts">${points}</span>`;

    html += `<span class="form">${recentForm}</span>`;    html += `<span class="form">${recentForm}</span>`;

    html += '</div>';    html += '</div>';

  });  });

    

  html += '</div>';  html += '</div>';

  html += '<div class="table-footer">';  html += '<div class="table-footer">';

  html += '<a href="https://www.premierleague.com/tables" target="_blank" class="table-link">View Full Table →</a>';  html += '<a href="https://www.premierleague.com/tables" target="_blank" class="table-link">View Full Table →</a>';

  html += '</div>';  html += '</div>';

    

  tableContainer.innerHTML = html;  tableContainer.innerHTML = html;

}}



function getRecentForm(formData) {function getRecentForm(formData) {

  return 'W D W L W'; // Win Draw Win Loss Win  // This is a simplified version - you'd need actual match data

}  // For now, return a placeholder

  return 'W D W L W'; // Win Draw Win Loss Win

function displayPremierLeagueWidget(teams) {}

  const widget = document.getElementById('premier-league-widget');

  function displayFallbackTable() {

  let html = '<div class="sidebar-league-table">';  const tableContainer = document.getElementById('premier-league-table');

  html += '<h4 style="margin: 0 0 0.5rem 0; font-size: 0.95rem;">⚽ Top 6</h4>';  

  html += '<div class="league-table" style="font-size: 0.75rem;">';  // Static fallback data for demonstration

  html += '<div class="table-header" style="grid-template-columns: 25px 1fr 30px;">';  const fallbackData = [

  html += '<span class="pos">#</span>';    { pos: 1, team: 'Arsenal', pts: 24, form: 'W W W D W' },

  html += '<span class="team">Team</span>';    { pos: 2, team: 'Liverpool', pts: 22, form: 'W W D W L' },

  html += '<span class="pts">Pts</span>';    { pos: 3, team: 'Aston Villa', pts: 20, form: 'W D W W D' },

  html += '</div>';    { pos: 4, team: 'Manchester City', pts: 19, form: 'W L W W D' },

      { pos: 5, team: 'Tottenham', pts: 18, form: 'D W L W W' },

  teams.forEach((team, index) => {    { pos: 6, team: 'Newcastle', pts: 17, form: 'W D W L D' }

    const position = index + 1;  ];

    const teamName = team.team.name.replace('FC', '').replace('United', 'Utd').trim();  

    const points = team.points;  let html = '<div class="league-table">';

      html += '<div class="table-header">';

    html += '<div class="table-row" style="grid-template-columns: 25px 1fr 30px;">';  html += '<span class="pos">#</span>';

    html += `<span class="pos" style="text-align: center; font-weight: bold;">${position}</span>`;  html += '<span class="team">Team</span>';

    html += `<span class="team" style="font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${teamName}</span>`;  html += '<span class="pts">Pts</span>';

    html += `<span class="pts" style="text-align: center; font-weight: bold; color: #ffd700;">${points}</span>`;  html += '<span class="form">Form</span>';

    html += '</div>';  html += '</div>';

  });  

    fallbackData.forEach(team => {

  html += '</div>';    html += '<div class="table-row">';

  html += '<div class="table-footer" style="margin-top: 0.5rem; text-align: center; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.1);">';    html += `<span class="pos">${team.pos}</span>`;

  html += '<a href="https://www.premierleague.com/tables" target="_blank" class="table-link" style="font-size: 0.7rem;">View Full →</a>';    html += `<span class="team">${team.team}</span>`;

  html += '</div>';    html += `<span class="pts">${team.pts}</span>`;

  html += '</div>';    html += `<span class="form">${team.form}</span>`;

      html += '</div>';

  widget.innerHTML = html;  });

}  

  html += '</div>';

function displayFallbackTable() {  html += '<div class="table-footer">';

  const tableContainer = document.getElementById('premier-league-table');  html += '<small>Last updated: Oct 29, 2025</small><br>';

    html += '<a href="https://www.premierleague.com/tables" target="_blank" class="table-link">View Full Table →</a>';

  const fallbackData = [  html += '</div>';

    { pos: 1, team: 'Arsenal', pts: 24, form: 'W W W D W' },  

    { pos: 2, team: 'Liverpool', pts: 22, form: 'W W D W L' },  tableContainer.innerHTML = html;

    { pos: 3, team: 'Aston Villa', pts: 20, form: 'W D W W D' },}

    { pos: 4, team: 'Manchester City', pts: 19, form: 'W L W W D' },
    { pos: 5, team: 'Tottenham', pts: 18, form: 'D W L W W' },
    { pos: 6, team: 'Newcastle', pts: 17, form: 'W D W L D' }
  ];
  
  let html = '<div class="league-table">';
  html += '<div class="table-header">';
  html += '<span class="pos">#</span>';
  html += '<span class="team">Team</span>';
  html += '<span class="pts">Pts</span>';
  html += '<span class="form">Form</span>';
  html += '</div>';
  
  fallbackData.forEach(team => {
    html += '<div class="table-row">';
    html += `<span class="pos">${team.pos}</span>`;
    html += `<span class="team">${team.team}</span>`;
    html += `<span class="pts">${team.pts}</span>`;
    html += `<span class="form">${team.form}</span>`;
    html += '</div>';
  });
  
  html += '</div>';
  html += '<div class="table-footer">';
  html += '<small>Last updated: Oct 29, 2025</small><br>';
  html += '<a href="https://www.premierleague.com/tables" target="_blank" class="table-link">View Full Table →</a>';
  html += '</div>';
  
  tableContainer.innerHTML = html;
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
  
  let html = '<div class="sidebar-league-table">';
  html += '<h4 style="margin: 0 0 0.5rem 0; font-size: 0.95rem;">⚽ Top 6</h4>';
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
  html += '</div>';
  
  widget.innerHTML = html;
}
