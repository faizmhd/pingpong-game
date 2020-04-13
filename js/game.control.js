game.control = {

    controlSystem: null,
    mousePointer: null,

    onKeyDown: function (event) {

        game.control.controlSystem = "KEYBOARD";

        if (game.amIPlayerOne) {
            if (event.keyCode == game.keycode.KEYDOWN) {
                game.playerOne.goDown = true;
            } else if (event.keyCode == game.keycode.KEYUP) {
                game.playerOne.goUp = true;
            }
        }
        else{
            if (event.keyCode == game.keycode.KEYDOWN) {
                game.playerTwo.goDown = true;
            } else if (event.keyCode == game.keycode.KEYUP) {
                game.playerTwo.goUp = true;
            }
        }

        if (event.keyCode == game.keycode.SPACEBAR) {
            game.ball.start_game = true;
            game.whoStart = true;
        }
    },

    onKeyUp: function (event) {

        game.control.controlSystem = "KEYBOARD";

        if (game.amIPlayerOne) {
            if (event.keyCode == game.keycode.KEYDOWN) {
                game.playerOne.goDown = false;
            } else if (event.keyCode == game.keycode.KEYUP) {
                game.playerOne.goUp = false;
            }
        }
        else {
            if (event.keyCode == game.keycode.KEYDOWN) {
                game.playerTwo.goDown = false;
            } else if (event.keyCode == game.keycode.KEYUP) {
                game.playerTwo.goUp = false;
            }
        }
    },
    onMouseMove: function (event) {

        game.control.controlSystem = "MOUSE";

        if (!game.amIPlayerOne) {

            if (event) {
                game.control.mousePointer = event.clientY;
            }

            if (game.control.mousePointer > game.playerTwo.posY) {
                game.playerTwo.goDown = true;
                game.playerTwo.goUp = false;
            } else if (game.control.mousePointer < game.playerTwo.posY) {
                game.playerTwo.goDown = false;
                game.playerTwo.goUp = true;
            } else {
                game.playerTwo.goDown = false;
                game.playerTwo.goUp = false;
            }
        }
        else {
            if (event) {
                game.control.mousePointer = event.clientY;
            }

            if (game.control.mousePointer > game.playerOne.posY) {
                game.playerOne.goDown = true;
                game.playerOne.goUp = false;
            } else if (game.control.mousePointer < game.playerOne.posY) {
                game.playerOne.goDown = false;
                game.playerOne.goUp = true;
            } else {
                game.playerOne.goDown = false;
                game.playerOne.goUp = false;
            }
        }
    },
    startTheGame: function () {
        game.ball.start_game = true;
        game.whoStart = true;
    },
    quitTheGame: function () {
        game.exitGame = true;
        location.reload()
    }
}