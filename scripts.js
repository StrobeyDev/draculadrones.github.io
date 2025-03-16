/**
 * Main JavaScript functionality for the Dracula Drones website
 * Handles house status updates, image gallery, and animations
 */

// When the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Only try to fetch house status if we're on the houses page
    const houseCards = document.querySelectorAll('.house-card');
    if (houseCards.length > 0) {
        try {
            // Use relative path from current page
            const housePath = window.location.pathname.includes('houses/') ? '../../../house.json' : 'house.json';
            fetch(housePath)
                .then(response => response.json())
                .then(projects => {
                    Object.keys(projects).forEach(projectId => {
                        const card = document.querySelector(`#${projectId}`);
                        if (card) {
                            const statusElement = card.querySelector('.house-status');
                            if (statusElement) {
                                // Update with actual status from projects data
                                const status = projects[projectId].status;
                                statusElement.innerHTML = `Status: ${status} 🩸`; // Add back the blood droplet
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading house statuses:', error);
                    const statusElements = document.querySelectorAll('.house-status');
                    statusElements.forEach(el => {
                        el.textContent = 'Status: Error loading';
                    });
                });
        } catch (error) {
            console.error('Error in house status update:', error);
        }
    }

    // Lightbox functionality
    initializeLightbox();

    // Typing animation reset - only run on pages with tagline
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        tagline.addEventListener('animationend', function(e) {
            if (e.animationName === 'typing') {
                setTimeout(() => {
                    tagline.style.animation = 'none';
                    tagline.offsetHeight; // Trigger reflow
                    tagline.style.animation = null;
                }, 4000);
            }
        });
    }
});

function initializeLightbox() {
    // Create lightbox structure if it doesn't exist
    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        // Create lightbox content container
        const content = document.createElement('div');
        content.className = 'lightbox-content';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'lightbox-header';
        
        const title = document.createElement('h3');
        title.className = 'lightbox-title';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        // Create both buttons the exact same way
        const downloadImageBtn = document.createElement('button');
        downloadImageBtn.className = 'download-image-btn';
        downloadImageBtn.textContent = 'Download';
        
        // Recreate the open button to match download button exactly
        const openImageBtn = document.createElement('button');
        openImageBtn.className = 'download-image-btn open-in-tab-btn'; // Add second class for identification
        openImageBtn.textContent = 'Open in New Tab';
        
        buttonContainer.appendChild(downloadImageBtn);
        buttonContainer.appendChild(openImageBtn);
        
        header.appendChild(title);
        header.appendChild(buttonContainer);
        
        // Create image container
        const img = document.createElement('img');
        img.className = 'lightbox-image';
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '×';
        closeBtn.setAttribute('aria-label', 'Close lightbox');
        
        // Assemble the lightbox
        content.appendChild(header);
        content.appendChild(img);
        lightbox.appendChild(content);
        lightbox.appendChild(closeBtn);
        
        // Add to document
        document.body.appendChild(lightbox);
    }

    // Get references to lightbox elements
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const openImageBtn = lightbox.querySelector('.open-in-tab-btn');
    const downloadImageBtn = lightbox.querySelector('.download-image-btn:not(.open-in-tab-btn)');

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

    // Update lightbox content with null checks
    function updateLightboxContent(index) {
        if (!galleryItems[index]) return;
        
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title');
        
        if (lightboxImg && img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        }
        
        if (lightboxTitle) {
            lightboxTitle.textContent = title ? title.textContent : '';
        }
        
        if (openImageBtn && img) {
            openImageBtn.onclick = () => window.open(img.src, '_blank');
        }
        
        if (downloadImageBtn && img) {
            downloadImageBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = img.src;
                const fileName = img.src.split('/').pop() || 'image.jpg';
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        }
        
        if (prevButton) {
            prevButton.style.display = index === 0 ? 'none' : 'flex';
        }
        
        if (nextButton) {
            nextButton.style.display = index === galleryItems.length - 1 ? 'none' : 'flex';
        }
    }

    // Only set up gallery if there are gallery items
    const galleryImages = document.querySelectorAll('.gallery-item');
    if (galleryImages.length > 0) {
        galleryImages.forEach((item, index) => {
            galleryItems.push(item);
            item.addEventListener('click', () => {
                currentIndex = index;
                updateLightboxContent(currentIndex);
                lightbox.classList.add('active');
            });
        });
    }

    // Event listeners with null checks
    if (prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex > 0) {
                currentIndex--;
                updateLightboxContent(currentIndex);
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex < galleryItems.length - 1) {
                currentIndex++;
                updateLightboxContent(currentIndex);
            }
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }
}

function updateLightboxContent(imageSrc, title) {
    // ... existing code ...

    // Update the download button to trigger a download
    const downloadBtn = document.querySelector('.download-image-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = imageSrc;
            link.download = title || 'image'; // Use the title as filename, or 'image' if no title
            
            // Programmatically click the link to trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // ... existing code ...
} 