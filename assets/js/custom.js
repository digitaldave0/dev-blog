// Make avatar and home clickable to navigate
document.addEventListener('DOMContentLoaded', function() {
  const baseUrl = '/dev-blog/';
  
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

  // Find and enhance home navigation links
  const navLinks = document.querySelectorAll('a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent.toLowerCase();
    
    // Make "Home" links navigate properly
    if (text.includes('home') || href === '/' || href === baseUrl) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = baseUrl;
      });
    }
  });

  // Ensure post links are clickable
  const postLinks = document.querySelectorAll('.post-title a, .post-preview a');
  postLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#')) {
      link.style.cursor = 'pointer';
      link.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = href;
      });
    }
  });
});
