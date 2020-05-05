const player1 = "x";
const player2 = "o";
const imagemPlayer1 = "<img src='imagens/x.jpg'>";
const imagemPlayer2 = "<img src='imagens/o.jpg'>";
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
        this.innerHTML = imagemPlayer1;
        this.setAttribute("jogada", player1);
        // playerTime = player2;
    } else {
        this.innerHTML = imagemPlayer2;
        this.setAttribute("jogada", player2);
        playerTime = player1;
    }

    AtualizarMostrador();
    let jogadas = ObterJogadasTabuleiro()
    if (VerificarVencedor(jogadas))
        gameOver = true;

    player = (playerTime == player1) ? player2 : player1;
    MinMax(jogadas, player, "min", 0);
}

function ObterJogadasTabuleiro() {
    let espacos = [];
    for (let espaco of document.getElementsByClassName("espaco")) {
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
            // alert(`O jogador ${vencedor} ganhou!`)
        }
    });

    return vencedor;
}

function MinMax(tabuleiro, player, minMax, nivel) {
    nivel++;
    let espacosVazios = ObterEspacosVazios(tabuleiro)
    if (espacosVazios.length == 0 || VerificarVencedor(tabuleiro) != "") {
        return FuncaoDeUtilidade(tabuleiro, player);
    }

    player = (player == player1) ? player2 : player1;
    minMax = (minMax == "max") ? "min" : "max";
    let minMaxFactory = MinMaxFactory(minMax);

    espacosVazios.forEach(i => {
        let proximoTabuleiro = [...tabuleiro];
        proximoTabuleiro.splice(i, 1, player);
        let valorNo = MinMax(proximoTabuleiro, player, minMax, nivel);
        minMaxFactory.Comparar(valorNo, i);
    });

    if(nivel == 1) {
        JogadaIa(minMaxFactory.espaco);
    }
    return minMaxFactory.valor;
}

function JogadaIa(espacoIndex) {
    let espaco = document.getElementsByClassName("espaco")[espacoIndex];
    espaco.setAttribute("jogada", player2);
    espaco.innerHTML = imagemPlayer2;
}

function ObterEspacosVazios(tabuleiro) {
    let espacosVazios = [];
    for (let i = 0; i < tabuleiro.length; i++) {
        if (tabuleiro[i] == "")
            espacosVazios.push(i);
    }

    return espacosVazios;
}

function FuncaoDeUtilidade(tabuleiro, player) {
    let playerVencedor = VerificarVencedor(tabuleiro);
    if (playerVencedor == "")
        return 0;
    return player == playerVencedor ? 1 : -1;
}

function MinMaxFactory(minMax) {
    
    return minMax== "max" ? MaxFactory() : MinFactory();
}

function MinFactory() {
    let min = {
        valor: Infinity,
        espaco: null,
        type: "min"
    }

    function Comparar(valor, espaco) {
        if (valor < min.valor){
            min.valor = valor;
            min.espaco = espaco;
        }
    }

    min.Comparar = Comparar;

    return min;
}

function MaxFactory() {
    let max = {
        valor: -Infinity,
        espaco: null,
        type: "max"
    }

    function Comparar(valor, espaco) {
        if (valor > max.valor){
            max.valor = valor;
            max.espaco = espaco;
        }
    }

    max.Comparar = Comparar;

    return max;
}