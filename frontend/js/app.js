// Navigation
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const viewName = item.dataset.view;
        switchView(viewName);
    });
});

function switchView(viewName) {
    // Update nav items
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewName);
    });

    // Update views
    views.forEach(view => {
        view.classList.toggle('active', view.id === `${viewName}View`);
    });
}

// New Project button
document.querySelector('.btn-new-project').addEventListener('click', () => {
    switchView('editor');
});

// Terminal panel
const terminalPanel = document.getElementById('terminalPanel');
const closeTerminalBtn = document.querySelector('.btn-close-terminal');

closeTerminalBtn.addEventListener('click', () => {
    terminalPanel.classList.add('hidden');
});

// Load projects on startup
function loadProjects() {
    api.getProjects()
        .then(projects => {
            const projectsList = document.getElementById('projectsList');
            projectsList.innerHTML = '';

            if (projects.length === 0) {
                projectsList.innerHTML = `
                    <div class="no-projects">
                        <i class="fas fa-folder-open"></i>
                        <p>No projects yet. Create one to get started!</p>
                    </div>
                `;
            } else {
                projects.forEach(project => {
                    const card = document.createElement('div');
                    card.className = 'project-card';
                    card.innerHTML = `
                        <h3>${project.name}</h3>
                        <p>${project.description || 'No description'}</p>
                        <small>${project.language} • ${new Date(project.createdAt).toLocaleDateString()}</small>
                    `;
                    card.addEventListener('click', () => {
                        document.getElementById('projectName').value = project.name;
                        document.getElementById('languageSelect').value = project.language;
                        switchView('editor');
                    });
                    projectsList.appendChild(card);
                });
            }

            document.getElementById('projectsCount').textContent = projects.length;
        })
        .catch(error => {
            console.error('Failed to load projects:', error);
        });
}

// Update stats
function updateStats() {
    loadProjects();
    // Executions count would come from backend
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
});
