document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('mdp');
    const errorMsg = document.getElementById('login-error-msg');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche l'envoi du formulaire par défaut

        // Récupération des valeurs des champs
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // Validation des champs
        if (emailValue === '' || passwordValue === '') {
            errorMsg.innerText = 'Veuillez remplir tous les champs.';
            errorMsg.style.opacity = "1";
        }else if (emailValue != email || passwordValue != password) {
            errorMsg.style.opacity = "1";
        }else {
            // Création de l'objet à envoyer
            const formData = {
                email: emailValue,
                password: passwordValue
            };

            // Envoi des données
            fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(tokenResponse => {
                // Stockage du token d'authentification dans le localStorage
                sessionStorage.setItem('token', tokenResponse.token);
                console.log(sessionStorage)
                // Redirection vers index.html en cas de connexion réussie
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error(error);
            });
        }
    });
});
