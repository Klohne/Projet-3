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

        // Récupération du token depuis le sessionStorage
        const token = sessionStorage.getItem('token');

        // Affichage du bouton modifier si le token est stocké
        if (token) {
            const logout = document.querySelector('.login');
            logout.innerText = 'logout';
            logout.addEventListener('click', (event)=>{
                sessionStorage.removeItem('token');
               logout.href = 'index.html';
            });

            const projetTitle = document.querySelector('.modif-btn')
            projetTitle.style.margin = '139px 0 80px 0'

            editionBar();
            modalDisplay();
            displayProjectsModal(allProjects);

        }
    });

    const editBtn = document.querySelector('.js-modal');
    editBtn.style.display = 'none';

    const modal = document.querySelector('.modal');
    modal.style.display = 'none';

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

    const token = sessionStorage.getItem('token');

    // Affichage des filtres uniquement si le token n'existe pas
    if (!token) {
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
    } else {
        btnFilters.style.display = 'none'
    }

}


/* MODALE */

function modalDisplay() {

    const editBtn = document.querySelector('.js-modal');
    editBtn.style.display = null;

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

// Fonction pour afficher les projets dans la modale
function displayProjectsModal(projects) {
    const modalGallery = document.querySelector('.modal-gallery');
    modalGallery.innerHTML = '';

    projects.forEach((project) => {
        const galleryFigure = document.createElement("figure");
        const imageProject = document.createElement("img");
        imageProject.src = project.imageUrl;
        imageProject.alt = project.title;
        const projectId = project.id;
        const deleteDiv = document.createElement("div");
        deleteDiv.classList.add('delete-div', 'delete-btn');
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add('fa-solid', 'fa-trash-can','fa-sm', 'delete-btn');

        modalGallery.appendChild(galleryFigure);
        galleryFigure.appendChild(imageProject);
        galleryFigure.appendChild(deleteDiv);
        galleryFigure.appendChild(deleteIcon);

        /* Suppression des projets dans la modale */
        deleteIcon.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const myToken = sessionStorage.getItem('token');
            console.log(myToken);
            console.log(projectId);

            const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                method: "DELETE",
                headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${myToken}`,
                },
            });
            if (response.ok) {
                console.log(response);
                // Supprimer l'élément de la galerie modale
                galleryFigure.remove();
            } else {
                alert("Echec de suppression");
            }
        });
    })
};


/* Barre du mode édition */
function editionBar() {

    /* Barre édition */
    const editionBar = document.createElement('div');
    editionBar.classList.add('edition-bar');
    const headerNav = document.getElementById('headerNav');
    headerNav.insertBefore(editionBar, document.querySelector('.nav'));
    /* Contenu barre édition */
    const barText = document.createElement('p');
    barText.innerText = 'Mode édition'
    const barIcon = document.createElement('i')
    barIcon.classList.add('fa-regular', 'fa-pen-to-square');
    const barContenu = document.createElement('div');
    barContenu.appendChild(barIcon);
    barContenu.appendChild(barText);
    editionBar.appendChild(barContenu);
    /* Ajustements head-title et nav */
    const headTitle = document.querySelector('.head-title');
    headTitle.style.margin = '70px 0 0 0';
    const navLinks = document.querySelector('.nav-links')
    navLinks.style.margin = "70px 0 0 0"

}


