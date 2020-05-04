const player1 = "x";
const player2 = "o";
let playerTime = player1;
let gameOver = false;
let casosSucesso = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];

AtualizarMostrador();
OnClickEspaco();

function AtualizarMostrador() {
    if (gameOver) return;

    let player = document.querySelectorAll("div#mostrador img")[0];
    if (playerTime == player1)
        player.setAttribute("src", "imagens/x.jpg");
    else
        player.setAttribute("src", "imagens/o.jpg");
}

function OnClickEspaco() {
    var espacos = document.getElementsByClassName("espaco");
    for (let esp of espacos) {
        esp.addEventListener("click", Jogada);
    }
}

function Jogada() {
    if (gameOver || this.getElementsByTagName("img").length > 0) return;

    if (playerTime == player1) {
        this.innerHTML = "<img src='imagens/x.jpg'>";
        this.setAttribute("jogada", player1);
        playerTime = player2;
    } else {
        this.innerHTML = "<img src='imagens/o.jpg'>";
        this.setAttribute("jogada", player2);
        playerTime = player1;
    }

    AtualizarMostrador();
    let jogadas = ObterJogadasTabuleiro()
    VerificarVencedor(jogadas)
}

function ObterJogadasTabuleiro() {
    let espacos = [];
    for(let espaco of document.getElementsByClassName("espaco")){
        espacos.push(espaco.getAttribute("jogada"));
    }
    return espacos;
}

function VerificarVencedor(tabuleiro) {
    let vencedor = "";
    casosSucesso.forEach(element => {
        if (tabuleiro[element[0] - 1] != "" &&
            tabuleiro[element[0] - 1] == tabuleiro[element[1] - 1] &&
            tabuleiro[element[0] - 1] == tabuleiro[element[2] - 1]) {
            vencedor = tabuleiro[element[0] - 1];
            alert(`O jogador ${vencedor} ganhou!`)
        }

    });
}
