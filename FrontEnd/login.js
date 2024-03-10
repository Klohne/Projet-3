document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('mdp');
    const errorMsg = document.getElementById('login-error-msg');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

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
                const response = await fetch('https://projet-3-ucub.onrender.com/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email, password})
                });
                    if(response.ok) {
                        const data = await response.json();
                        // Stockage du token d'authentification dans le sessionStorage
                        sessionStorage.setItem('token', data.token);
                        console.log(sessionStorage)
                        // Redirection vers index.html en cas de connexion réussie
                        window.location.href = 'index.html';
                    } else {
                        errorMsg.style.opacity = "1";
                    };
            } catch (error){
                errorMsg.style.opacity = "1";
            }   
        };
    });
});
