// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('username')) {
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
        showLoggedInFeatures();
    }
    setupTabs();
});

// Configuração das abas
function setupTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            if (!button.onclick) { // Only handle tab switching for Perfil
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(button.dataset.tab).classList.add('active');
            }
        });
    });
}

// Registro e Login
function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('decoins', 100);
        document.getElementById('user-status').textContent = `Bem-vindo, ${username}!`;
        showLoggedInFeatures();
    } else {
        alert('Preencha todos os campos!');
    }
}

function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (username === localStorage.getItem('username') && password === localStorage.getItem('password')) {
        document.getElementById('user-status').textContent = `Bem-vindo de volta, ${username}!`;
        showLoggedInFeatures();
    } else {
        alert('Credenciais inválidas!');
    }
}

function showLoggedInFeatures() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    updateDeCoins();
}

// DêCoins
function updateDeCoins() {
    const balance = localStorage.getItem('decoins') || 0;
    document.getElementById('decoins-balance').textContent = balance;
}

function earnDeCoins(amount) {
    let balance = parseInt(localStorage.getItem('decoins')) || 0;
    balance += amount;
    localStorage.setItem('decoins', balance);
    updateDeCoins();
}