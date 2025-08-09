document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projects-grid');
    const filterList = document.querySelector('.filter-list');
    let allProjects = [];
    let allTags = new Set();

    async function loadProjects() {
        const res = await fetch('/api/get-projects');
        allProjects = await res.json();
        
        // Kumpulkan semua tag unik dan buat checkbox
        allProjects.forEach(p => p.tags.forEach(tag => allTags.add(tag)));
        createFilters();
        
        displayProjects(allProjects);
    }

    function createFilters() {
        allTags.forEach(tag => {
            const li = document.createElement('li');
            li.innerHTML = `<input type="checkbox" id="${tag}" name="${tag}" value="${tag}"><label for="${tag}">${tag}</label>`;
            filterList.appendChild(li);
        });
        filterList.addEventListener('change', handleFilterChange);
    }

    function displayProjects(projects) {
        projectsGrid.innerHTML = '';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.tags = project.tags.join(',');
            card.innerHTML = `
                <h3>Project ${projectsGrid.children.length + 1} // _${project.name}</h3>
                <div class="card-image"><img src="${project.image}" alt="${project.name}"></div>
                <p>${project.description || 'A project from my GitHub.'}</p>
                <a href="${project.url}" target="_blank" class="view-button">view-project</a>
            `;
            projectsGrid.appendChild(card);
        });
    }

    function handleFilterChange() {
        const checkedTags = Array.from(filterList.querySelectorAll('input:checked')).map(input => input.value);
        
        if (checkedTags.length === 0) {
            displayProjects(allProjects);
            return;
        }

        const filteredProjects = allProjects.filter(project => 
            checkedTags.every(tag => project.tags.includes(tag))
        );
        displayProjects(filteredProjects);
    }

    loadProjects();
});