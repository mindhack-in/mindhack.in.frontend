export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.frameX = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.markForDeletion = false;
    this.speedX = Math.random() * 5;
    this.height = 64;
    this.width = 77;
    this.maxFrame = 3;
    this.image = document.getElementById("flying");
    this.softDelete = false;
    this.hit = (Math.random() + 10).toFixed(0);
  }

  update() {
    this.x -= this.speedX;
    if (this.frameTimer > this.frameInterval) {
      if (this.softDelete === true) this.markForDeletion = true;
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += 10;
    }
    if (this.x < 0 - this.width) this.markForDeletion = true;
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}