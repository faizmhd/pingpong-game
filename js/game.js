class Game {
    constructor(ball, playerOne, playerTwo) {
        this.roomId = null;
        this.groundWidth = 700;
        this.groundHeight = 400;
        this.groundColor = "#000000";
        this.netWidth = 6;
        this.netColor = "#FFFFFF";
        this.scorePosPlayer1 = 280;
        this.scorePosPlayer2 = 365;
        this.groundLayer = null;
        this.startGame = null;
        this.scoreToWin = 2;
        this.ball = ball;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.playerSound = new Audio('../sound/player.ogg');
    }

    getPlayerOne () {
        return this.playerOne.getPlayerName()
    }
    getPlayerTwo () {
        return this.playerTwo.getPlayerName()
    }

    setPlayerOne (playerOne) {
        this.playerOne = playerOne;
    }

    setPlayerTwo (playerTwo) {
        this.playerTwo = playerTwo;
    }

    setRoomId (roomId) {
        this.roomId = roomId;
    }

    init () {
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
        
    }
    displayScore (scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
    }
    displayBall () {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
    }
    displayPlayers () {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
    }
    moveBall () {
        this.displayBall();
        if (this.ball.start_game) {
            this.ball.move();
            this.ball.bounce(this);
            
        }
    }
    clearLayer (targetLayer) {
        targetLayer.clear();
    }
    initKeyboard (onKeyDownFunction, onKeyUpFunction) {
        window.onkeydown = onKeyDownFunction;
        window.onkeyup = onKeyUpFunction;
    }
    movePlayers () {
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
    }
    initMouse (onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    }
    collideBallWithPlayersAndAction () {
        if (this.ball.collide(game.playerOne)){
            game.ball.directionX = -game.ball.directionX;
            this.playerSound.play();
        }
            
        if (this.ball.collide(game.playerTwo)){
            game.ball.directionX = -game.ball.directionX;
            this.playerSound.play();
        }
            
    }
    checkGoal () {
    
        if (this.ball.goal(this.playerOne)) {
            this.playerTwo.score++;
        }
        else if (this.ball.goal(this.playerTwo)) {
            this.playerOne.score++;
        }
        this.scoreLayer.clear();
        this.displayScore(this.playerOne.score, this.playerTwo.score)
    
    }
    checkVictory () {
        let winner = null;
        if (this.playerOne.score === this.scoreToWin)
            winner = "Player 1 wins !";
        else if (this.playerTwo.score === this.scoreToWin)
            winner = "Player 2 wins !"
    
        if (winner !== null) {
            this.playersBallLayer.clear();
            this.ball.posX = this.groundHeight / 2
            this.ball.posY = this.groundWidth / 2
            this.ball.start_game = false;
            game.display.drawScoreLayer(this.playersBallLayer, winner, this.groundWidth, this.groundHeight);
        }
    }
    start_the_game() {
        this.startGame.onclick = game.control.startTheGame;
    }
    pause_the_game() {
        this.pauseGame.onclick = game.control.pauseTheGame;
    }
    quit_the_game() {
        this.quitGame.onclick = game.control.quitTheGame;
    }
}

var game = new Game(new Ball(), new Player('one', 'left'), new Player('two', 'right'));