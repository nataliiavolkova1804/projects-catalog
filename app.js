document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.getElementById('projectsContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');
    const resultsCount = document.getElementById('resultsCount');
    let allProjects = [];

    async function loadProjects() {
        try {
            const response = await fetch('data.json');
            allProjects = await response.json();
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

    function sortProjects(projects) {
        const sortValue = sortSelect.value;
        const sorted = [...projects];
        
        switch (sortValue) {
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'year-desc':
                sorted.sort((a, b) => b.year - a.year);
                break;
            case 'year-asc':
                sorted.sort((a, b) => a.year - b.year);
                break;
        }
        
        return sorted;
    }

    function filterAndRender() {
        const term = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        
        const filtered = allProjects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(term);
            const matchesCategory = !category || project.category === category;
            return matchesSearch && matchesCategory;
        });
        
        resultsCount.textContent = filtered.length;
        renderProjects(sortProjects(filtered));
    }

    searchInput.addEventListener('input', filterAndRender);
    categoryFilter.addEventListener('change', filterAndRender);
    sortSelect.addEventListener('change', filterAndRender);

    await loadProjects();
    await filterAndRender();
});