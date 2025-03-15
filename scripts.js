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
 * - Navigate between images with prev/next buttons
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get references to lightbox elements
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const openImageBtn = lightbox.querySelector('.open-image-btn');

    // Create navigation buttons
    const prevButton = document.createElement('button');
    prevButton.className = 'lightbox-nav lightbox-prev';
    prevButton.innerHTML = '←';
    prevButton.setAttribute('aria-label', 'Previous image');

    const nextButton = document.createElement('button');
    nextButton.className = 'lightbox-nav lightbox-next';
    nextButton.innerHTML = '→';
    nextButton.setAttribute('aria-label', 'Next image');

    // Add navigation buttons to lightbox
    lightbox.appendChild(prevButton);
    lightbox.appendChild(nextButton);

    // Store all gallery items and current index
    let galleryItems = [];
    let currentIndex = 0;

    // Update lightbox content
    function updateLightboxContent(index) {
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = title.textContent;
        openImageBtn.onclick = () => window.open(img.src, '_blank');
        
        // Update button states
        prevButton.style.display = index === 0 ? 'none' : 'flex';
        nextButton.style.display = index === galleryItems.length - 1 ? 'none' : 'flex';
    }

    // Add click handlers to all gallery images
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        galleryItems.push(item);
        item.addEventListener('click', () => {
            currentIndex = index;
            updateLightboxContent(currentIndex);
            lightbox.classList.add('active');
        });
    });

    // Navigation button click handlers
    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            currentIndex--;
            updateLightboxContent(currentIndex);
        }
    });

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex < galleryItems.length - 1) {
            currentIndex++;
            updateLightboxContent(currentIndex);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateLightboxContent(currentIndex);
        }
        else if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) {
            currentIndex++;
            updateLightboxContent(currentIndex);
        }
        else if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        }
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