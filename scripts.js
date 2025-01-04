document.addEventListener('DOMContentLoaded', function() {
    fetch('project-status.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Loaded data:', data); // Debug log
            Object.keys(data).forEach(projectId => {
                const statusElement = document.querySelector(`#${projectId} .project-status`);
                if (statusElement) {
                    statusElement.textContent = `Status: ${data[projectId].currentPhase}`;
                } else {
                    console.log(`Element not found for project: ${projectId}`); // Debug log
                }
            });
        })
        .catch(error => {
            console.error('Error loading project statuses:', error);
            // Show error in status
            const statusElements = document.querySelectorAll('.project-status');
            statusElements.forEach(el => {
                el.textContent = 'Status: Error loading';
            });
        });
}); 