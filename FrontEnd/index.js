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
            logout.addEventListener('click', (event) => {
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


/* Masquage du bouton "modifier" */
const editBtn = document.querySelector('.js-modal');
editBtn.style.display = 'none';

/* Masquage de la modale */
const modal = document.querySelector('.modal');
modal.style.display = 'none';

/* Masquage de la 2eme modale */
const modal2 = document.getElementById('modal2');
modal2.style.display = 'none';


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
    }

};



/* Nettoie champs modale2 */

function clearModal(){
    const output = document.getElementById('output');
    const selectPhotoInput = document.getElementById('select-photo');
    const titleInput = document.getElementById('titre');

    modal.style.display = 'none';
    modal2.style.display = 'none';
    output.removeAttribute('src');
    selectPhotoInput.style.display = null;
    titleInput.value = '';
};

/* Fenêtre MODALE */

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
                clearModal()
            });
        });

        document.addEventListener('click', function (e) {
            if (e.target === modal || e.target === modal2) {
                clearModal()
            }
        });

        window.addEventListener('keydown', function (e) {
            if (e.key === "Escape" || e.key === "Esc") {
                clearModal()
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
        deleteIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-sm', 'delete-btn');

        modalGallery.appendChild(galleryFigure);
        galleryFigure.appendChild(imageProject);
        galleryFigure.appendChild(deleteDiv);
        galleryFigure.appendChild(deleteIcon);

        /* Suppression des projets dans la modale */
        deleteIcon.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const myToken = sessionStorage.getItem('token');

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

                // Mettre à jour la galerie principale si besoin
                const sectionGallery = document.querySelector('.gallery');
                const imageToDelete = sectionGallery.querySelector(`[alt="${project.title}"]`);
                if (imageToDelete) {
                    imageToDelete.parentElement.remove(); // Supprimer l'image de la galerie principale
                }
            } else {
                alert("Echec de suppression");
            }
        });
    })

    const modal2 = document.getElementById('modal2');
    const nextModal = document.querySelector('.add-photo');
    const previous = document.querySelector('.previous');

    nextModal.addEventListener('click', (e) => {
        modal.style.display = 'none'
        modal2.style.display = null
    });
    previous.addEventListener('click', (e) => {
        modal2.style.display = 'none'
        modal.style.display = null
    });
}


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


/* Affichage de l'image à upload */
const loadFile = function (event) {
    const output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src); // libérer la mémoire
        checkInputs(); // Vérifier les champs après le chargement de l'image
    };

    /* Masquage du bouton ajouter photo lors de l'upload */
    const selectPhotoInput = document.getElementById('select-photo');
    output.addEventListener('load', () => {
        selectPhotoInput.style.display = 'none';
    });

    const cancelImage = document.querySelector('.cancel-img');
    cancelImage.addEventListener('click', () =>{
        output.removeAttribute('src');
        selectPhotoInput.style.display = null;
        checkInputs();
    })
};

const checkInputs = function () {
    const imageFormSubmit = document.querySelector('.valider-photo');
    const titreInput = document.getElementById('titre');
    const output = document.getElementById('output');

    if (titreInput.value.trim().length > 0 && output.src !== '') {
        imageFormSubmit.removeAttribute('disabled');
        imageFormSubmit.style.cursor = 'pointer';
        imageFormSubmit.style.background = '#1D6154';
    } else {
        imageFormSubmit.setAttribute('disabled', 'disabled');
        imageFormSubmit.style.cursor = 'default';
        imageFormSubmit.style.background = '#A7A7A7';
    }
};

// Ajout d'écouteurs d'événements
document.getElementById('select-photo').addEventListener('change', loadFile);
document.getElementById('titre').addEventListener('input', checkInputs);


/* Ajout des nouveaux projets à la galerie */


// Fonction pour l'envoi des données du formulaire

// Fonction pour l'envoi des données du formulaire
async function addPhoto() {
    const imageForm = document.getElementById('imageForm');

    imageForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Empêche l'envoi du formulaire par défaut

        const myToken = sessionStorage.getItem('token');

        // Récupération des valeurs
        const titleInput = document.getElementById('titre');
        const title = titleInput.value.trim();

        const categoryInput = document.getElementById('categorie');
        const category = categoryInput.value;

        const fileInput = document.getElementById('fileInput');
        const image = fileInput.files[0]; // Récupérer le fichier image

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", category);


    function addToGallery(project) {
        const sectionGallery = document.querySelector('.gallery');
        const galleryFigure = document.createElement("figure");
        const imageProject = document.createElement("img");
        imageProject.src = URL.createObjectURL(image);
        imageProject.alt = project.title;
        const titleProject = document.createElement("figcaption");
        titleProject.innerText = project.title;
    
        sectionGallery.prepend(galleryFigure);
        galleryFigure.appendChild(imageProject);
        galleryFigure.appendChild(titleProject);
    }

            function addToModal(project){
                const modalGallery = document.querySelector('.modal-gallery');    
                
                    const galleryFigure = document.createElement("figure");
                    const imageProject = document.createElement("img");
                    imageProject.src = URL.createObjectURL(image);
                    imageProject.alt = project.title;
                    const projectId = project.id;
                    const deleteDiv = document.createElement("div");
                    deleteDiv.classList.add('delete-div', 'delete-btn');
                    const deleteIcon = document.createElement("i");
                    deleteIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-sm', 'delete-btn');
            
                    modalGallery.prepend(galleryFigure);
                    galleryFigure.appendChild(imageProject);
                    galleryFigure.appendChild(deleteDiv);
                    galleryFigure.appendChild(deleteIcon);

                    /* Suppression des projets dans la modale */
                deleteIcon.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const myToken = sessionStorage.getItem('token');

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
            }

        try {
            // Envoi des données
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${myToken}`,
                },
                body: formData,
            });
            if (response.ok) {
                // Si la requête est réussie, effectuez les actions nécessaires ici
                const newProject = await response.json(); // Supposons que la réponse renvoie les détails du nouveau projet

                // Ajouter le nouveau projet à la galerie
                addToGallery(newProject);
                addToModal(newProject);
                clearModal();

                console.log('Image envoyée avec succès !');
                console.log('Nouveau projet ajouté à la galerie :', newProject); // Vérifiez ici si les données du nouveau projet sont correctes
            } else {
                // Gérer les erreurs si la requête échoue
                console.error('Échec de l\'envoi de l\'image.');
            }
        } catch (error) {
            // Gestion des erreurs
            console.error('Une erreur s\'est produite : ', error);
        }
    });
    
}

// Appel de la fonction pour envoyer les données du formulaire
addPhoto();
checkInputs();


