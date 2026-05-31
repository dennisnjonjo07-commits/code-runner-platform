function switchForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    showLoading(true);

    api.login(email, password)
        .then(response => {
            api.setToken(response.token);
            showToast('Login successful!', 'success');
            switchToApp(response.user);
        })
        .catch(error => {
            showToast(error.message, 'error');
        })
        .finally(() => showLoading(false));
}

function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    showLoading(true);

    api.register(username, email, password, confirmPassword)
        .then(response => {
            showToast('Account created! Please login.', 'success');
            switchForm();
        })
        .catch(error => {
            showToast(error.message, 'error');
        })
        .finally(() => showLoading(false));
}

function switchToApp(user) {
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
    document.getElementById('userEmail').textContent = user.email;
}

function handleLogout() {
    api.logout()
        .then(() => {
            localStorage.removeItem('token');
            document.getElementById('appContainer').classList.add('hidden');
            document.getElementById('authContainer').classList.remove('hidden');
            document.getElementById('loginFormElement').reset();
            showToast('Logged out successfully', 'success');
        })
        .catch(error => {
            showToast(error.message, 'error');
        });
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };

    toast.innerHTML = `
        <i class="${iconMap[type]}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Event listeners
document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
document.getElementById('logoutBtn').addEventListener('click', handleLogout);

// Check if already logged in
window.addEventListener('load', () => {
    if (api.token) {
        api.verifyToken()
            .then(response => {
                switchToApp(response.user);
            })
            .catch(() => {
                localStorage.removeItem('token');
            });
    }
});
