document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('username')) {
        alert('Faça login na página inicial para jogar!');
        window.location.href = 'index.html';
    }
});

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

function earnDeCoins(amount) {
    let balance = parseInt(localStorage.getItem('decoins')) || 0;
    balance += amount;
    localStorage.setItem('decoins', balance);
}

function copyCode() {
    const codeContent = document.getElementById('code-content').textContent;
    navigator.clipboard.writeText(codeContent).then(() => {
        alert('Código copiado para a área de transferência!');
    }).catch(err => {
        alert('Erro ao copiar código: ' + err);
    });
}