class Ball {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.color = "#ffcc00";
        this.posX = 200;
        this.posY = 200;
        this.speed = 5;
        this.directionX = 1;
        this.directionY = 1;
        this.start_game = false;
        this.wallSound = new Audio('../sound/wall.ogg');
    }

    move () {
        this.posX += this.directionX * this.speed;
        this.posY += this.directionY * this.speed;
    }
    bounce (game) {
        if (this.posX > game.groundWidth || this.posX < 0){
            this.directionX = -this.directionX;
            this.wallSound.play();
        }
            
        if (this.posY > game.groundHeight || this.posY < 0){
            this.directionY = -this.directionY;
            this.wallSound.play();
        }
            
    }
    collide (anotherItem) {
        if (!(this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX - this.width
            || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY - this.height)) {
            // Collision
            return true;
        }
        return false;
    }
    goal (player) {
        if (player.originalPosition === 'left') {
            if (this.posX < 0) {
                return true
            }
            return false
        }
        else if (player.originalPosition === 'right') {
            if (this.posX > game.groundWidth) {
                return true
            }
            return false
        }
    }
}