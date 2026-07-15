document.addEventListener('DOMContentLoaded', async () => {
    // 1. Получаем элементы со страницы
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

    // 2. Функция загрузки данных из JSON
    async function loadProjects() {
        try {
            const response = await fetch('data.json');
            allProjects = await response.json();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }

    // 3. Функция отрисовки карточек (теперь с картинками!)
    function renderProjects(projects) {
        projectsContainer.innerHTML = ''; // Очищаем контейнер
        
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.cursor = 'pointer'; // Показываем, что можно кликнуть
            
            // Вставляем HTML карточки, включая картинку
            card.innerHTML = `
                <img src="${project.image}" alt="${project.name}" class="project-image">
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
            
            // При клике на карточку открываем модальное окно
            card.addEventListener('click', () => openModal(project));
            
            projectsContainer.appendChild(card);
        });
    }

    // 4. Функции для модального окна
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

    // Закрытие по крестику
    modalClose.addEventListener('click', closeModal);
    
    // Закрытие по клику на затемнённый фон
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 5. Функция сортировки
    function sortProjects(projects) {
        const sortValue = sortSelect.value;
        const sorted = [...projects]; // Создаём копию массива, чтобы не мутировать оригинал
        
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

    // 6. Главная функция: фильтрация + сортировка + отрисовка
    function filterAndRender() {
        const term = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        
        const filtered = allProjects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(term);
            const matchesCategory = !category || project.category === category;
            return matchesSearch && matchesCategory;
        });
        
        // Обновляем счётчик
        resultsCount.textContent = filtered.length;
        
        // Сортируем и отрисовываем
        renderProjects(sortProjects(filtered));
    }

    // 7. Вешаем слушатели событий на поля ввода
    searchInput.addEventListener('input', filterAndRender);
    categoryFilter.addEventListener('change', filterAndRender);
    sortSelect.addEventListener('change', filterAndRender);

    // 8. Запускаем при загрузке страницы
    await loadProjects();
    
    // Заполняем выпадающий список категорий уникальными значениями из данных
    const categories = [...new Set(allProjects.map(p => p.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    await filterAndRender();
});