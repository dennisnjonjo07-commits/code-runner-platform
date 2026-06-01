// Connect to WebSocket
const socket = io();

// Navigation
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const page = item.getAttribute('data-page');
    if (page === 'logout') {
      handleLogout();
    } else {
      navigateToPage(page);
    }
  });
});

function navigateToPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Show selected page
  const pageElement = document.getElementById(pageName + '-page');
  if (pageElement) {
    pageElement.classList.add('active');
  }

  // Update active nav item
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === pageName) {
      item.classList.add('active');
    }
  });
}

// Login form handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const [emailInput, passwordInput] = loginForm.querySelectorAll('input');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value
        })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigateToPage('dashboard');
        document.querySelector('.sidebar').style.display = 'flex';
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  });
}

// Register form handler
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const [usernameInput, emailInput, passwordInput] = registerForm.querySelectorAll('input');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.value,
          email: emailInput.value,
          password: passwordInput.value
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Account created! Please login.');
        switchToLogin();
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('Registration failed');
    }
  });
}

function switchToLogin() {
  document.getElementById('login-page').classList.add('active');
  document.getElementById('register-page').classList.remove('active');
}

function switchToRegister() {
  document.getElementById('register-page').classList.add('active');
  document.getElementById('login-page').classList.remove('active');
}

function handleLogout() {
  localStorage.removeItem('token');
  document.querySelector('.sidebar').style.display = 'none';
  switchToLogin();
}

// Check if user is logged in
window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  if (token) {
    document.querySelector('.sidebar').style.display = 'flex';
    navigateToPage('dashboard');
  } else {
    document.querySelector('.sidebar').style.display = 'none';
    switchToLogin();
  }
});

// Socket.io events
socket.on('connect', () => {
  console.log('Connected to server');
  addLog('Connected to CodeRunner server ✓');
});

socket.on('log', (message) => {
  addLog(message);
});

socket.on('error', (error) => {
  addLog(`Error: ${error}`);
});

function addLog(message) {
  const terminal = document.getElementById('terminal');
  if (terminal) {
    const logLine = document.createElement('div');
    logLine.textContent = message;
    terminal.appendChild(logLine);
    terminal.scrollTop = terminal.scrollHeight;
  }
}

console.log('CodeRunner app initialized');