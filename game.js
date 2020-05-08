const player1 = "x";
const player2 = "o";
const imagemPlayer1 = "<img src='imagens/x.jpg'>";
const imagemPlayer2 = "<img src='imagens/o.jpg'>";
let playerTime = player1;
let gameOver = false;
let casosSucesso = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

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

    JogadaHumano(this);
    AtualizarMostrador();

    let tabuleiro = ObterJogadasTabuleiro();
    MinMax(tabuleiro, player1, "min", 0);

    tabuleiro = ObterJogadasTabuleiro();
    let vencedor = VerificarVencedor(tabuleiro);
    if (vencedor) {
        alert(`O jogador ${vencedor.toUpperCase()} ganhou!`);
        gameOver = true;
    }
}

function ObterJogadasTabuleiro() {
    let espacos = [];
    for (let espaco of document.getElementsByClassName("espaco")) {
        espacos.push(espaco.getAttribute("jogada"));
    }
    return espacos;
}

function JogadaHumano(container) {
    container.innerHTML = imagemPlayer1;
    container.setAttribute("jogada", player1);
}

function JogadaIa(espacoIndex) {
    let espaco = document.getElementsByClassName("espaco")[espacoIndex];
    espaco.setAttribute("jogada", player2);
    espaco.innerHTML = imagemPlayer2;
}

function VerificarVencedor(tabuleiro) {
    let vencedor = "";
    casosSucesso.forEach(element => {
        if (tabuleiro[element[0]] != "" &&
            tabuleiro[element[0]] == tabuleiro[element[1]] &&
            tabuleiro[element[0]] == tabuleiro[element[2]]) {
            vencedor = tabuleiro[element[0]];
        }
    });

    return vencedor;
}

function FuncaoDeUtilidade(tabuleiro) {
    let chancePlayer1 = 0;
    let chancePlayer2 = 0;
    casosSucesso.forEach(linha => {
        if (VerificarSeHaVitoriaNaLinha(tabuleiro, linha, player1))
            chancePlayer1++;
        if (VerificarSeHaVitoriaNaLinha(tabuleiro, linha, player2))
            chancePlayer2++;

    });

    return chancePlayer2 - chancePlayer1;
}

function VerificarSeHaVitoriaNaLinha(tabuleiro, linha, player) {
    let espaco1 = tabuleiro[linha[0]];
    let espaco2 = tabuleiro[linha[1]];
    let espaco3 = tabuleiro[linha[2]];

    let existeAlgumEspacoPreenchido = espaco1 != "" || espaco1 != "" || espaco1 != "";
    existeAlgumEspacoPreenchido = true;
    let existePeloMenosUmEspacoPreenchido =
        (
            (espaco1 == player || espaco1 == "") &&
            (espaco2 == player || espaco2 == "") &&
            (espaco3 == player || espaco3 == "")
        );

    return existeAlgumEspacoPreenchido && existePeloMenosUmEspacoPreenchido
}

function ObterEspacosVazios(tabuleiro) {
    let espacosVazios = [];
    for (let i = 0; i < tabuleiro.length; i++) {
        if (tabuleiro[i] == "")
            espacosVazios.push(i);
    }

    return espacosVazios;
}

function MinMax(tabuleiro, player, minMax, nivel) {
    nivel++;
    let espacosVazios = ObterEspacosVazios(tabuleiro)
    if (nivel == 4 || VerificarVencedor(tabuleiro) != "") {
        return RetornarFolha(tabuleiro, player);
    }

    player = (player == player1) ? player2 : player1;
    minMax = (minMax == "max") ? "min" : "max";
    let minMaxFactory = MinMaxFactory(minMax);

    for (const i of espacosVazios) {
        let proximoTabuleiro = [...tabuleiro];
        proximoTabuleiro.splice(i, 1, player);

        let valorNo = MinMax(proximoTabuleiro, player, minMax, nivel);
        
        if (!valorNo.folha && nivel != 1 && Poda(minMaxFactory, valorNo.valorFuncaoUtilidade)){
            if(minMaxFactory.valor == -Infinity)
                minMaxFactory.espaco = i;
            break;
        }
        minMaxFactory.Comparar(valorNo.valorFuncaoUtilidade, i);
    }

    if (nivel == 1) {
        JogadaIa(minMaxFactory.espaco);
    }
    return RetornarMelhorValorDosFilhos(minMaxFactory.valor);
}

function MinMaxFactory(minMax) {

    return minMax == "max" ? MaxFactory() : MinFactory();
}

function MinFactory() {
    let min = {
        valor: Infinity,
        espaco: null,
        type: "min"
    }

    function Comparar(valor, espaco) {
        if (valor < min.valor) {
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
        if (valor > max.valor) {
            max.valor = valor;
            max.espaco = espaco;
        }
    }

    max.Comparar = Comparar;

    return max;
}

function RetornarFolha(tabuleiro, player) {
    return {
        valorFuncaoUtilidade: FuncaoDeUtilidade(tabuleiro, player),
        folha: true
    };
}

function RetornarMelhorValorDosFilhos(valor) {
    return {
        valorFuncaoUtilidade: valor,
        folha: false
    };
}

function Poda(minMaxFactory, valor) {
    return minMaxFactory.valor > valor && minMaxFactory.valor != Infinity;
}