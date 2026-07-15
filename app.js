document.addEventListener('DOMContentLoaded', async () => {
    
    const projectsContainer = document.getElementById('projectsContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');
    const resultsCount = document.getElementById('resultsCount');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalContent = document.getElementById('modalContent');

    let allProjects = [];

    // Загрузка данных
    async function loadProjects() {
        try {
            const response = await fetch('data.json');
            allProjects = await response.json();
            populateCategories();
            filterAndRender();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            projectsContainer.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Не удалось загрузить данные</p>';
        }
    }

    // Заполнение категорий
    function populateCategories() {
        const categories = [...new Set(allProjects.map(project => project.category))];
        categoryFilter.innerHTML = '<option value="">Все категории</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Сортировка
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

    // Фильтрация и отображение
    function filterAndRender() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        let filtered = allProjects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchTerm) || 
                                  project.description.toLowerCase().includes(searchTerm) ||
                                  project.stack.some(tech => tech.toLowerCase().includes(searchTerm));
            const matchesCategory = !selectedCategory || project.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // Сортируем отфильтрованные
        filtered = sortProjects(filtered);

        // Обновляем счётчик
        resultsCount.textContent = filtered.length;

        renderProjects(filtered);
    }

    // Отображение карточек
    function renderProjects(projects) {
        projectsContainer.innerHTML = '';

        if (projects.length === 0) {
            projectsContainer.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1; font-size: 1.2rem;">😕 Ничего не найдено. Попробуйте изменить запрос.</p>';
            return;
        }

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            card.innerHTML = `
                <img src="${project.image}" alt="${project.name}" style="width: 100%; border-radius: 8px; margin-bottom: 15px;">
                <h3>${project.name}</h3>
                <p style="color: #666; margin: 10px 0;">${project.description}</p>
                <div style="margin-top: 15px;">
                    <span style="background: #667eea; color: white; padding: 5px 10px; border-radius: 5px; font-size: 0.9rem;">
                        ${project.category}
                    </span>
                    <span style="background: #764ba2; color: white; padding: 5px 10px; border-radius: 5px; font-size: 0.9rem; margin-left: 10px;">
                        ${project.status}
                    </span>
                </div>
                <div style="margin-top: 15px; color: #888; font-size: 0.9rem;">
                    <strong>Клиент:</strong> ${project.client} | <strong>Год:</strong> ${project.year}
                </div>
                <div style="margin-top: 10px;">
                    <strong>Стек:</strong> ${project.stack.join(', ')}
                </div>
            `;
            
            // Клик по карточке открывает модалку
            card.addEventListener('click', () => openModal(project));
            
            projectsContainer.appendChild(card);
        });
    }

    // Открытие модального окна
    function openModal(project) {
        modalContent.innerHTML = `
            <img src="${project.image}" alt="${project.name}">
            <h2>${project.name}</h2>
            <div class="detail-row">
                <span class="detail-label">Описание:</span>
                <p>${project.description}</p>
            </div>
            <div class="detail-row">
                <span class="detail-label">Категория:</span>
                <span style="background: #667eea; color: white; padding: 5px 10px; border-radius: 5px;">${project.category}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Статус:</span>
                <span style="background: #764ba2; color: white; padding: 5px 10px; border-radius: 5px;">${project.status}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Клиент:</span>
                ${project.client}
            </div>
            <div class="detail-row">
                <span class="detail-label">Год:</span>
                ${project.year}
            </div>
            <div class="detail-row">
                <span class="detail-label">Стек технологий:</span>
                <div class="stack-tags">
                    ${project.stack.map(tech => `<span class="stack-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;
        modalOverlay.classList.add('active');
    }

    // Закрытие модального окна
    function closeModal() {
        modalOverlay.classList.remove('active');
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Обработчики событий
    searchInput.addEventListener('input', filterAndRender);
    categoryFilter.addEventListener('change', filterAndRender);
    sortSelect.addEventListener('change', filterAndRender);

    // Загрузка
    await loadProjects();
});