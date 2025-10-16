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
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
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
    loadChat();
    updateDeCoins();
}

// Chat
function loadChat() {
    const messages = JSON.parse(localStorage.getItem('chat-messages')) || [];
    document.getElementById('chat-messages').innerHTML = messages.map(msg => `<p><strong>${msg.user}:</strong> ${msg.text}</p>`).join('');
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const username = localStorage.getItem('username');
    if (input.value && username) {
        const messages = JSON.parse(localStorage.getItem('chat-messages')) || [];
        messages.push({ user: username, text: input.value });
        localStorage.setItem('chat-messages', JSON.stringify(messages));
        loadChat();
        input.value = '';
        earnDeCoins(5);
    } else {
        alert('Faça login e digite uma mensagem!');
    }
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

// Jogo 1: Burger Catch
let catchGameRunning = false;
let catchScore = 0;
let playerX = 130;
const canvas = document.getElementById('burger-catch');
const ctx = canvas.getContext('2d');
const ingredients = [
    { emoji: '🍔', points: 10 },
    { emoji: '🥓', points: 15 },
    { emoji: '🧀', points: 20 },
    { emoji: '💣', points: -50 }
];
let fallingItems = [];

function startBurgerCatch() {
    if (catchGameRunning) return;
    catchGameRunning = true;
    catchScore = 0;
    playerX = 130;
    fallingItems = [];
    document.getElementById('catch-score').textContent = catchScore;
    document.addEventListener('keydown', movePlayer);
    canvas.addEventListener('touchstart', handleTouch);
    spawnItem();
    gameLoop();
}

function movePlayer(e) {
    if (e.key === 'ArrowLeft' && playerX > 0) playerX -= 10;
    if (e.key === 'ArrowRight' && playerX < canvas.width - 40) playerX += 10;
}

function handleTouch(e) {
    if (!catchGameRunning) return;
    e.preventDefault();
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    if (touchX < canvas.width / 2 && playerX > 0) {
        playerX -= 20;
    } else if (touchX >= canvas.width / 2 && playerX < canvas.width - 40) {
        playerX += 20;
    }
}

function spawnItem() {
    if (!catchGameRunning) return;
    const item = ingredients[Math.floor(Math.random() * ingredients.length)];
    fallingItems.push({ x: Math.random() * (canvas.width - 30), y: 0, item });
    setTimeout(spawnItem, 1000);
}

function gameLoop() {
    if (!catchGameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff007a';
    ctx.fillRect(playerX, canvas.height - 20, 40, 20);
    fallingItems = fallingItems.filter(item => item.y < canvas.height);
    fallingItems.forEach(item => {
        item.y += 2;
        ctx.font = '20px Arial';
        ctx.fillText(item.item.emoji, item.x, item.y);
        if (item.y > canvas.height - 30 && item.x > playerX - 30 && item.x < playerX + 50) {
            catchScore += item.item.points;
            fallingItems = fallingItems.filter(i => i !== item);
            document.getElementById('catch-score').textContent = catchScore;
            if (catchScore >= 500) {
                earnDeCoins(50);
                alert('Parabéns! +50 DêCoins por atingir 500 pontos!');
            }
        }
    });
    if (catchScore < 0) {
        catchGameRunning = false;
        alert('Game Over! Pontuação: ' + catchScore);
        document.removeEventListener('keydown', movePlayer);
        canvas.removeEventListener('touchstart', handleTouch);
        return;
    }
    requestAnimationFrame(gameLoop);
}

// Jogo 2: Burger Trivia
const triviaQuestions = [
    {
        question: 'Qual é o ingrediente principal do X-COSTELA?',
        options: ['Costela desfiada', 'Tilápia', 'Goiabada', 'Frango'],
        answer: 'Costela desfiada'
    },
    {
        question: 'Qual molho é exclusivo da DêGusto?',
        options: ['Barbecue', 'Goiabada', 'Maionese', 'Ketchup'],
        answer: 'Goiabada'
    },
    {
        question: 'Quantos hambúrgueres tem o X-DOBRO PODEROSO?',
        options: ['1', '2', '3', '4'],
        answer: '2'
    }
];
let currentQuestion = 0;
let triviaScore = 0;

function startTrivia() {
    if (!localStorage.getItem('username')) {
        alert('Faça login para jogar!');
        return;
    }
    currentQuestion = 0;
    triviaScore = 0;
    document.getElementById('trivia-score').textContent = triviaScore;
    loadTriviaQuestion();
}

function loadTriviaQuestion() {
    const q = triviaQuestions[currentQuestion];
    document.getElementById('trivia-question').textContent = q.question;
    document.getElementById('trivia-options').innerHTML = q.options.map((opt, i) => 
        `<label><input type="radio" name="trivia" value="${opt}">${opt}</label>`
    ).join('<br>') + '<br><button class="clube-button" onclick="checkTrivia()">Responder</button>';
}

function checkTrivia() {
    const selected = document.querySelector('input[name="trivia"]:checked');
    if (!selected) {
        alert('Selecione uma opção!');
        return;
    }
    if (selected.value === triviaQuestions[currentQuestion].answer) {
        triviaScore += 10;
        earnDeCoins(5);
        document.getElementById('trivia-score').textContent = triviaScore;
    }
    currentQuestion++;
    if (currentQuestion < triviaQuestions.length) {
        loadTriviaQuestion();
    } else {
        alert('Trivia concluída! Pontuação: ' + triviaScore);
    }
}

// Jogo 3: Burger Match
let matchCards = [];
let selectedCards = [];
let matchedPairs = 0;
let matchStartTime = 0;

function startBurgerMatch() {
    if (!localStorage.getItem('username')) {
        alert('Faça login para jogar!');
        return;
    }
    matchedPairs = 0;
    selectedCards = [];
    matchStartTime = Date.now();
    document.getElementById('match-pairs').textContent = matchedPairs;
    document.getElementById('match-time').textContent = '0s';
    
    const emojis = ['🍔', '🍔', '🥓', '🥓', '🧀', '🧀', '🍟', '🍟'];
    matchCards = emojis.sort(() => Math.random() - 0.5).map((emoji, i) => ({ id: i, emoji, flipped: false }));
    
    const grid = document.getElementById('match-game');
    grid.innerHTML = matchCards.map(card => 
        `<div class="memory-card" data-id="${card.id}" onclick="flipCard(${card.id})">${card.flipped ? card.emoji : '?'}</div>`
    ).join('');
    
    updateMatchTime();
}

function flipCard(id) {
    if (selectedCards.length < 2 && !matchCards[id].flipped) {
        matchCards[id].flipped = true;
        selectedCards.push(matchCards[id]);
        document.querySelector(`.memory-card[data-id="${id}"]`).textContent = matchCards[id].emoji;
        
        if (selectedCards.length === 2) {
            if (selectedCards[0].emoji === selectedCards[1].emoji) {
                matchedPairs++;
                document.getElementById('match-pairs').textContent = matchedPairs;
                selectedCards = [];
                earnDeCoins(10);
                if (matchedPairs === matchCards.length / 2) {
                    const timeTaken = Math.floor((Date.now() - matchStartTime) / 1000);
                    alert('Você venceu! Tempo: ' + timeTaken + 's');
                }
            } else {
                setTimeout(() => {
                    selectedCards.forEach(card => {
                        matchCards[card.id].flipped = false;
                        document.querySelector(`.memory-card[data-id="${card.id}"]`).textContent = '?';
                    });
                    selectedCards = [];
                }, 1000);
            }
        }
    }
}

function updateMatchTime() {
    if (matchedPairs < matchCards.length / 2) {
        const time = Math.floor((Date.now() - matchStartTime) / 1000);
        document.getElementById('match-time').textContent = time + 's';
        setTimeout(updateMatchTime, 1000);
    }
}

// Jogo 4: Burger Builder
function buildBurger() {
    if (!localStorage.getItem('username')) {
        alert('Faça login para jogar!');
        return;
    }
    const bun = document.getElementById('bun').value;
    const patty = document.getElementById('patty').value;
    const toppings = document.getElementById('toppings').value;
    document.getElementById('burger-result').textContent = `Seu burger: ${bun} com ${patty} e ${toppings}!`;
    const username = localStorage.getItem('username');
    const messages = JSON.parse(localStorage.getItem('chat-messages')) || [];
    messages.push({ user: username, text: `Meu burger: ${bun}, ${patty}, ${toppings}` });
    localStorage.setItem('chat-messages', JSON.stringify(messages));
    loadChat();
    earnDeCoins(10);
}