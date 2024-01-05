document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('mdp');
    const errorMsg = document.getElementById('login-error-msg');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Empêche l'envoi du formulaire par défaut

        // Récupération des valeurs des champs
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validation des champs
        if (email === '' || password === '') {
            errorMsg.innerText = 'Veuillez remplir tous les champs.';
            errorMsg.style.opacity = "1";
        } else {
            try {
                // Envoi des données
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(email, password)
                });
                    if(response.ok) {
                        // Stockage du token d'authentification dans le localStorage
                        sessionStorage.setItem('token', token);
                        console.log(localStorage)
                        // Redirection vers index.html en cas de connexion réussie
                        window.location.href = 'index.html';
                    } else {
                        throw new Error('Erreur dans l\'identifiant ou le mot de passe' )
                    };
            } catch (error){
                errorMsg.style.opacity = "1";
            }   
        };
    });
});
