---
layout: page
title: Search
permalink: /search/
---

<div class="search-container">
    <input type="text" id="search-input" placeholder="Search blog posts...">
    <ul id="results-container"></ul>
</div>

<script src="https://unpkg.com/simple-jekyll-search@latest/dest/simple-jekyll-search.min.js"></script>
<script>
  window.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    const searchInput = document.getElementById('search-input');

    if (searchQuery) {
      searchInput.value = searchQuery;
    }

    var sjs = SimpleJekyllSearch({
      searchInput: searchInput,
      resultsContainer: document.getElementById('results-container'),
      json: '{{ "/assets/search.json" | relative_url }}',
      searchResultTemplate: '<div class="search-result"><a href="{url}"><h3>{title}</h3></a><span class="date">{date}</span><p>{description}</p></div>',
      noResultsText: 'No results found',
      limit: 10,
      fuzzy: false
    });

    if (searchQuery) {
      // Trigger the search
      sjs.search(searchQuery);
    }
  });
</script>

<style>
.search-container {
    margin: 2rem 0;
}

#search-input {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    transition: all 0.3s ease;
}

#search-input:focus {
    border-color: #00bfff;
    outline: none;
    box-shadow: 0 0 5px rgba(0,191,255,0.3);
}

#results-container {
    list-style-type: none;
    padding: 0;
    margin: 20px 0;
}

.search-result {
    margin-bottom: 2rem;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(255,255,255,0.05);
    transition: all 0.3s ease;
}

.search-result:hover {
    background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
}

.search-result h3 {
    margin: 0 0 0.5rem 0;
    color: #00bfff;
}

.search-result .date {
    font-size: 0.9rem;
    color: #888;
}

.search-result p {
    margin: 0.5rem 0 0 0;
    line-height: 1.4;
}
</style>
