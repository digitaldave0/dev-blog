// Make avatar clickable to go home
document.addEventListener('DOMContentLoaded', function() {
  // Avatar click to go home
  const avatar = document.querySelector('.sidebar-top img, .avatar');
  if (avatar) {
    avatar.style.cursor = 'pointer';
    avatar.addEventListener('click', function() {
      window.location.href = '/dev-blog/';
    });
  }

  // Home button click
  const homeLink = document.querySelector('a[title="Home"], a[href*="/dev-blog/"]');
  if (homeLink) {
    homeLink.addEventListener('click', function(e) {
      if (window.location.pathname !== '/dev-blog/') {
        e.preventDefault();
        window.location.href = '/dev-blog/';
      }
    });
  }

  // Ensure post links are clickable
  const postTitles = document.querySelectorAll('.post-title a, .post-preview a');
  postTitles.forEach(link => {
    link.style.cursor = 'pointer';
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        window.location.href = href;
      }
    });
  });
});
