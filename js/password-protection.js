/**
 * Password protection functionality for secured project pages
 * Works in conjunction with config.js which stores the access keys
 */

// Constants
const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Check if a project is currently authorized
 * @param {string} projectId - The ID of the project to check
 * @returns {boolean} - Whether the project is authorized
 */
function isProjectAuthorized(projectId) {
    if (!projectId) return false;
    
    const isAuthorized = sessionStorage.getItem(`project-${projectId}-authorized`) === 'true';
    const authTime = parseInt(sessionStorage.getItem(`project-${projectId}-auth-time`)) || 0;
    const currentTime = Date.now();
    
    // Check if authorization is valid and not expired
    return isAuthorized && (currentTime - authTime) < AUTH_DURATION;
}

/**
 * Initialize page protection
 * This runs immediately when the script loads
 */
(function initializeProtection() {
    // Get project ID from URL
    const pathParts = window.location.pathname.split('/');
    const housesIndex = pathParts.indexOf('houses');
    const projectId = housesIndex !== -1 && pathParts.length > housesIndex + 1 ? pathParts[housesIndex + 1] : null;

    // If not authorized, ensure content is hidden and overlay is shown
    if (!isProjectAuthorized(projectId)) {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', function() {
            const content = document.getElementById('protected-content');
            const overlay = document.getElementById('password-overlay');
            if (content) content.style.display = 'none';
            if (overlay) overlay.style.display = 'flex';
        });
    }
})();

/**
 * Add event listener for Enter key on password input
 */
window.addEventListener('load', function() {
    const passwordInput = document.getElementById('project-password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                checkPassword();
            }
        });
    }
});

/**
 * Validates the entered password against stored keys
 * Shows/hides content based on validation result
 */
function checkPassword() {
    const password = document.getElementById('project-password').value;
    const pathParts = window.location.pathname.split('/');
    const housesIndex = pathParts.indexOf('houses');
    const projectId = housesIndex !== -1 && pathParts.length > housesIndex + 1 ? pathParts[housesIndex + 1] : null;

    if (password === projectKeys[projectId]) {
        document.getElementById('password-overlay').style.display = 'none';
        document.getElementById('protected-content').style.display = 'block';
        // Save authorization in session storage to persist across page refreshes
        sessionStorage.setItem(`project-${projectId}-authorized`, 'true');
        // Store the timestamp of authorization
        sessionStorage.setItem(`project-${projectId}-auth-time`, Date.now());
    } else {
        document.getElementById('password-error').textContent = 'Incorrect access key';
    }
}

/**
 * Toggles password visibility in the input field
 * Updates the eye icon to reflect current state
 */
function togglePassword() {
    const passwordInput = document.getElementById('project-password');
    const toggleButton = document.querySelector('.toggle-password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    toggleButton.querySelector('.eye-icon').textContent = type === 'password' ? '🙈' : '👀';
}

/**
 * Check for existing authorization on page load
 * Automatically shows content if previously authorized in this session
 */
window.addEventListener('load', function() {
    const pathParts = window.location.pathname.split('/');
    const housesIndex = pathParts.indexOf('houses');
    const projectId = housesIndex !== -1 && pathParts.length > housesIndex + 1 ? pathParts[housesIndex + 1] : null;

    // Check if authorized and if the authorization is still valid (24 hours)
    if (projectId) {
        const isAuthorized = sessionStorage.getItem(`project-${projectId}-authorized`) === 'true';
        const authTime = parseInt(sessionStorage.getItem(`project-${projectId}-auth-time`)) || 0;
        const currentTime = Date.now();
        const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (isAuthorized && (currentTime - authTime) < AUTH_DURATION) {
            document.getElementById('password-overlay').style.display = 'none';
            document.getElementById('protected-content').style.display = 'block';
        } else {
            // Clear expired authorization
            sessionStorage.removeItem(`project-${projectId}-authorized`);
            sessionStorage.removeItem(`project-${projectId}-auth-time`);
        }
    }
}); 