import { ShootStateList, Dead } from "./playerstates.js";
import { Bullet } from "./bullet.js";

export class Player {
  constructor(ctx, width, height, gameWidth, gameHight) {
    this.x = 100;
    this.y = 100;
    this.weight = 1;
    this.width = width;
    this.height = height;
    this.vy = 1;
    this.ctx = ctx;
    this.bullet = new Bullet(2, this.ctx);
    this.gameWidth = gameWidth;
    this.gameHight = gameHight;
    this.gameOver = false;
    this.dead = false;
    this.states = [
      new ShootStateList(width, height),
      new Dead(width, height, gameHight),
    ];
    this.currentState = this.states[0];
    this.score=0;
    this.touchThreshold = 1;

    window.addEventListener("keydown", (e) => {
      if (this.dead === false) {
        if (e.key === "ArrowUp") {
          this.y -= 10;
        } else if (e.key === "ArrowDown") {
          this.y += 10;
        } else if (e.key === "ArrowRight") {
          this.x += 10;
        } else if (e.key === "ArrowLeft") {
          this.x -= 10;
        }
        if (this.y < 0) {
          this.y = 0;
        } else if (this.y > this.gameHight - this.height) {
          this.y = this.gameHight - this.height;
        } else if (this.x < 0) {
          this.x = 0;
        } else if (this.x > this.gameWidth - this.width) {
          this.x = this.gameWidth - this.width;
        }
      }
    });

    window.addEventListener("touchstart", (e) => {
      if (this.dead === false) {
        this.touchY = e.changedTouches[0].pageY;
        this.touchX = e.changedTouches[0].pageX;
      }
    });

    window.addEventListener("touchmove", (e) => {
      if (this.dead === false) {
        const currentY = e.changedTouches[0].pageY;
        const currentX = e.changedTouches[0].pageX;
        const swipeY = currentY - this.touchY;
        const swipeX = currentX - this.touchX;

        // Vertical swipes
        if (swipeY < -this.touchThreshold) {
          this.y -= 10;
          this.touchY = currentY; // reset for smoother movement
        } else if (swipeY > this.touchThreshold) {
          this.y += 10;
          this.touchY = currentY;
        }

        // Horizontal swipes
        if (swipeX < -this.touchThreshold) {
          this.x -= 10;
          this.touchX = currentX;
        } else if (swipeX > this.touchThreshold) {
          this.x += 10;
          this.touchX = currentX;
        }

        // Constrain movement inside bounds
        if (this.y < 0) this.y = 0;
        else if (this.y > this.gameHight - this.height)
          this.y = this.gameHight - this.height;

        if (this.x < 0) this.x = 0;
        else if (this.x > this.gameWidth - this.width)
          this.x = this.gameWidth - this.width;
      }
    });

    // Optionally handle swipe down to restart (if gameOver exists)
    window.addEventListener("touchend", (e) => {
      if (this.dead === false) {
        const endY = e.changedTouches[0].pageY;
        const swipeDistance = endY - this.touchY;
        if (swipeDistance > this.touchThreshold) {
          console.log("Swipe down detected");
          if (gameOver) restartGame();
        }
      }
    });
  }

  draw(frameX, enemies) {
    // console.log(this.score)
    if (this.currentState.draw(this.ctx, frameX, this.x, this.y))
      this.gameOver = true;
    if (this.dead === false)
      this.score+=this.bullet.draw(
        this.x + this.width + 2,
        this.y + this.height * 0.5,
        frameX,
        this.gameWidth,
        enemies
      );
  }

  checkCollision(enemy) {
    if (
      enemy.x < this.x + this.width &&
      enemy.x + enemy.width > this.x &&
      enemy.y < this.y + this.height &&
      enemy.y + enemy.height > this.y
    ) {
      this.currentState = this.states[1];
      this.dead = true;
    }
  }
}
