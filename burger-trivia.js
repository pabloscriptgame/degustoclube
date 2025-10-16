document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('username')) {
        alert('Faça login na página inicial para jogar!');
        window.location.href = 'index.html';
    }
});

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