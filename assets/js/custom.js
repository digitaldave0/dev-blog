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
      // Update daily instead of every 10 minutes
      setInterval(loadPremierLeagueTable, 86400000); // 24 hours
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

  const now = new Date();
  const isMonday = now.getDay() === 1; // 0 = Sunday, 1 = Monday
  const cacheKey = 'premierLeagueTable';
  const cacheTimestampKey = 'premierLeagueTableTimestamp';
  const previousCacheKey = 'premierLeagueTablePrevious';

  // Get the Monday of the current week
  const mondayOfWeek = new Date(now);
  mondayOfWeek.setDate(now.getDate() - now.getDay() + 1);
  mondayOfWeek.setHours(0, 0, 0, 0);

  const cachedData = localStorage.getItem(cacheKey);
  const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

  // Check if we have valid cached data from this week
  if (cachedData && cachedTimestamp) {
    const cacheDate = new Date(parseInt(cachedTimestamp));
    if (cacheDate >= mondayOfWeek && !isMonday) {
      console.log('Using cached Premier League data');
      displayPremierLeagueTable(JSON.parse(cachedData));
      return;
    }
  }

  // Fetch fresh data if Monday or no valid cache
  try {
    console.log('Fetching fresh Premier League data from API');
    
    // Using API-Football (free tier available)
    const apiKey = 'ebb4d5e78a6cfbfb543af1bf8cdf1acd'; // Your API-Football key
    const headers = apiKey !== 'YOUR_API_KEY_HERE' ? { 'x-apisports-key': apiKey } : {};
    
    fetch('https://v3.football.api-sports.io/standings?league=39&season=2024', {
      headers: headers
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
      if (data.response && data.response[0] && data.response[0].league && data.response[0].league.standings && data.response[0].league.standings[0]) {
        const top10Teams = data.response[0].league.standings[0].slice(0, 10);
        displayPremierLeagueTable(top10Teams);
        
        // Store previous week's data before updating cache
        const currentCached = localStorage.getItem(cacheKey);
        if (currentCached) {
          localStorage.setItem(previousCacheKey, currentCached);
        }
        
        // Cache the data
        localStorage.setItem(cacheKey, JSON.stringify(top10Teams));
        localStorage.setItem(cacheTimestampKey, now.getTime().toString());
        console.log('Premier League data cached');
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
  
  // Get previous week's data for position change calculation
  const previousData = localStorage.getItem('premierLeagueTablePrevious');
  const previousTeams = previousData ? JSON.parse(previousData) : [];
  
  // Create a map of team names to previous positions
  const previousPositions = {};
  previousTeams.forEach((team, index) => {
    const teamName = team.team.name.replace('FC', '').replace('United', 'Utd').trim();
    previousPositions[teamName] = index + 1;
  });

  let html = '<div class="league-table" style="font-size: 0.75rem;">';
  html += '<div class="table-header" style="grid-template-columns: 30px 1fr 35px;">';
  html += '<span class="pos">#</span>';
  html += '<span class="team">Team</span>';
  html += '<span class="pts">Pts</span>';
  html += '</div>';

  teams.forEach((teamData, index) => {
    const pos = teamData.rank;
    const teamName = teamData.team.name.replace('FC', '').replace('United', 'Utd').trim();
    const points = teamData.points;

    html += '<div class="table-row" style="grid-template-columns: 30px 1fr 35px;">';
    html += `<span class="pos" style="text-align: center; font-weight: bold;">${pos}</span>`;
    html += `<span class="team" style="font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${teamName}</span>`;
    html += `<span class="pts" style="text-align: center; font-weight: bold; color: #ffd700;">${points}</span>`;
    html += '</div>';
  });

  html += '</div>';

  container.innerHTML = html;
}

function displayFallbackTable() {
  const container = document.getElementById('premier-league-table');

  const fallbackData = [
    { pos: 1, team: 'Liverpool', pts: 29 },
    { pos: 2, team: 'Arsenal', pts: 27 },
    { pos: 3, team: 'Nottingham Forest', pts: 26 },
    { pos: 4, team: 'Chelsea', pts: 24 },
    { pos: 5, team: 'Newcastle', pts: 23 },
    { pos: 6, team: 'Manchester City', pts: 22 },
    { pos: 7, team: 'Bournemouth', pts: 21 },
    { pos: 8, team: 'Aston Villa', pts: 20 },
    { pos: 9, team: 'Brighton', pts: 19 },
    { pos: 10, team: 'Fulham', pts: 18 }
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
  const publicIpElement = document.getElementById('public-ip');
  const ispElement = document.getElementById('isp-info');
  const proxyElement = document.getElementById('proxy-status');
  
  try {
    // Try to get location using IP-based geolocation with detailed networking info
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.city && data.country_name) {
      locationElement.textContent = `${data.city}, ${data.country_name}`;
      
      // Update networking details
      if (publicIpElement) {
        publicIpElement.textContent = data.ip || 'Unknown';
      }
      
      if (ispElement) {
        const isp = data.org || data.isp || 'Unknown ISP';
        ispElement.textContent = isp.length > 20 ? isp.substring(0, 17) + '...' : isp;
      }
      
      if (proxyElement) {
        // Check for proxy/VPN indicators
        const isProxy = data.proxy || data.vpn || data.tor || false;
        const isHosting = data.hosting || false;
        
        if (isProxy) {
          proxyElement.textContent = 'Proxy/VPN Detected';
          proxyElement.style.color = '#ffc107'; // Warning yellow
        } else if (isHosting) {
          proxyElement.textContent = 'Hosting Service';
          proxyElement.style.color = '#17a2b8'; // Info blue
        } else {
          proxyElement.textContent = 'Direct Connection';
          proxyElement.style.color = '#28a745'; // Success green
        }
      }
      
      // Get weather for this location
      getWeatherData(data.latitude, data.longitude);
    } else {
      // Fallback to timezone-based location
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timezoneCity = timezone.split('/').pop().replace('_', ' ');
      locationElement.textContent = timezoneCity;
      
      // Set fallback networking info
      if (publicIpElement) publicIpElement.textContent = 'Unknown';
      if (ispElement) ispElement.textContent = 'Unknown ISP';
      if (proxyElement) {
        proxyElement.textContent = 'Unable to detect';
        proxyElement.style.color = '#6c757d';
      }
      
      // Try to get weather with approximate coordinates
      getWeatherData(51.5074, -0.1278); // Default to London coordinates
    }
  } catch (error) {
    // Fallback to timezone
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timezoneCity = timezone.split('/').pop().replace('_', ' ');
      locationElement.textContent = timezoneCity;
      
      // Set error networking info
      if (publicIpElement) publicIpElement.textContent = 'Error';
      if (ispElement) ispElement.textContent = 'Error';
      if (proxyElement) {
        proxyElement.textContent = 'Detection failed';
        proxyElement.style.color = '#dc3545'; // Error red
      }
      
      // Try to get weather with approximate coordinates
      getWeatherData(51.5074, -0.1278); // Default to London coordinates
    } catch (fallbackError) {
      locationElement.textContent = 'Unknown Location';
      if (publicIpElement) publicIpElement.textContent = 'Unknown';
      if (ispElement) ispElement.textContent = 'Unknown';
      if (proxyElement) {
        proxyElement.textContent = 'Unknown';
        proxyElement.style.color = '#6c757d';
      }
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

// Load inspirational quote from ZenQuotes API
async function loadInspirationalQuote() {
  const quoteTextElement = document.getElementById('quote-text');
  const quoteAuthorElement = document.getElementById('quote-author');
  
  if (!quoteTextElement || !quoteAuthorElement) return;
  
  try {
    // ZenQuotes API - provides random inspirational quotes
    const response = await fetch('https://zenquotes.io/api/random');
    
    if (!response.ok) {
      throw new Error('Quote API request failed');
    }
    
    const data = await response.json();
    const quote = data[0];
    
    if (quote && quote.q && quote.a) {
      quoteTextElement.textContent = `"${quote.q}"`;
      quoteAuthorElement.textContent = `— ${quote.a}`;
    } else {
      throw new Error('Invalid quote data');
    }
  } catch (error) {
    console.log('Quote fetch error:', error);
    // Fallback quotes
    const fallbackQuotes = [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
      { text: "The best way to predict the future is to create it.", author: "Peter Drucker" }
    ];
    
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    quoteTextElement.textContent = `"${randomQuote.text}"`;
    quoteAuthorElement.textContent = `— ${randomQuote.author}`;
  }
}

// Initialize tag interactions and animations
function initializeTagInteractions() {
  const tagLinks = document.querySelectorAll('.tag-link');
  
  tagLinks.forEach((tag, index) => {
    // Add staggered animation delay
    tag.style.animationDelay = `${index * 0.1}s`;
    tag.classList.add('tag-animate-in');
    
    // Add click tracking (optional analytics)
    tag.addEventListener('click', function(e) {
      // Add ripple effect
      const ripple = document.createElement('span');
      ripple.className = 'tag-ripple';
      ripple.style.left = `${e.offsetX}px`;
      ripple.style.top = `${e.offsetY}px`;
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
    
    // Add tooltip with post count
    const count = tag.dataset.count;
    tag.title = `${count} post${count > 1 ? 's' : ''} tagged with "${tag.textContent.trim()}"`;
  });
}

// Initialize datetime widget when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Update time immediately
  updateDateTime();

  // Update time every second
  setInterval(updateDateTime, 1000);

  // Get location and networking details (only once on page load)
  getUserLocation();

  // Load inspirational quote
  loadInspirationalQuote();

  // Initialize tag interactions
  initializeTagInteractions();

  // Initialize clipboard copy functionality for code blocks
  initializeCodeCopy();
});

// Clipboard copy functionality for code blocks
function initializeCodeCopy() {
  // Find all code blocks (both inline and block)
  const codeBlocks = document.querySelectorAll('pre code, pre');

  codeBlocks.forEach((block, index) => {
    // Skip if already has copy button
    if (block.querySelector('.code-copy-btn')) return;

    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'code-copy-btn';
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.title = 'Copy to clipboard';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');

    // Add click handler
    copyButton.addEventListener('click', async function() {
      try {
        // Get text content - prefer code element if it exists
        const codeElement = block.querySelector('code');
        const textToCopy = codeElement ? codeElement.textContent : block.textContent;

        // Use modern clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          try {
            document.execCommand('copy');
          } catch (err) {
            console.error('Fallback copy failed:', err);
            showCopyFeedback(copyButton, 'Failed to copy', false);
            return;
          } finally {
            document.body.removeChild(textArea);
          }
        }

        // Show success feedback
        showCopyFeedback(copyButton, 'Copied!', true);

      } catch (err) {
        console.error('Copy failed:', err);
        showCopyFeedback(copyButton, 'Failed to copy', false);
      }
    });

    // Create wrapper div for positioning
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    wrapper.style.position = 'relative';

    // Wrap the code block
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    wrapper.appendChild(copyButton);
  });
}

// Show copy feedback
function showCopyFeedback(button, message, success) {
  // Remove existing feedback
  const existingFeedback = button.querySelector('.copy-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }

  // Create feedback element
  const feedback = document.createElement('span');
  feedback.className = 'copy-feedback';
  feedback.textContent = message;
  feedback.style.cssText = `
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: ${success ? '#28a745' : '#dc3545'};
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
    opacity: 0;
    animation: fadeInOut 2s ease-in-out;
  `;

  button.appendChild(feedback);

  // Remove feedback after animation
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.parentNode.removeChild(feedback);
    }
  }, 2000);
}
