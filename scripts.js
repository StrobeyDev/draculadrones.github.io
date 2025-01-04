document.addEventListener('DOMContentLoaded', function() {
    fetch('house.json')
        .then(response => response.json())
        .then(projects => {
            Object.keys(projects).forEach(projectId => {
                fetch(projects[projectId].path)
                    .then(response => response.json())
                    .then(projectData => {
                        const card = document.querySelector(`#${projectId}`);
                        if (card) {
                            // Update status
                            const statusElement = card.querySelector('.house-status');
                            if (statusElement) {
                                statusElement.textContent = `Status: ${projectData.currentPhase}`;
                            }
                            
                            // Update links
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
        .catch(error => {
            console.error('Error loading house statuses:', error);
            const statusElements = document.querySelectorAll('.house-status');
            statusElements.forEach(el => {
                el.textContent = 'Status: Error loading';
            });
        });
});

document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            const imgAlt = item.querySelector('img').alt;
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            lightbox.classList.add('active');
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
}); 