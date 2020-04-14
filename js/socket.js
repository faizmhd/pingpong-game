(function () {
    let socket = io();
    var requestAnimId;

    var initialisation = function () {
        // le code de l'initialisation
        game.init();
        requestAnimId = window.requestAnimationFrame(main); // premier appel de main au rafraîchissement de la page
    }

    var main = function () {
        // le code du jeu
        game.clearLayer(game.playersBallLayer);
        updatePlayers()
        game.displayPlayers();
        game.displayBall();
        startGame()
        game.moveBall();
        updateBall()
        game.checkGoal();
        game.checkVictory();
        checkEndGame();
        if (game.IA) {
            game.ia.move();
        }
        game.collideBallWithPlayersAndAction();
        requestAnimId = window.requestAnimationFrame(main); // rappel de main au prochain rafraîchissement de la page
    }

    var updatePlayers = function () {
        if (game.nb_players == 2) {
            if (game.playerId == 1) {
                let player1_pos = game.movePlayer(game.getPlayerOne());
                if (player1_pos) {
                    socket.emit('updatePlayer', { room: this.pong.getRoomId(), id: game.playerId, position: player1_pos })
                }
            }
            else {
                let player2_pos = game.movePlayer(game.getPlayerTwo());
                if (player2_pos) {
                    socket.emit('updatePlayer', { room: this.pong.getRoomId(), id: game.playerId, position: player2_pos })
                }
            }
        }
        else if (game.nb_players == 4) {
            if (game.playerId == 1) {
                let player1_pos = game.movePlayer(game.getPlayerOne());
                if (player1_pos) {
                    socket.emit('updatePlayer', { room: this.pong.getRoomId(), id: game.playerId, position: player1_pos })
                }
            }
            else if (game.playerId == 2) {
                let player2_pos = game.movePlayer(game.getPlayerTwo());
                if (player2_pos) {
                    socket.emit('updatePlayer', { room: this.pong.getRoomId(), id: game.playerId, position: player2_pos })
                }
            }
            else if (game.playerId == 3) {
                let player3_pos = game.movePlayer(game.getPlayerThree());
                if (player3_pos) {
                    socket.emit('updatePlayer', { room: this.pong.getRoomId(), id: game.playerId, position: player3_pos })
                }
            } else if (game.playerId == 4) {
                let player4_pos = game.movePlayer(game.getPlayerFour());
                if (player4_pos) {
                    socket.emit('updatePlayer', { room: this.pong.getRoomId(), id: game.playerId, position: player4_pos })
                }
            }
        }

    }

    var startGame = function () {
        if (game.nb_players == 2) {
            if (game.playerId == 1 && game.whoStart) {
                socket.emit('updateGameStatus', { room: this.pong.getRoomId(), start: true })
            }
            else if (game.playerId == 2 && game.whoStart) {
                socket.emit('updateGameStatus', { room: this.pong.getRoomId(), start: true })
            }
        }
        else if (game.nb_players == 4) {
            if (game.playerId == 1 && game.whoStart) {
                socket.emit('updateGameStatus', { room: this.pong.getRoomId(), start: true })
            }
            else if (game.playerId == 2 && game.whoStart) {
                socket.emit('updateGameStatus', { room: this.pong.getRoomId(), start: true })
            }
            else if (game.playerId == 3 && game.whoStart) {
                socket.emit('updateGameStatus', { room: this.pong.getRoomId(), start: true })
            }
            else if (game.playerId == 4 && game.whoStart) {
                socket.emit('updateGameStatus', { room: this.pong.getRoomId(), start: true })
            }
        }
    }

    var updateBall = function () {
        if (game.nb_players == 2) {
            if (game.playerId == 1 && game.whoStart) {
                socket.emit('updateBall', { room: this.pong.getRoomId(), posX: game.getBall().getPosX(), posY: game.getBall().getPosY() })
            }
            else if (game.playerId == 2 && game.whoStart) {
                socket.emit('updateBall', { room: this.pong.getRoomId(), posX: game.getBall().getPosX(), posY: game.getBall().getPosY() })
            }
        }
        else if (game.nb_players == 4) {
            if (game.playerId == 1 && game.whoStart) {
                socket.emit('updateBall', { room: this.pong.getRoomId(), posX: game.getBall().getPosX(), posY: game.getBall().getPosY() })
            }
            else if (game.playerId == 2 && game.whoStart) {
                socket.emit('updateBall', { room: this.pong.getRoomId(), posX: game.getBall().getPosX(), posY: game.getBall().getPosY() })
            }
            else if (game.playerId == 3 && game.whoStart) {
                socket.emit('updateBall', { room: this.pong.getRoomId(), posX: game.getBall().getPosX(), posY: game.getBall().getPosY() })
            }
            else if (game.playerId == 4 && game.whoStart) {
                socket.emit('updateBall', { room: this.pong.getRoomId(), posX: game.getBall().getPosX(), posY: game.getBall().getPosY() })
            }
        }
    }

    var checkEndGame = function () {
        if (game.exitGame && game.amIPlayerOne) {
            socket.emit('endGame', { room: this.pong.getRoomId(), id: game.playerId });
        }
        else if (game.exitGame && !game.amIPlayerOne) {
            socket.emit('endGame', { room: this.pong.getRoomId(), id: game.playerId });
        }
    }

    // Creation of the Player one
    $('#new_IA').on('click', () => {
        const name = $('#nameNewIA').val();
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        const message =
            `Hello, ${name}.`;
        game.amIPlayerOne = true;
        game.playerId = 1
        this.pong = new Room('IA_room');
        this.pong.displayBoard(message);
        player1 = new Player(name, 1)
        game.setPlayerOne(player1)
        player2 = new Player('IA', 2)
        player2.setIARole(true)
        game.setPlayerTwo(player2)
        game.IA = true;
        initialisation();
    });

    $('#new').on('click', () => {
        const name = $('#nameNew').val();
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        const nb_player = $('input[name=nb_player]:checked').val();
        socket.emit('createGame', { name: name, nb_player: nb_player });
    });

    socket.on('newGame', (data) => {
        const message =
            `Hello, ${data.name}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for opponents...`;

        this.pong = new Room(data.room);
        this.pong.displayBoard(message);

    });

    $('#join').on('click', () => {
        const name = $('#nameJoin').val();
        const roomID = $('#room').val();
        if (!name || !roomID) {
            alert('Please enter your name and game ID.');
            return;
        }
        socket.emit('joinGame', { name, room: roomID });
    });

    socket.on('player1', (data) => {
        const message = `Hello, ${data.player1.name}`;
        $('#userHello').html(message);
        game.amIPlayerOne = true;
        game.playerId = 1
    });

    socket.on('player2', (data) => {
        const message = `Hello, ${data.player2.name}`;

        this.pong = new Room(data.room);
        this.pong.displayBoard(message);
        game.playerId = 2

    });
    socket.on('player3', (data) => {
        const message = `Hello, ${data.player3.name}`;

        this.pong = new Room(data.room);
        this.pong.displayBoard(message);
        game.playerId = 3

    });
    socket.on('player4', (data) => {
        const message = `Hello, ${data.player4.name}`;

        this.pong = new Room(data.room);
        this.pong.displayBoard(message);
        game.playerId = 4

    });

    socket.on('playgame', (data) => {
        if (data.nb_player == 2) {
            player1 = new Player(data.player1.name, data.player1.position)
            game.setPlayerOne(player1)
            player2 = new Player(data.player2.name, data.player2.position)
            game.setPlayerTwo(player2)
        } else if (data.nb_player == 4) {
            game.nb_players = data.nb_player
            player1 = new Player(data.player1.name, data.player1.position)
            game.setPlayerOne(player1)
            player2 = new Player(data.player2.name, data.player2.position)
            game.setPlayerTwo(player2)
            player3 = new Player(data.player3.name, data.player3.position)
            game.setPlayerThree(player3)
            player4 = new Player(data.player4.name, data.player4.position)
            game.setPlayerFour(player4)
        }

        initialisation();

    });
    socket.on('movePlayers', (data) => {
        if (game.nb_players == 2) {
            if (data.id == 1) {
                game.getPlayerOne().setPosition(data.position)
            }
            else {
                game.getPlayerTwo().setPosition(data.position)
            }
        } else if (game.nb_players == 4) {
            console.log(game.playerId)
            if (data.id == 1) {
                game.getPlayerOne().setPosition(data.position)
            }
            else if (data.id == 2) {
                game.getPlayerTwo().setPosition(data.position)
            }
            else if (data.id == 3) {
                game.getPlayerThree().setPosition(data.position)
            }
            else{
                game.getPlayerFour().setPosition(data.position)
            }
        }
    })
    socket.on('moveBall', (data) => {
        game.getBall().setPosX(data.posX);
        game.getBall().setPosY(data.posY);
    });
    socket.on('updateStart', (data) => {
        game.getBall().setStatus(data.start);
    });

    socket.on('exitGame', (data) => {
        if (game.nb_players == 2) {
            if (data.id == 1) {
                message = game.getPlayerOne().getPlayerName() + ' leaves the room !'
            }
            else if (data.id == 2) {
                message = game.getPlayerTwo().getPlayerName() + ' leaves the room !'
            }
        }
        else if (game.nb_players == 4) {
            if (data.id == 1) {
                message = game.getPlayerOne().getPlayerName() + ' leaves the room !'
            }
            else if (data.id == 2) {
                message = game.getPlayerTwo().getPlayerName() + ' leaves the room !'
            }
            else if (data.id == 3) {
                message = game.getPlayerThree().getPlayerName() + ' leaves the room !'
            }
            else if (data.id == 4) {
                message = game.getPlayerFour().getPlayerName() + ' leaves the room !'
            }
        }
        alert(message);
        location.reload();
    });
    socket.on('err', (data) => {
        alert(data.message);
        location.reload();
    });
}());