export class PlayerState {
  constructor(image, height, width) {
    this.height = height;
    this.width = width;
    this.image = image;
  }
}

export class Dead {
  constructor(width, height,gameHeight) {
    this.height = height;
    this.width = width;
    this.gameHeight=gameHeight;
    this.image1 = document.getElementById("dead");
    this.elements = [new PlayerState(this.image1, width, height)];
    this.vy=1;
  }

  draw(context, frameX, x, y) {
    y-=this.vy;
    this.vy-=10;
  
    context.drawImage(
      this.elements[0].image,
      x,
      y,
      this.width,
      this.height
    );
      if(y>=this.gameHeight-this.height){
      return true;
    }
    return false;
  }
}
export class ShootStateList {
  constructor(width, height) {
    this.height = height;
    this.width = width;

    this.image1 = document.getElementById("player1");
    this.image2 = document.getElementById("player2");
    this.image3 = document.getElementById("player3");
    this.image4 = document.getElementById("player4");
    this.image5 = document.getElementById("player5");

    this.elements = [
      new PlayerState(this.image1, width, height),
      new PlayerState(this.image2, width, height),
      new PlayerState(this.image3, width, height),
      new PlayerState(this.image4, width, height),
      new PlayerState(this.image5, width, height),
    ];
  }

  draw(context, frameX, x, y) {
    context.drawImage(
      this.elements[frameX].image,
      x,
      y,
      this.width,
      this.height
    );
     return false;
  }
}
