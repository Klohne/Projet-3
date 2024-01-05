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

            /* Affichage de la modale */
            modalDisplay();
            displayProjectsModal(allProjects);
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

    const portfolioSection = document.getElementById('portfolio');
    portfolioSection.insertBefore(filtersContainer, document.querySelector('.gallery'));


    
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
}


/* MODALE */


// Fonction pour afficher les projets dans la modale
function displayProjectsModal(projects) {
    const modalGallery = document.querySelector('.modal-gallery');
    modalGallery.innerHTML = '';

    projects.forEach((project) => {
        const galleryFigure = document.createElement("figure");
        const imageProject = document.createElement("img");
        imageProject.src = project.imageUrl;
        imageProject.alt = project.title;
        const deleteDiv = document.createElement("div");
        deleteDiv.classList.add('delete-div', 'delete-btn');
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add('fa-solid', 'fa-trash-can', 'delete-btn');

        modalGallery.appendChild(galleryFigure);
        galleryFigure.appendChild(imageProject);
        galleryFigure.appendChild(deleteDiv);
        galleryFigure.appendChild(deleteIcon);
    });

    /* Suppression des projets dans la modale */
    document.querySelector('delete-btn').addEventListener('click', function(event){
        const figure = event.target.closest('figure');

        const workId = figure.project.id;

        fetch (`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(function(response){
            if(response.ok){
                displayProjectsModal();
                displayProjects();
            } else{
                console.error('Erreur dans la suppression du projet');
            }
        })
        .catch(function(error){
            console.error('Erreur dans la suppression du projet', error);
        })
    })
}

/* Affichage de la modale */

function modalDisplay(){

    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
    
    document.querySelectorAll('.js-modal').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            modal.style.display = null;
            
        });
    
        document.querySelectorAll('.close').forEach(function (closeBtn) {
            closeBtn.addEventListener('click', function () {
                modal.style.display = 'none';
            });
        });
    
        document.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    
        window.addEventListener('keydown', function (e) {
            if (e.key === "Escape" || e.key === "Esc") {
                modal.style.display = 'none'
            }
        });
    });

}

function editionBar(){
    const editionBar = document.createElement('div');
    editionBar.classList.add('edition-bar');
    body.appendChild(editionBar)
    body.insertBefore(editionBar, document.querySelector('.head-title'));
}
