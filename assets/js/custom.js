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
      // Update every 10 minutes
      setInterval(loadPremierLeagueTable, 600000);
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
    // Using Football Data API v2 (free tier, no key required)
    console.log('Attempting to fetch Premier League data from API');
    
    fetch('https://api.football-data.org/v2/competitions/2021/standings')
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
        displayPremierLeagueTable(data.standings[0].table.slice(0, 10));
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
  html += '<a href="https://www.premierleague.com/en/tables?competition=8&season=2025&round=L_1&matchweek=-1&ha=-1" target="_blank" class="table-link" style="font-size: 0.7rem;">View Full Table →</a>';
  html += '</div>';

  container.innerHTML = html;
}

function displayFallbackTable() {
  const container = document.getElementById('premier-league-table');

  const fallbackData = [
    { pos: 1, team: 'Liverpool', pts: 28 },
    { pos: 2, team: 'Arsenal', pts: 26 },
    { pos: 3, team: 'Chelsea', pts: 24 },
    { pos: 4, team: 'Man City', pts: 23 },
    { pos: 5, team: 'Newcastle', pts: 21 },
    { pos: 6, team: 'Aston Villa', pts: 20 },
    { pos: 7, team: 'Tottenham', pts: 19 },
    { pos: 8, team: 'West Ham', pts: 18 },
    { pos: 9, team: 'Brighton', pts: 17 },
    { pos: 10, team: 'Crystal Palace', pts: 16 }
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
  html += '<a href="https://www.premierleague.com/en/tables?competition=8&season=2025&round=L_1&matchweek=-1&ha=-1" target="_blank" class="table-link" style="font-size: 0.7rem;">View Full Table →</a>';
  html += '</div>';

  container.innerHTML = html;
}

// DateTime Widget Functionality
function updateDateTime() {
  const now = new Date();
  
  // Update time
  const timeElement = document.getElementById('current-time');
  if (timeElement) {
    const timeString = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    timeElement.textContent = timeString;
  }
  
  // Update date
  const dateElement = document.getElementById('current-date');
  if (dateElement) {
    const dateString = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    dateElement.textContent = dateString;
  }
}

// Get user's location
async function getUserLocation() {
  const locationElement = document.getElementById('current-location');
  if (!locationElement) return;
  
  try {
    // Try to get location using IP-based geolocation
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.city && data.country_name) {
      locationElement.textContent = `${data.city}, ${data.country_name}`;
      // Get weather for this location
      getWeatherData(data.latitude, data.longitude);
    } else {
      // Fallback to timezone-based location
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timezoneCity = timezone.split('/').pop().replace('_', ' ');
      locationElement.textContent = timezoneCity;
      // Try to get weather with approximate coordinates
      getWeatherData(51.5074, -0.1278); // Default to London coordinates
    }
  } catch (error) {
    // Fallback to timezone
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timezoneCity = timezone.split('/').pop().replace('_', ' ');
      locationElement.textContent = timezoneCity;
      // Try to get weather with approximate coordinates
      getWeatherData(51.5074, -0.1278); // Default to London coordinates
    } catch (fallbackError) {
      locationElement.textContent = 'Unknown Location';
      document.getElementById('current-weather').textContent = 'Weather unavailable';
    }
  }
}

// Get weather data from Open-Meteo API
async function getWeatherData(latitude, longitude) {
  const weatherElement = document.getElementById('current-weather');
  const weatherIcon = document.getElementById('weather-icon');
  
  if (!weatherElement || !weatherIcon) return;
  
  try {
    // Open-Meteo API call
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    const currentWeather = data.current_weather;
    
    if (currentWeather) {
      const temperature = Math.round(currentWeather.temperature);
      const weatherCode = currentWeather.weathercode;
      const isDay = currentWeather.is_day === 1;
      
      // Update temperature display
      weatherElement.textContent = `${temperature}°C`;
      
      // Update weather icon based on weather code
      updateWeatherIcon(weatherIcon, weatherCode, isDay);
    } else {
      weatherElement.textContent = 'Weather unavailable';
    }
  } catch (error) {
    console.log('Weather fetch error:', error);
    weatherElement.textContent = 'Weather unavailable';
    weatherIcon.className = 'fas fa-question-circle';
  }
}

// Update weather icon based on WMO weather codes
function updateWeatherIcon(iconElement, weatherCode, isDay) {
  // WMO Weather Codes: https://open-meteo.com/en/docs
  const iconMap = {
    // Clear sky
    0: isDay ? 'fas fa-sun' : 'fas fa-moon',
    // Mainly clear
    1: isDay ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon',
    // Partly cloudy
    2: 'fas fa-cloud-sun',
    // Overcast
    3: 'fas fa-cloud',
    // Fog
    45: 'fas fa-smog',
    48: 'fas fa-smog',
    // Drizzle
    51: 'fas fa-cloud-rain',
    53: 'fas fa-cloud-rain',
    55: 'fas fa-cloud-rain',
    // Rain
    61: 'fas fa-cloud-showers-heavy',
    63: 'fas fa-cloud-showers-heavy',
    65: 'fas fa-cloud-showers-heavy',
    // Snow
    71: 'fas fa-snowflake',
    73: 'fas fa-snowflake',
    75: 'fas fa-snowflake',
    // Thunderstorm
    95: 'fas fa-bolt',
    96: 'fas fa-bolt',
    99: 'fas fa-bolt'
  };
  
  const iconClass = iconMap[weatherCode] || 'fas fa-cloud-sun';
  iconElement.className = iconClass;
}

// Initialize datetime widget when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Update time immediately
  updateDateTime();
  
  // Update time every second
  setInterval(updateDateTime, 1000);
  
  // Get location (only once on page load)
  getUserLocation();
});
