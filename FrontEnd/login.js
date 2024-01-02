document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('mdp');
    const errorMsgHolder = document.getElementById('login-error-msg-holder');
    const errorMsg = document.getElementById('login-error-msg');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche l'envoi du formulaire par défaut

        // Récupération des valeurs des champs
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // Validation des champs
        if (emailValue === '' || passwordValue === '') {
            errorMsg.textContent = 'Veuillez remplir tous les champs.';
            errorMsgHolder.style.display = 'block';
        } else {
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
            .then(response => {
                if (response.ok) {
                    // Redirection vers index.html en cas de connexion réussie
                    window.location.href = 'index.html';
                } else {
                    errorMsg.style.opacity = "1";
                }
                
            });
        }
    });
});
