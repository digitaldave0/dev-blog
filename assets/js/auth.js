// Check authentication
function checkAuth() {
    if (!localStorage.getItem('blogAuth') && window.location.pathname !== '/login.html') {
        window.location.href = '/login.html';
    }
}

// Run check when page loads
checkAuth();

// Add event listener for storage changes (in case user opens multiple tabs)
window.addEventListener('storage', function(e) {
    if (e.key === 'blogAuth') {
        checkAuth();
    }
});
