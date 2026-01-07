import MovingDirection from "./MovingDirection.js";

export default class pacman {

    constructor(x, y, tileSize, velocity, tileMap) {
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.x = x;
        this.y = y;
        this.tileMap = tileMap;

        this.currentMOvingDirection = null;
        this.requestMovingDirection = null;

        this.pacmanAnimateTimerDefault = 10;
        this.pacmanAnimationTimer = null;
        this.pacmanRotation = this.Rotation.right;
        document.addEventListener("keydown", this.#keydown)
        this.madeFirstMove = false;

        this.wakaSount = new Audio("./sounds/waka.wav");
        this.powerDotSound=new Audio("./sounds/power_dot.wav");
        this.powerDotActive=false;
        this.powerDotAboutToExpire=false;
        this.#loadpacmanImages();
        this.timers=[];



   document.addEventListener("touchstart", this.#touchStart, { passive: true });
document.addEventListener("touchend", this.#touchEnd, { passive: true });


    }

    Rotation = {
        right: 0,
        down: 1,
        left: 2,
        up: 3
    }

    draw(ctx,pauseGame,enemies) {

        if(!pauseGame) {
            this.#move();
            this.#animate();
        }

        this.#eatDot();
        this.#eatPowerDot();
        this.#eatEnemy(enemies);
        const size = this.tileSize / 2;
        ctx.save();
        ctx.translate(this.x + size, this.y + size);
        ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);

        ctx.drawImage(this.pacmanImages[this.pacmanImageIndex], -size, -size, this.tileSize, this.tileSize);
        ctx.restore();
    }

    #move() {


        if (this.currentMOvingDirection !== this.requestMovingDirection) {
            if (Number.isInteger(this.x / this.tileSize) &&
                Number.isInteger(this.y / this.tileSize)) {
                if (!this.tileMap.didCollideWithEnvironment(
                    this.x, this.y, this.requestMovingDirection
                )) {
                    this.currentMOvingDirection = this.requestMovingDirection;
                }
            }
        }

        if (this.tileMap.didCollideWithEnvironment(
            this.x, this.y, this.currentMOvingDirection
        )) {
            this.pacmanAnimationTimer = null;
            // this.pacmanImageIndex=1;
            return;
        } else if (this.currentMOvingDirection !== null &&
            this.pacmanAnimationTimer === null) {

            this.pacmanAnimationTimer = this.pacmanAnimateTimerDefault;
        }
        switch (this.currentMOvingDirection) {
            case MovingDirection.up:
                this.y -= this.velocity;
                this.pacmanRotation = this.Rotation.up;
                break;
            case MovingDirection.down:
                this.y += this.velocity;
                this.pacmanRotation = this.Rotation.down;
                break;
            case MovingDirection.right:
                this.x += this.velocity;
                this.pacmanRotation = this.Rotation.right;
                break;
            case MovingDirection.left:
                this.x -= this.velocity;
                this.pacmanRotation = this.Rotation.left;
                break;
        }
    }

    #loadpacmanImages() {
        this.pacmanImages = [this.#image("pac0.png"), this.#image("pac1.png"), this.#image("pac2.png")];
        this.pacmanImageIndex = 0;
    }


    #image(fileName) {
        const img = new Image();
        img.src = `images/${fileName}`;
        return img;
    }

    #keydown = (event) => {
        if (event.key === "ArrowDown") {
            if (this.currentMOvingDirection === MovingDirection.up) {
                this.currentMOvingDirection = MovingDirection.down;
            }
            this.requestMovingDirection = MovingDirection.down;
            this.madeFirstMove = true;
        }

        if (event.key === "ArrowUp") {
            if (this.currentMOvingDirection === MovingDirection.down) {
                this.currentMOvingDirection = MovingDirection.up;
            }
            this.requestMovingDirection = MovingDirection.up;
            this.madeFirstMove = true;
        }


        if (event.key === "ArrowRight") {
            if (this.currentMOvingDirection === MovingDirection.left) {
                this.currentMOvingDirection = MovingDirection.right;
            }
            this.requestMovingDirection = MovingDirection.right;
            this.madeFirstMove = true;
        }


        if (event.key === "ArrowLeft") {
            if (this.currentMOvingDirection === MovingDirection.right) {
                this.currentMOvingDirection = MovingDirection.left;

            }
            this.requestMovingDirection = MovingDirection.left;
            this.madeFirstMove = true;
        }

    }

    #animate() {
        if (this.pacmanAnimationTimer === null) {
            return;
        }
        this.pacmanAnimationTimer--;
        if (this.pacmanAnimationTimer === 0) {
            this.pacmanAnimationTimer = this.pacmanAnimateTimerDefault;
            this.pacmanImageIndex++;
            if (this.pacmanImageIndex === this.pacmanImages.length) {
                this.pacmanImageIndex = 0;
            }
        }
    }

    #eatDot() {
        if (this.tileMap.eatDot(this.x, this.y)&&this.madeFirstMove) {
            this.wakaSount.play();
        }
    }

    #eatPowerDot() {
        if(this.tileMap.eatPowerDot(this.x, this.y)) {
            this.powerDotSound.play();
            this.powerDotActive=true;
            this.powerDotAboutToExpire=false;
            this.timers.forEach((timer)=>clearTimeout(timer));
            // this.timers = [];
            let powerDotTimer=setTimeout(()=>{
                this.powerDotActive=false;
                this.powerDotAboutToExpire=false;
            },1000*6);

            this.timers.push(powerDotTimer);

            let powerDotAboutToExpierTimer =setTimeout(() =>{
                this.powerDotAboutToExpire=true;
            },1000*3);

            this.timers.push(powerDotAboutToExpierTimer);
        }
    }

    #eatEnemy(enemies){
        if(this.powerDotActive){
            const collideEnemies=enemies.filter((enemy)=>enemy.collideWith(this));
            if(collideEnemies.length > 0) {
            }
            collideEnemies.forEach((enemy)=>{
                enemies.splice(enemies.indexOf(enemy),1);
            });
        }
    }


    #touchStartX = 0;
#touchStartY = 0;

#touchStart = (event) => {
    const touch = event.touches[0];
    this.#touchStartX = touch.clientX;
    this.#touchStartY = touch.clientY;
};

#touchEnd = (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.#touchStartX;
    const deltaY = touch.clientY - this.#touchStartY;

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
            this.#moveRight();
        } else {
            this.#moveLeft();
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            this.#moveDown();
        } else {
            this.#moveUp();
        }
    }
};
#moveUp() {
    if (this.currentMOvingDirection === MovingDirection.down) {
        this.currentMOvingDirection = MovingDirection.up;
    }
    this.requestMovingDirection = MovingDirection.up;
    this.madeFirstMove = true;
}

#moveDown() {
    if (this.currentMOvingDirection === MovingDirection.up) {
        this.currentMOvingDirection = MovingDirection.down;
    }
    this.requestMovingDirection = MovingDirection.down;
    this.madeFirstMove = true;
}

#moveLeft() {
    if (this.currentMOvingDirection === MovingDirection.right) {
        this.currentMOvingDirection = MovingDirection.left;
    }
    this.requestMovingDirection = MovingDirection.left;
    this.madeFirstMove = true;
}

#moveRight() {
    if (this.currentMOvingDirection === MovingDirection.left) {
        this.currentMOvingDirection = MovingDirection.right;
    }
    this.requestMovingDirection = MovingDirection.right;
    this.madeFirstMove = true;
}

}