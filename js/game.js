class Game {
    constructor(ball) {
        this.groundWidth = 700;
        this.groundHeight = 400;
        this.groundColor = "#000000";
        this.netWidth = 6;
        this.netColor = "#FFFFFF";
        this.scorePosPlayer1 = 280;
        this.scorePosPlayer2 = 365;
        this.groundLayer = null;
        this.startGame = null;
        this.scoreToWin = 6;
        this.ball = ball;
        this.playerOne = null;
        this.playerTwo = null;
        this.playerThree = null;
        this.playerFour = null;
        this.playerSound = new Audio('../sound/player.ogg');
        this.letsgo = false;
        this.amIPlayerOne = false;
        this.whoStart = false;
        this.exitGame = false;
        this.IA = false;
        this.nb_players = 2;
        this.playerId = null;
    }

    getPlayerOne() {
        return this.playerOne
    }
    getPlayerTwo() {
        return this.playerTwo
    }
    getPlayerThree() {
        return this.playerThree
    }
    getPlayerFour() {
        return this.playerFour
    }

    getLetsGo() {
        return this.letsgo;
    }

    getBall() {
        return this.ball;
    }

    setPlayerOne(playerOne) {
        this.playerOne = playerOne;
    }

    setPlayerThree(playerThree) {
        this.playerThree = playerThree;
    }

    setPlayerFour(playerFour) {
        this.playerFour = playerFour;
        if (this.nb_players == 4 && this.playerOne && this.playerTwo && this.playerThree) {
            this.letsgo = true;
        }
    }

    setPlayerTwo(playerTwo) {
        this.playerTwo = playerTwo;
        if (this.nb_players == 2 && this.playerOne && this.playerTwo) {
            this.letsgo = true;
        }
    }

    setLetsGo(letsgo) {
        this.letsgo = letsgo;
    }

    init() {
        this.startGame = document.getElementById('start_button');
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
        this.quit_the_game()
        if (this.IA) {
            game.ia.setPlayerAndBall(this.playerTwo, this.ball);
        }
    }
    displayScore(scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
    }
    displayBall() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
    }
    displayPlayers() {
        if (this.nb_players == 2) {
            game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
            game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
        }
        else if (this.nb_players == 4) {
            game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
            game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
            game.display.drawRectangleInLayer(this.playersBallLayer, this.playerThree.width, this.playerThree.height, this.playerThree.color, this.playerThree.posX, this.playerThree.posY);
            game.display.drawRectangleInLayer(this.playersBallLayer, this.playerFour.width, this.playerFour.height, this.playerFour.color, this.playerFour.posX, this.playerFour.posY);
        }
    }
    moveBall() {

        if (this.ball.start_game && this.whoStart) {
            this.displayBall()
            this.ball.move();
            this.ball.bounce(this);
        }
    }
    clearLayer(targetLayer) {
        targetLayer.clear();
    }
    initKeyboard(onKeyDownFunction, onKeyUpFunction) {
        window.onkeydown = onKeyDownFunction;
        window.onkeyup = onKeyUpFunction;
    }
    movePlayer(player) {
        if (!player.getIARole()) {
            if (game.control.controlSystem == "KEYBOARD") {
                // keyboard control
                if (player.goUp && player.posY > 0) {
                    player.posY -= 7;
                    return player.posY;
                } else if (player.goDown && player.posY < game.groundHeight - player.height) {
                    player.posY += 7;
                    return player.posY;
                }
            } if (game.control.controlSystem == "MOUSE") {
                // mouse control
                if (player.goUp && player.posY > game.control.mousePointer) {
                    player.posY -= 7;
                    return player.posY;
                }
                else if (player.goDown && player.posY < game.control.mousePointer && player.posY < game.groundHeight - player.height) {
                    player.posY += 7;
                    return player.posY;
                }
            }
        }
        return false
    }
    initMouse(onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    }
    collideBallWithPlayersAndAction() {
        // refacto
        if (game.nb_players == 2) {
            if (this.ball.collide(game.playerOne)) {
                game.ball.directionX = -game.ball.directionX;
                this.playerSound.play();
            }
            if (this.ball.collide(game.playerTwo)) {
                game.ball.directionX = -game.ball.directionX;
                this.playerSound.play();
            }
        }
        else if (game.nb_players == 4) {
            if (this.ball.collide(game.playerOne)) {
                game.ball.directionX = -game.ball.directionX;
                this.playerSound.play();
            }
            if (this.ball.collide(game.playerTwo)) {
                game.ball.directionX = -game.ball.directionX;
                this.playerSound.play();
            }
            if (this.ball.collide(game.playerThree)) {
                game.ball.directionX = -game.ball.directionX;
                this.playerSound.play();
            }
            if (this.ball.collide(game.playerFour)) {
                game.ball.directionX = -game.ball.directionX;
                this.playerSound.play();
            }
        }
    }
    checkGoal() {
        if (this.ball.goal(this.playerOne)) {
            this.playerTwo.score++;
            this.ball = new Ball(1);
            this.whoStart = false
            if (this.IA) {
                game.ia.setPlayerAndBall(this.playerTwo, this.ball);
            }
        }
        else if (this.ball.goal(this.playerTwo)) {
            this.playerOne.score++;
            this.ball = new Ball(2)
            this.whoStart = false
            if (this.IA) {
                game.ia.setPlayerAndBall(this.playerTwo, this.ball);
            }
        }
        this.scoreLayer.clear();
        this.displayScore(this.playerOne.score, this.playerTwo.score)
    }
    checkVictory() {
        let winner = null;
        if (game.nb_players == 2) {
            if (this.playerOne.score === this.scoreToWin)
                winner = this.getPlayerOne().getPlayerName() + ' wins !';
            else if (this.playerTwo.score === this.scoreToWin)
                winner = this.getPlayerTwo().getPlayerName() + ' wins !';
        }
        else if(game.nb_players == 4){
            if (this.playerOne.score === this.scoreToWin)
                winner = this.getPlayerOne().getPlayerName() + ' and ' + this.getPlayerThree().getPlayerName() + ' wins !';
            else if (this.playerTwo.score === this.scoreToWin)
                winner = this.getPlayerTwo().getPlayerName() + ' and ' + this.getPlayerFour().getPlayerName() + ' wins !';
        }
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
    quit_the_game() {
        this.quitGame.onclick = game.control.quitTheGame;
    }
}

var game = new Game(new Ball(1));