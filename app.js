document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.getElementById('projectsContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');
    const resultsCount = document.getElementById('resultsCount');
    
    // Элементы модального окна
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalClient = document.getElementById('modalClient');
    const modalYear = document.getElementById('modalYear');
    const modalStatus = document.getElementById('modalStatus');
    const modalStack = document.getElementById('modalStack');

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
            card.style.cursor = 'pointer'; // Показываем, что можно кликнуть
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
            
            // Добавляем обработчик клика для открытия модалки
            card.addEventListener('click', () => openModal(project));
            
            projectsContainer.appendChild(card);
        });
    }

    function openModal(project) {
        modalTitle.textContent = project.name;
        modalDescription.textContent = project.description;
        modalClient.textContent = project.client;
        modalYear.textContent = project.year;
        modalStatus.textContent = project.status;
        modalStack.textContent = project.stack.join(', ');
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    modalClose.addEventListener('click', closeModal);
    
    // Закрытие по клику вне окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

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