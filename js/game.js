var game = {
    groundWidth: 700,
    groundHeight: 400,
    groundColor: "#000000",
    netWidth: 6,
    netColor: "#FFFFFF",
    scorePosPlayer1: 280,
    scorePosPlayer2: 365,
    groundLayer: null,
    startGame: null,
    ball: {
        width: 10,
        height: 10,
        color: "#ffcc00",
        posX: 200,
        posY: 200,
        speed: 5,
        directionX: 1,
        directionY: 1,
        game: false,
        move: function () {
            this.posX += this.directionX * this.speed;
            this.posY += this.directionY * this.speed;
        },
        bounce: function () {
            if (this.posX > game.groundWidth || this.posX < 0)
                this.directionX = -this.directionX;
            if (this.posY > game.groundHeight || this.posY < 0)
                this.directionY = -this.directionY;
        },
        collide: function (anotherItem) {
            if (!(this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX - this.width
                || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY - this.height)) {
                // Collision
                return true;
            }
            return false;
        },
        goal: function (player) {
            if (player.originalPosition == 'left') {
                if (this.posX < 0) {
                    return true
                }
                return false
            }
            else if (player.originalPosition == 'right') {
                if (this.posX > game.groundWidth) {
                    return true
                }
                return false
            }
        }
    },
    playerOne: {
        width: 10,
        height: 50,
        color: "#3333ff",
        posX: 30,
        posY: 200,
        goUp: false,
        goDown: false,
        originalPosition: 'left',
        score: 0
    },

    playerTwo: {
        width: 10,
        height: 50,
        color: "#ff1a1a",
        posX: 650,
        posY: 200,
        goUp: false,
        goDown: false,
        originalPosition: 'right',
        score: 0
    },

    init: function () {
        this.startGame = document.getElementById('start_button');
        this.pauseGame = document.getElementById('pause_button');
        this.quitGame = document.getElementById('quit_button');
        this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0);

        game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth / 2 - this.netWidth / 2, 0);
        this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
        this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);

        this.displayScore(this.playerOne.score, this.playerTwo.score);
        this.displayBall();
        this.displayPlayers();

        this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
        this.initMouse(game.control.onMouseMove);
        this.start_the_game()
        this.pause_the_game()
        this.quit_the_game()
        // game.ia.setPlayerAndBall(this.playerTwo, this.ball);
        
    },
    displayScore: function (scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
    },
    displayBall: function () {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
    },
    displayPlayers: function () {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
    },
    moveBall: function () {
        this.displayBall();
        if (this.ball.game) {
            this.ball.move();
            this.ball.bounce();
            
        }
    },
    clearLayer: function (targetLayer) {
        targetLayer.clear();
    },
    initKeyboard: function (onKeyDownFunction, onKeyUpFunction) {
        window.onkeydown = onKeyDownFunction;
        window.onkeyup = onKeyUpFunction;
    },
    movePlayers: function () {
        if (game.control.controlSystem == "KEYBOARD") {
            // keyboard control
            if (game.playerOne.goUp && game.playerOne.posY > 0) {
                game.playerOne.posY -= 7;
            } else if (game.playerOne.goDown && game.playerOne.posY < game.groundHeight - game.playerOne.height) {
                game.playerOne.posY += 7;
            }
        } if (game.control.controlSystem == "MOUSE") {
            // mouse control
            if (game.playerTwo.goUp && game.playerTwo.posY > game.control.mousePointer)
                game.playerTwo.posY -= 7;
            else if (game.playerTwo.goDown && game.playerTwo.posY < game.control.mousePointer && game.playerTwo.posY < game.groundHeight - game.playerTwo.height)
                game.playerTwo.posY += 7;
        }
    },
    initMouse: function (onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    },
    collideBallWithPlayersAndAction: function () {
        if (this.ball.collide(game.playerOne))
            game.ball.directionX = -game.ball.directionX;
        if (this.ball.collide(game.playerTwo))
            game.ball.directionX = -game.ball.directionX;
    },
    checkGoal: function () {

        if (this.ball.goal(this.playerOne)) {
            this.playerTwo.score++;
        }
        else if (this.ball.goal(this.playerTwo)) {
            this.playerOne.score++;
        }
        this.scoreLayer.clear();
        this.displayScore(this.playerOne.score, this.playerTwo.score)

    },
    checkVictory: function () {
        let winner = null;
        if (this.playerOne.score === 6)
            winner = "Player 1 wins !";
        else if (this.playerTwo.score === 6)
            winner = "Player 2 wins !"

        if (winner !== null) {
            this.playersBallLayer.clear();
            this.ball.posX = this.groundHeight / 2
            this.ball.posY = this.groundWidth / 2
            this.ball.game = false;
            game.display.drawScoreLayer(this.playersBallLayer, winner, this.groundWidth, this.groundHeight);
            // location.reload()
        }
    },
    start_the_game: function() {
        this.startGame.onclick = game.control.startTheGame;
    },
    pause_the_game: function() {
        this.pauseGame.onclick = game.control.pauseTheGame;
    },
    quit_the_game: function() {
        this.quitGame.onclick = game.control.quitTheGame;
    }
};