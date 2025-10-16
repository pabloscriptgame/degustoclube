document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('username')) {
        alert('Faça login na página inicial para jogar!');
        window.location.href = 'index.html';
    }
});

function buildBurger() {
    const bun = document.getElementById('bun').value;
    const patty = document.getElementById('patty').value;
    const toppings = document.getElementById('toppings').value;
    document.getElementById('burger-result').textContent = `Seu burger: ${bun} com ${patty} e ${toppings}!`;
    earnDeCoins(10);
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