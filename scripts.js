/**
 * Main JavaScript functionality for the Dracula Drones website
 * Handles house status updates, image gallery, and animations
 */

// When the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Fetch and update house statuses from JSON data
    fetch('house.json')
        .then(response => response.json())
        .then(projects => {
            // For each house in the data
            Object.keys(projects).forEach(projectId => {
                // Fetch the specific house's data
                fetch(projects[projectId].path)
                    .then(response => response.json())
                    .then(projectData => {
                        // Find the card element for this house
                        const card = document.querySelector(`#${projectId}`);
                        if (card) {
                            // Update the status text
                            const statusElement = card.querySelector('.house-status');
                            if (statusElement) {
                                statusElement.textContent = `Status: ${projectData.currentPhase}`;
                            }
                            
                            // Update all links in the card
                            const links = card.querySelectorAll('a');
                            links.forEach(link => {
                                if (link.classList.contains('house-image-link') || 
                                    link.classList.contains('view-house')) {
                                    link.href = `houses/${projectId}/updates/${projectData.latestUpdate}`;
                                }
                            });
                        }
                    });
            });
        })
        // If there's an error loading the data
        .catch(error => {
            console.error('Error loading house statuses:', error);
            const statusElements = document.querySelectorAll('.house-status');
            statusElements.forEach(el => {
                el.textContent = 'Status: Error loading';
            });
        });
});

/**
 * Image Gallery Lightbox Functionality
 * - Opens images in a modal overlay
 * - Displays image title
 * - Provides full-size image access
 * - Closes on overlay/X click
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get references to lightbox elements
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const openImageBtn = lightbox.querySelector('.open-image-btn');

    // Add click handlers to all gallery images
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            // Get the clicked image's source and alt text
            const imgSrc = item.querySelector('img').src;
            const imgAlt = item.querySelector('img').alt;
            const imgTitle = item.querySelector('.gallery-title').textContent;
            // Update and show the lightbox
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            lightboxTitle.textContent = imgTitle;
            lightbox.classList.add('active');
            // Update the open in new tab button
            openImageBtn.onclick = () => window.open(imgSrc, '_blank');
        });
    });

    // Close lightbox when clicking the X button
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
});

/**
 * Typing Animation Reset
 * Resets the tagline typing animation every 4 seconds
 * for continuous effect on the homepage
 */
document.addEventListener('DOMContentLoaded', function() {
    const tagline = document.querySelector('.tagline');
    tagline.addEventListener('animationend', function(e) {
        if (e.animationName === 'typing') {
            setTimeout(() => {
                tagline.style.animation = 'none';
                tagline.offsetHeight; // Trigger reflow
                tagline.style.animation = null;
            }, 4000); // Wait 4 seconds before restarting
        }
    });
}); 