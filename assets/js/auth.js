// Check authentication
function checkAuth() {
    // Get the current path
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.endsWith('login.html');
    const isAuthenticated = localStorage.getItem('blogAuth') === 'true';

    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && !isLoginPage) {
        window.location.href = '/login.html';
        return false;
    }

    // If authenticated and on login page, redirect to home
    if (isAuthenticated && isLoginPage) {
        window.location.href = '/';
        return false;
    }

    return true;
}

// Run check immediately when script loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

// Add event listener for storage changes (in case user opens multiple tabs)
window.addEventListener('storage', function(e) {
    if (e.key === 'blogAuth') {
        checkAuth();
    }
});
