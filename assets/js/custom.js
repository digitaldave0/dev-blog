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
        // Don't navigate if clicking on a link, tag, or other interactive element
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
    
    // Make "Home" links navigate to the full URL
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
      // Convert relative URLs to absolute
      let absoluteUrl = href;
      if (!href.startsWith('http')) {
        absoluteUrl = baseUrl.replace(/\/$/, '') + (href.startsWith('/') ? href : '/' + href);
      }
      link.setAttribute('href', absoluteUrl);
    }
  });
});
