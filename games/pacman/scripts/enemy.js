import MovingDirection from "./MovingDirection.js";

export default class Enemy {
    constructor(x, y, tileSize, velocity, tileMap) {
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.x = x;
        this.y = y;
        this.tileMap = tileMap;
        this.normalGhost = this.#image("ghost.png");
        this.scaredGhost = this.#image("scaredGhost.png");
        this.scaredGhost2 = this.#image("scaredGhost2.png");
        this.scaredAboutToExpireTimerDefault = 30;
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
        this.image = this.normalGhost;
        this.movingDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);
        this.directionTimerDefault = this.#random(10, 50);
        this.directionTimer = this.directionTimerDefault;
    }

    #random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    draw(ctx, gameStarted, pacman) {
        if (!gameStarted) this.#move()

        if (pacman.powerDotActive) {
            if (pacman.powerDotAboutToExpire) {
                this.scaredAboutToExpireTimer--;
                if (this.scaredAboutToExpireTimer === 0) {
                    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
                    if (this.image === this.scaredGhost)
                        this.image = this.scaredGhost2;
                    else
                        this.image = this.scaredGhost
                }
            }else {
                this.image = this.scaredGhost;
            }
        } else {
            this.image = this.normalGhost;
        }

        ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
    }

    #changeDirection() {

        let newMoveDirection = null;

        this.directionTimer = this.directionTimerDefault;
        newMoveDirection = Math.floor(
            Math.random() * Object.keys(MovingDirection).length
        );


        if (newMoveDirection != null && this.movingDirection !== newMoveDirection) {
            if (Number.isInteger(this.x / this.tileSize) &&
                Number.isInteger(this.y / this.tileSize)) {
                if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, newMoveDirection)) {
                    this.movingDirection = newMoveDirection;
                }
            }
        }
    }

    #move() {
        if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, this.movingDirection)) {
            switch ((this.movingDirection)) {
                case MovingDirection.up:
                    this.y -= this.velocity;
                    break;

                case MovingDirection.down:
                    this.y += this.velocity;
                    break;

                case MovingDirection.right:
                    this.x += this.velocity;
                    break;

                case MovingDirection.left:
                    this.x -= this.velocity;
                    break;
            }
        } else {
            this.#changeDirection();

        }
    }

    #image(fileName) {
        const img = new Image();
        img.src = `images/${fileName}`;
        return img;
    }

    collideWith(pacman){
        const size=this.tileSize/2;

        return this.x < pacman.x + size &&
            this.x + size > pacman.x &&
            this.y < pacman.y + size &&
            this.y + size > pacman.y;

    }
}