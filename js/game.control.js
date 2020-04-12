game.control = {

    controlSystem: null,
    mousePointer: null,

    onKeyDown: function (event) {

        game.control.controlSystem = "KEYBOARD";

        if (event.keyCode == game.keycode.KEYDOWN ) {
            game.playerOne.goDown = true;
        } else if (event.keyCode == game.keycode.KEYUP) {
            game.playerOne.goUp = true;
        }
    },

    onKeyUp: function (event) {

        game.control.controlSystem = "KEYBOARD";
        
        if (event.keyCode == game.keycode.KEYDOWN) {
            game.playerOne.goDown = false;
        } else if (event.keyCode == game.keycode.KEYUP) {
            game.playerOne.goUp = false;
        }
    },
    onMouseMove: function (event) {

        game.control.controlSystem = "MOUSE";

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
    },
    startTheGame: function () {
        game.ball.start_game = true;
    },
    pauseTheGame: function () {
        game.ball.start_game = !game.ball.start_game;
    },
    quitTheGame: function () {
        location.reload()
    }
}