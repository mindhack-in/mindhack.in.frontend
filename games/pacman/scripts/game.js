import TileMap from "./TIleMap.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");




const tileSize = 32;
const velocity = 2;

let userLevel = null;
let tileMap = null;
let pacman = null;
let enemies =  null;
let gameOver = null;
let gameWin = null;
async function initGame() {
    userLevel = localStorage.getItem("userLevel");
    if (userLevel === null)
        userLevel = 1;
    tileMap = new TileMap(tileSize, userLevel);
    // tileMap.loadMap();
    await tileMap.loadMap(); // ⬅️ MUST wait

    pacman = tileMap.getPacman(velocity);
    enemies = tileMap.getEnemies(velocity);

    gameOver = false;
    gameWin = false;

}


canvas.addEventListener("focus", () => {
    pacman.canvasActive = true;
});

canvas.addEventListener("blur", () => {
    pacman.canvasActive = false;
});

initGame();

const gameOverSound = new Audio("./sounds/gameOver.wav");
const gameWinSound = new Audio("./sounds/gameWin.wav");

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function gameLoop() {
    tileMap.draw(canvas, ctx);
    drawEndGame();
    pacman.draw(ctx, pauseGame(), enemies);

    enemies.forEach((enemy) => {
        enemy.draw(ctx, pauseGame(), pacman);
    }
    );
    checkGameOver();
    checkGameWin();
}

function drawEndGame() {
    let text = 0;
    if (gameOver) {
        text = "Game Over!";
    } else if (gameWin) {
        text = "Game Win!";
    } else {
        return;
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 3.2, canvas.width, 80);

    ctx.font = "80px comic sans-serif";
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "magenta");
    gradient.addColorStop(0.5, "blue");
    gradient.addColorStop(1, "red");

    ctx.fillStyle = "white";
    ctx.fillText(text, 10, canvas.height / 2);
}
async function checkGameWin() {
    if (pacman.madeFirstMove) {
        if (!gameWin) {
            gameWin = tileMap.win() === true;
            if (gameWin) {
                userLevel++;
                localStorage.setItem("userLevel", userLevel);
                gameWinSound.play();
    await wait(10000); // ⏳ 30 seconds

                await restartGame();
            }
        }
    }
}

function showImageFor3Seconds(src) {
  const img = document.createElement("img");

  img.src = src;
  img.style.position = "fixed";
  img.style.top = "0";
  img.style.left = "0";
  img.style.width = "100vw";
  img.style.height = "100vh";
  img.style.objectFit = "cover";
  img.style.zIndex = "9999";

  document.body.appendChild(img);

  setTimeout(() => {
    img.remove();
  }, 3000);
}


function pauseGame() {
    return !pacman.madeFirstMove || gameOver || gameWin;
}

async function checkGameOver() {
    if (!gameOver) {
        gameOver = isGameOver();
        if (gameOver) {
            gameOverSound.play();
            showImageFor3Seconds("https://mindhack.in/dynamic/banners/competition.png");

    await wait(10000); // ⏳ 30 seconds
            await restartGame();

        }
    }
}

function isGameOver() {
    return enemies.some(enemy => !pacman.powerDotActive && enemy.collideWith(pacman));
}

setInterval(gameLoop, 1000 / 60);


async function restartGame() {
    gameOverSound.pause();
    gameOverSound.currentTime = 0;

    gameWinSound.pause();
    gameWinSound.currentTime = 0;

    await initGame();
}



