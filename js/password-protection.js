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
 * Get project ID from current URL
 * @returns {string|null} - The project ID or null if not found
 */
function getProjectId() {
    const pathParts = window.location.pathname.split('/');
    const housesIndex = pathParts.indexOf('houses');
    return housesIndex !== -1 && pathParts.length > housesIndex + 1 ? pathParts[housesIndex + 1] : null;
}

/**
 * Initialize page protection
 * This runs immediately when the script loads
 */
(function initializeProtection() {
    const projectId = getProjectId();
    
    // Set initial display states before DOM loads to prevent flash
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setInitialDisplayStates);
    } else {
        setInitialDisplayStates();
    }

    function setInitialDisplayStates() {
        const content = document.getElementById('protected-content');
        const overlay = document.getElementById('password-overlay');
        
        if (isProjectAuthorized(projectId)) {
            if (content) content.style.display = 'block';
            if (overlay) overlay.style.display = 'none';
        } else {
            if (content) content.style.display = 'none';
            if (overlay) overlay.style.display = 'flex';
        }
    }
})();

/**
 * Validates the entered password against stored keys
 * Shows/hides content based on validation result
 */
function checkPassword() {
    const password = document.getElementById('project-password').value;
    const projectId = getProjectId();

    if (password === projectKeys[projectId]) {
        document.getElementById('password-overlay').style.display = 'none';
        document.getElementById('protected-content').style.display = 'block';
        // Save authorization in session storage
        sessionStorage.setItem(`project-${projectId}-authorized`, 'true');
        sessionStorage.setItem(`project-${projectId}-auth-time`, Date.now().toString());
    } else {
        document.getElementById('password-error').textContent = 'Incorrect access key';
    }
}

/**
 * Toggles password visibility in the input field
 */
function togglePassword() {
    const passwordInput = document.getElementById('project-password');
    const eyeIcon = document.querySelector('.eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.textContent = '👁️';
    } else {
        passwordInput.type = 'password';
        eyeIcon.textContent = '🙈';
    }
}

// Add enter key support for password input
document.addEventListener('DOMContentLoaded', function() {
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