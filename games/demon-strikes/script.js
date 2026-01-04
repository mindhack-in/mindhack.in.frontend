import { Player } from "./js/player.js";
import { Enemy } from "./js/enemy.js";

window.addEventListener("load", function () {
  document.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );

  const canvas = this.document.getElementById("canvas");

  canvas.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault(); // prevent pull-to-refresh
    },
    { passive: false }
  );
  const backgroundMusic = new Audio("plane.mp3"); // Replace with your own audio file path
  backgroundMusic.loop = true; // Ensure the music loops
  backgroundMusic.volume = 0.5; // Set volume level (0.0 to 1.0)

  document.getElementById("startButton").addEventListener("click", () => {
    // Play the background music after user interaction
    backgroundMusic
      .play()
      .then(() => {
        console.log("Background music started.");
      })
      .catch((error) => {
        console.error("Error playing music:", error);
      });

    // Start the game loop after user starts
    animate(0);
    document.getElementById("startButton").style.display = "none"; // Hide the button after start
  });

  const ctx = canvas.getContext("2d");
  
  const height = 100;
  const width = 250;
  console.log(this.window.innerWidth);
  if (this.window.innerWidth < 500) canvas.width = this.window.innerWidth * 3;
  else canvas.width = this.window.innerWidth;
  canvas.height = 500;
  let fps = 1;
  let frameInterval = 10000 / fps;
  let frameTimer = 0;
  let frameX = 0;
  let maxFrame = 2;

  let backgroundX = 0;

  let background = this.document.getElementById("background");
  class Main {
    constructor(ctx) {
      this.context = ctx;
      this.gameWidth = canvas.width;
      this.gameHight = canvas.height;
      this.player = new Player(
        ctx,
        width,
        height,
        this.gameWidth,
        this.gameHight
      );
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 25;
      this.score = 0;
      this.timer = 0;
      this.maxTime = 20000;

      this.fontSize = 30;
      this.fontFamily = "Helvetica";
      this.fontColor = "black";
    }
  }

  let main = new Main(ctx);
  let lastTime = 0;
  function animate(deltaTime) {
    const timestamp = deltaTime - lastTime;
    lastTime = deltaTime;
    main.timer += timestamp;

    // // ctx.font = main.fontSize + "px " + main.fontFamily;
    // ctx.textAlign = "left";
    // ctx.fillStyle = main.fontColor;

    // if (main.timer > main.maxTime) {
    //   main.player.gameOver = true;
    // console.log("thisdf ");
    // }
    console.log(main.score);
    backgroundX--;

    if (backgroundX < -main.gameWidth) {
      backgroundX = 0;
    }

    main.enemies.forEach((enemy) => {
      enemy.update(deltaTime);
      if (enemy.markForDeletion && enemy.softDelete) main.score += 1;
      if (enemy.markForDeletion)
        main.enemies.splice(main.enemies.indexOf(enemy), 1);
    });

    if (frameTimer > frameInterval) {
      frameTimer = 0;
      if (frameX < maxFrame) frameX++;
      else frameX = 0;

      if (main.enemyTimer > main.enemyInterval) {
        main.enemyTimer = 0;
        main.enemies.push(
          new Enemy(main.gameWidth, Math.random() * main.gameHight * 0.7)
        );
      } else {
        main.enemyTimer += 1;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 5; i++)
        ctx.drawImage(background, backgroundX + i * 1460 - 10, 0, 1460, 1095);
      ctx.font = main.fontSize * 0.8 + "px " + main.fontFamily;
            ctx.fillText("Score : " +main.score, 20,40);

      ctx.fillText("Time : " + (main.timer * 0.001).toFixed(1), 20, 80);

      main.player.draw(frameX, main.enemies);
      main.enemies.forEach((en) => {
        en.update(deltaTime);
        en.draw(ctx);
        main.player.checkCollision(en);
      });
    } else frameTimer += deltaTime;

    if (!main.player.gameOver) requestAnimationFrame(animate);
  }

  ctx.drawImage;
});
