

// ettendre l'envoi de la forme
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Recevoir les donnes de la forme
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        email: email,
        password: password
    };

    // URL, pour request
    const url = 'http://localhost:5678/api/users/login';

    // Options request
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Modifier en JSON
    };

    // Fetch request
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            // Verif. userId et token dans le reponse du servuer.
            if (data.userId && data.token) {
                //Si pas et email OK rediriger vers page admin.
                window.location.href = 'admin.html';
            } else {
                alert('Erreur dans l’identifiant ou le mot de passe');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


