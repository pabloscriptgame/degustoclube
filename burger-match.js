document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('username')) {
        alert('Faça login na página inicial para jogar!');
        window.location.href = 'index.html';
    }
});

let matchCards = [];
let selectedCards = [];
let matchedPairs = 0;
let matchStartTime = 0;

function startBurgerMatch() {
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