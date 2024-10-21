document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the username and password values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Simple authentication check (username and password are both "1234")
    if (username === 'Safeties' && password === '111') {
        // Redirect to the health monitoring dashboard (replace with the actual page)
        window.location.href = 'index.html';
    } else {
        // Show error message
        errorMessage.textContent = 'Incorrect username or password.';
        errorMessage.style.display = 'block';
    }
});
