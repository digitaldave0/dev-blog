document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let posts = [];

  // Fetch search data from search.json
  fetch('/search.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch search.json');
      }
      return response.json();
    })
    .then(data => {
      posts = data;
      console.log('Posts loaded:', posts.length);
    })
    .catch(error => {
      console.error('Error loading search data:', error);
      searchResults.innerHTML = '<p>Error loading search data.</p>';
    });

  // Search function
  function performSearch(query) {
    if (query.length < 2) {
      searchResults.innerHTML = '<p>Start typing to see results.</p>';
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = [];

    posts.forEach(post => {
      const titleMatch = post.title.toLowerCase().includes(lowerQuery);
      const contentMatch = post.content.toLowerCase().includes(lowerQuery);
      const excerptMatch = post.excerpt.toLowerCase().includes(lowerQuery);

      if (titleMatch || contentMatch || excerptMatch) {
        // Find context around the match
        let matchContext = '';
        if (contentMatch) {
          matchContext = extractSnippet(post.content, lowerQuery);
        } else if (excerptMatch) {
          matchContext = extractSnippet(post.excerpt, lowerQuery);
        } else {
          matchContext = post.excerpt ? post.excerpt.substring(0, 150) + '...' : 'No preview available.';
        }

        results.push({
          title: post.title,
          url: post.url,
          snippet: matchContext,
          date: post.date
        });
      }
    });

    displayResults(results, query);
  }

  function extractSnippet(text, query) {
    const index = text.toLowerCase().indexOf(query);
    if (index === -1) {
      return text.substring(0, 150) + '...';
    }

    const start = Math.max(0, index - 60);
    const end = Math.min(text.length, index + query.length + 60);

    let snippet = text.substring(start, end);
    
    // Add ellipsis if not at start/end
    if (start > 0) {
      snippet = '...' + snippet;
    }
    if (end < text.length) {
      snippet = snippet + '...';
    }

    // Highlight the query term
    const regex = new RegExp(`(${query})`, 'gi');
    snippet = snippet.replace(regex, '<mark>$1</mark>');

    return snippet;
  }

  function displayResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `<p>No results found for "${query}"</p>`;
      return;
    }

    let html = `<p>Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"</p>`;
    html += '<div class="search-results-list">';

    results.forEach(result => {
      html += `
        <div class="search-result-item">
          <h3><a href="${result.url}">${result.title}</a></h3>
          <p class="search-result-snippet">${result.snippet}</p>
          <p class="search-result-date">${new Date(result.date).toLocaleDateString()}</p>
        </div>
      `;
    });

    html += '</div>';
    searchResults.innerHTML = html;
  }

  // Event listener for search input
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      performSearch(e.target.value);
    });
  }
});
