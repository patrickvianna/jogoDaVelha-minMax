const player1 = "x";
const player2 = "o";
let playerTime = player1;
let gameOver = false;

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
}
