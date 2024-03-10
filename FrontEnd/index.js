//////////////////////////////
/*  Récupération des projets */
fetch("https://projet-3-ucub.onrender.com/api/works")
    .then((response) => response.json())
    .then((projects) => {
        // Stockage des projets
        const allProjects = projects;

        // Affichage initial de tous les projets
        displayProjects(allProjects);

        // Récupération des catégories
        fetch("https://projet-3-ucub.onrender.com/api/categories")
            .then((response) => response.json())
            .then((categories) => {
                // Stockage des catégories
                const allCategories = categories;
                // Création des boutons de filtre
                createFilterButtons(allCategories, allProjects);
            });


        // Affichage du bouton logout et déconnexion
        if (token) {
            const logout = document.querySelector('.login');
            logout.innerText = 'logout';
            logout.addEventListener('click', () => {
                sessionStorage.removeItem('token');
                logout.href = 'index.html';
            });

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

const token = sessionStorage.getItem('token');

/* Masquage du bouton "filtres" */
if (!token) {
    const modifFilters = document.querySelector('.modif-filters');
    modifFilters.style.display = 'none'
}


///////////////////////////
/* Affichage des projets */
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


///////////////////////////////////
/* Création des boutons de filtre */
function createFilterButtons(allCategories, allProjects) {

    // Bouton d'affichage des filtres en mode édition
    const displayFilters = document.querySelector('.display-filters');

    const filtersContainer = document.createElement("div");
    filtersContainer.classList.add("filters-container");

    const portfolioSection = document.getElementById('portfolio');
    portfolioSection.insertBefore(filtersContainer, document.querySelector('.gallery'));

    // Filtre "Tous"
    const btnTous = document.createElement("button");
    btnTous.classList.add('filtresBtn');
    btnTous.innerText = "Tous";
    // Afficher tous les projets au clic sur "Tous"
    btnTous.addEventListener('click', function () {
        displayProjects(allProjects);
    });
    filtersContainer.appendChild(btnTous);

    // Filtres pour chaque catégorie
    allCategories.forEach((category) => {
        const btnFilters = document.createElement("button");
        btnFilters.classList.add('filtresBtn');
        btnFilters.innerText = category.name;
        btnFilters.addEventListener('click', function () {
            const filteredProjects = allProjects.filter((project) => {
                return project.category.name === category.name;
            });
            // Afficher les projets filtréss
            displayProjects(filteredProjects);
        });
        filtersContainer.appendChild(btnFilters);
    });

    /* Bouton pour Afficher / Cacher les filtres */
    // Variable pour suivre l'état actuel des filtres
    let filtersVisible = false;

    if (token) {
        filtersContainer.style.display = 'none';
        displayFilters.addEventListener('click', () => {
            if (filtersVisible) {
                filtersContainer.style.display = 'none';
            } else {
                filtersContainer.style.display = null;
            }
            // Inversion de l'état des filtres
            filtersVisible = !filtersVisible;
        });
    }
};


///////////////////////////
/* Nettoie champs modale2 */
function clearModal() {
    const output = document.getElementById('output');
    const selectPhotoInput = document.getElementById('select-photo');
    const titleInput = document.getElementById('titre');

    modal.style.display = 'none';
    modal2.style.display = 'none';
    output.removeAttribute('src');
    selectPhotoInput.style.display = null;
    titleInput.value = '';
};

/////////////////////
/* Fenêtre MODALE */
function modalDisplay() {

    const editBtn = document.querySelector('.js-modal');
    editBtn.style.display = null;

    // Ouverture modale
    document.querySelectorAll('.js-modal').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            modal.style.display = null;

        });
        // Fermeture au clic croix
        document.querySelectorAll('.close').forEach(function (closeBtn) {
            closeBtn.addEventListener('click', function () {
                clearModal();
            });
        });
        // Fermeture au clic en dehors de la modale
        document.addEventListener('click', function (e) {
            if (e.target === modal || e.target === modal2) {
                clearModal();
            }
        });
        // Fermeture avec "echap"
        window.addEventListener('keydown', function (e) {
            if (e.key === "Escape" || e.key === "Esc") {
                clearModal();
            }
        });
    });

}

/////////////////////////////////////
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

        // Boutons de suppression
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

            const response = await fetch(`https://projet-3-ucub.onrender.com/api/works/${projectId}`, {
                method: "DELETE",
                headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${token}`,
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

    // Navigation entre les deux modales
    const modal2 = document.getElementById('modal2');
    const nextModal = document.querySelector('.add-photo');
    const previous = document.querySelector('.previous');

    nextModal.addEventListener('click', () => {
        modal.style.display = 'none'
        modal2.style.display = null
    });
    previous.addEventListener('click', () => {
        modal2.style.display = 'none'
        modal.style.display = null
    });
}

///////////////////////////////////////
/* Création de la barre du mode édition */
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

/////////////////////////////
/* Redirection du clic  sur l'input #select-photo vers l'input #fileInput */
function handleSelectPhotoClick() {
    document.getElementById('fileInput').click();
}
document.getElementById('select-photo').addEventListener('click', handleSelectPhotoClick);

/* Ecoute de l'ajout d'image dans #output pour appeler la fonction loadFile */
document.getElementById('fileInput').addEventListener('change', function (event) {
    loadFile(event);
});


//////////////////////////////////
/* Affichage de l'image à upload dans la modale */
function loadFile(event) {
    const output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src); // libérer la mémoire
        checkInputs(); // Vérifier les champs après le chargement de l'image
    };

    /* Masquage du bouton ajouter photo lors de l'upload */
    const selectPhotoInput = document.getElementById('select-photo')
    output.addEventListener('load', () => {
        selectPhotoInput.style.display = 'none';
    });
    /* Réaffichage du bouton si annulation de l'upload */
    const cancelImage = document.querySelector('.cancel-img');
    cancelImage.addEventListener('click', () => {
        output.removeAttribute('src');
        selectPhotoInput.style.display = null;
        checkInputs();
    })
};

///////////////////////////////////
/* Vérification que les champs du formulaires sont tous remplis */
function checkInputs() {
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
    };

};
// Ecoute du champ "titre" pour vérifier qu'il contient des caractères.
document.getElementById('titre').addEventListener('input', checkInputs);




////////////////////////////////////////////
/* Ajout des nouvelles photos dans la galerie et la modale */
async function addPhoto() {
    const imageForm = document.getElementById('imageForm');

    imageForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Récupération des valeurs
        const titleInput = document.getElementById('titre');
        const title = titleInput.value.trim();

        const categoryInput = document.getElementById('categorie');
        const category = categoryInput.value;

        const fileInput = document.getElementById('fileInput');

        // Récupérer le fichier image
        const image = fileInput.files[0];

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", category);

        // Ajout des nouvelles images dans la galerie
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

        // Ajout des nouvelles images dans la modale et suppression
        function addToModal(project) {
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

            // Suppression des projets dans la modale
            deleteIcon.addEventListener('click', async (event) => {
                event.preventDefault();

                const response = await fetch(`https://projet-3-ucub.onrender.com/api/works/${projectId}`, {
                    method: "DELETE",
                    headers: {
                        accept: "*/*",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    console.log(response);

                    // Supprimer l'élément de la galerie modale
                    galleryFigure.remove();

                    // Mettre à jour la galerie principale
                    const sectionGallery = document.querySelector('.gallery');
                    const imageToDelete = sectionGallery.querySelector(`[alt="${project.title}"]`);
                    if (imageToDelete) {
                        imageToDelete.parentElement.remove(); // Supprimer l'image de la galerie principale
                    }
                } else {
                    alert("Echec de suppression");
                }
            });
        }
        try {
            // Envoi des valeurs pour l'ajout des images
            const response = await fetch('https://projet-3-ucub.onrender.com/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            if (response.ok) {
                const newProject = await response.json();

                // Ajouter le nouveau projet à la galerie et à la modale
                addToGallery(newProject);
                addToModal(newProject);
                clearModal();
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

addPhoto();
checkInputs();


