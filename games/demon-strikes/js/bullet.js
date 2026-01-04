export class Bullet {
  constructor(speed, context) {
    this.speed = speed;
    this.context = context;
    this.width = 10;
    this.height = 10;
    this.bullets = [
      document.getElementById("bullet1"),
      document.getElementById("bullet2"),
      document.getElementById("bullet3"),
      document.getElementById("bullet4"),
      document.getElementById("bullet5"),
    ];
  }

   draw(x, y, frameX, gameWidth, enemies) {
    let i = 0;
    let j = x;
    while (true) {
      j = j + 10;

      if(this.checkCollision(enemies,j,y)){
        return 1;
      }
      this.context.drawImage(
        this.bullets[frameX],
        j,
        y,
        this.width,
        this.height
      );
      i++;
      if (j > gameWidth) break;
    }
    return 0;
  }

  checkCollision(enemies,x,y) {
  for (let enemy of enemies) {
      if (
        enemy.x <x + this.width &&
        enemy.x + enemy.width > x &&
        enemy.y < y + this.height &&
        enemy.y + enemy.height > y
      ) {
        enemy.hit--;
        if(enemy.hit===0){
        enemy.maxFrame=4;
        enemy.image=document.getElementById("death")
        if(enemy.softDelete===false){
            enemy.frameTimer=0;
            enemy.frameInterval*=2;
        }
                enemy.softDelete=true;
      }
        return true;
      }
    }
    return false;
  }
}
