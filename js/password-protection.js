/**
 * Password protection functionality for secured project pages
 * Works in conjunction with config.js which stores the access keys
 */

/**
 * Add event listener for Enter key on password input
 */
window.addEventListener('load', function() {
    const passwordInput = document.getElementById('project-password');
    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkPassword();
        }
    });
});

/**
 * Validates the entered password against stored keys
 * Shows/hides content based on validation result
 */
function checkPassword() {
    const password = document.getElementById('project-password').value;
    const pathParts = window.location.pathname.split('/');
    // Extract project ID from URL (e.g., 'house1' from /houses/house1/...)
    const projectId = pathParts.includes('house1') ? 'house1' : null;

    if (password === projectKeys[projectId]) {
        document.getElementById('password-overlay').style.display = 'none';
        document.getElementById('protected-content').style.display = 'block';
        // Save authorization in session storage to persist across page refreshes
        sessionStorage.setItem(`project-${projectId}-authorized`, 'true');
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
    const projectId = pathParts.includes('house1') ? 'house1' : null;
    if (sessionStorage.getItem(`project-${projectId}-authorized`) === 'true') {
        document.getElementById('password-overlay').style.display = 'none';
        document.getElementById('protected-content').style.display = 'block';
    }
}); 