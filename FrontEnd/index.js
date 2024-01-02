// Récupération des projets
fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((projects) => {
        // Stockage des projets
        const allProjects = projects;
        
        // Affichage initial de tous les projets
        displayProjects(allProjects);
        
        // Récupération des catégories
        fetch("http://localhost:5678/api/categories")
            .then((response) => response.json())
            .then((categories) => {
                // Stockage des catégories
                const allCategories = categories;
                // Création des boutons de filtre
                createFilterButtons(categories, allProjects);
            });
    });

// Fonction pour afficher les projets
function displayProjects(projects) {
    const sectionGallery = document.querySelector('.gallery');
    sectionGallery.innerHTML = '';
    
    projects.forEach((project) => {
        const galleryFigure = document.createElement("figure");
        const imageProject = document.createElement("img");
        imageProject.src = project.imageUrl;
        imageProject.alt = project.title;
        const titleProject = document.createElement("figcaption");
        titleProject.innerText = project.title;

        sectionGallery.appendChild(galleryFigure);
        galleryFigure.appendChild(imageProject);
        galleryFigure.appendChild(titleProject);
    });
}

// Fonction pour créer les boutons de filtre
function createFilterButtons(categories, allProjects) {
    const filtersContainer = document.createElement("div");
    filtersContainer.classList.add("filters-container");
    
    // Bouton "Tous"
    const btnTous = document.createElement("button");
    btnTous.classList.add('filtresBtn');
    btnTous.innerText = "Tous";
    // Afficher tous les projets au clic sur "Tous"
    btnTous.addEventListener('click', function () {
        displayProjects(allProjects); 
    });
    filtersContainer.appendChild(btnTous);

    // Boutons pour chaque catégorie
    categories.forEach((category) => {
        const btnFilters = document.createElement("button");
        btnFilters.classList.add('filtresBtn');
        btnFilters.innerText = category.name;
        btnFilters.addEventListener('click', function () {
            const filteredProjects = allProjects.filter((project) => {
                return project.category.name === category.name;
            });
            displayProjects(filteredProjects); // Afficher les projets filtrés
        });
        filtersContainer.appendChild(btnFilters);
    });

    const portfolioSection = document.getElementById('portfolio');
    portfolioSection.insertBefore(filtersContainer, document.querySelector('.gallery'));
}
