document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.getElementById('projectsContainer');
    let allProjects = [];

    async function loadProjects() {
        try {
            const response = await fetch('data.json');
            allProjects = await response.json();
            renderProjects(allProjects);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }
    }

    function renderProjects(projects) {
        projectsContainer.innerHTML = '';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div>
                    <span>${project.category}</span>
                    <span>${project.status}</span>
                </div>
                <div>
                    <strong>Клиент:</strong> ${project.client} | <strong>Год:</strong> ${project.year}
                </div>
                <div>
                    <strong>Стек:</strong> ${project.stack.join(', ')}
                </div>
            `;
            projectsContainer.appendChild(card);
        });
    }

    await loadProjects();
});