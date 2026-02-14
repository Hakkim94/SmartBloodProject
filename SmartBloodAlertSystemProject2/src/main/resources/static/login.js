document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const loginButton = document.querySelector('.btn-login');
    
    // Hide error message
    errorMessage.style.display = 'none';
    
    // Disable button during request
    loginButton.disabled = true;
    loginButton.textContent = 'LOGGING IN...';
    
    // Prepare request body
    const loginData = {
        username: username,
        password: password
    };
    
    // Call backend API
    fetch('/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.ok) {
            // Success - redirect to dashboard
            loginButton.textContent = '✓ SUCCESS';
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            // Error - show error message
            errorMessage.style.display = 'block';
            loginButton.disabled = false;
            loginButton.textContent = 'LOGIN';
        }
    })
    .catch(error => {
        // Network or other error
        console.error('Login error:', error);
        errorMessage.style.display = 'block';
        loginButton.disabled = false;
        loginButton.textContent = 'LOGIN';
    });
});
