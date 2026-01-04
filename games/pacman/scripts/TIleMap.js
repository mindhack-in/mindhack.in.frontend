import Pacman from "./Pacman.js";
import MovingDirection from "./MovingDirection.js";
import Enemy from "./enemy.js"
export default class TileMap {
    constructor(tileSize, userLevel) {
        this.tileSize = tileSize;
        this.ghost = this.#image("ghost.png");
        this.wall = this.#image("wall.png");
        this.dot = this.#image("yellowDot.png");
        this.pinkDot = this.#image("pinkDot.png");
        this.powerDotAnimationTimerDefault = 30;
        this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;
        this.powerDot = this.pinkDot;
        this.dotLeft = 0;
        this.map=null;
        this.userLevel = userLevel;
    }

    async loadMap() {
        const response = await fetch("levels.json");
        const data = await response.json();
        this.map = data[this.userLevel]; // or data.map depending on JSON
    }
    #image(fileName) {
        const img = new Image();
        img.src = `images/${fileName}`;
        return img;
    }
    draw(canvas, ctx) {
        this.#setCanvasSize(canvas);
        this.#clearCanvas(canvas, ctx);
        this.#drawMap(ctx);
    }

    #drawMap(ctx) {
        for (let row = 0; row < this.map.length; row++) {
            for (let column = 0; column < this.map[0].length; column++) {
                const tile = this.map[row][column];
                let image = null;
                switch (tile) {
                    case 0:
                        this.dotLeft++;
                        image = this.dot;
                        break;
                    case 1:
                        image = this.wall;
                        break;
                    case 7:
                        this.dotLeft++;
                        this.powerDotAnimationTimer--;
                        if (this.powerDotAnimationTimer == 0) {
                            this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;
                            if (this.powerDot === this.pinkDot) {
                                this.powerDot = this.dot;
                            } else {
                                this.powerDot = this.pinkDot;
                            }
                        }
                        image = this.powerDot;
                        break;
                    // case 3:
                    //     image = this.ghost;
                    //     break;
                }

                if (image != null) {
                    ctx.drawImage(image, column * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);
                }
            }

        }
    }

    #clearCanvas(canvas, ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    #setCanvasSize(canvas) {
        if (this.map !== null) {
            canvas.height = this.map.length * this.tileSize;
            canvas.width = this.map[0].length * this.tileSize;
        }
    }

    getPacman(velocity) {
        for (let row = 0; row < this.map.length; row++) {
            for (let column = 0; column < this.map[0].length; column++) {
                if (this.map[row][column] === 2) {
                    this.map[row][column] = 0;
                    this.dotLeft++;
                    return new Pacman(column * this.tileSize,
                        row * this.tileSize,
                        this.tileSize, velocity, this);
                }
            }
        }
    }

    getEnemies(velocity) {
        const enemies = [];

        for (let row = 0; row < this.map.length; row++) {
            for (let column = 0; column < this.map[0].length; column++) {
                if (this.map[row][column] === 3) {
                    this.map[row][column] = 0;
                    enemies.push(new Enemy(column * this.tileSize,
                        row * this.tileSize,
                        this.tileSize, velocity, this));
                }
            }
        }
        return enemies;
    }

    didCollideWithEnvironment(x, y, direction) {
        if (Number.isInteger(x / this.tileSize) &&
            Number.isInteger(y / this.tileSize)) {
            let column = 0;
            let row = 0;
            let nextColumn = 0;
            let nextRow = 0;

            switch (direction) {
                case MovingDirection.right:
                    nextColumn = x + this.tileSize;
                    column = nextColumn / this.tileSize;
                    row = y / this.tileSize;
                    break;


                case MovingDirection.left:
                    nextColumn = x - this.tileSize;
                    column = nextColumn / this.tileSize;
                    row = y / this.tileSize;
                    break;

                case MovingDirection.up:
                    nextRow = y - this.tileSize;
                    row = nextRow / this.tileSize;
                    column = x / this.tileSize;
                    break;


                case MovingDirection.down:
                    nextRow = y + this.tileSize;
                    row = nextRow / this.tileSize;
                    column = x / this.tileSize;
                    break;
            }


            const tile = this.map[row][column];
            if (tile === 1) {
                return true
            }
        }
        return false;
    }

    eatDot(x, y) {
        const row = y / this.tileSize;
        const col = x / this.tileSize;
        this.dotLeft--;
        if (Number.isInteger(row) && Number.isInteger(col)) {
            if (this.map[row][col] === 0) {
                this.map[row][col] = 5;
                return true;
            }
        }
        return false;
    }

    eatPowerDot(x, y) {
        const row = y / this.tileSize;
        const col = x / this.tileSize;

        if (Number.isInteger(row) && Number.isInteger(col)) {
            if (this.map[row][col] === 7) {
                this.map[row][col] = 5;
                return true;
            }
        }
        return false;
    }

    win() {
        for (let row = 0; row < this.map.length; row++) {
            for (let column = 0; column < this.map[0].length; column++) {
                if (this.map[row][column] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

}

