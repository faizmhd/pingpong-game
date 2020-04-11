(function () {
    var requestAnimId;

    var initialisation = function () {
        // le code de l'initialisation
        game.init();
        requestAnimId = window.requestAnimationFrame(main); // premier appel de main au rafraîchissement de la page
    }

    var main = function () {
        // le code du jeu
        game.clearLayer(game.playersBallLayer);
        game.movePlayers();
        game.displayPlayers();
        game.moveBall();
        game.checkGoal();
        game.checkVictory();
        // game.ia.move();
        game.collideBallWithPlayersAndAction();
        requestAnimId = window.requestAnimationFrame(main); // rappel de main au prochain rafraîchissement de la page
    }
    let pong;
    let player;
    let socket = io();
    // Creation of the Player one
    $('#new').on('click', () => {
        const name = $('#nameNew').val();
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        socket.emit('createGame', { name });
        player = new Player(name, 'left');
        // game = new Game(ball);
        // game.setPlayerOne(player);
        
    });
    // Creation of the pong for P1
    socket.on('newGame', (data) => {
        const message =
            `Hello, ${data.name}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for player 2...`;

        pong = new Room(data.room);
        pong.displayBoard(message);
        // game.setRoomId(data.room)
        // game.init();
        initialisation();
        
    });

    $('#join').on('click', () => {
        const name = $('#nameJoin').val();
        const roomID = $('#room').val();
        if (!name || !roomID) {
            alert('Please enter your name and game ID.');
            return;
        }
        socket.emit('joinGame', { name, room: roomID });
        player = new Player(name, 'right');
    });

    socket.on('player1', (data) => {
        const message = `Hello, ${player.getPlayerName()}`;
        $('#userHello').html(message);
        // initialisation();
        
    });

    socket.on('player2', (data) => {
        const message = `Hello, ${data.name}`;

        pong = new Room(data.room);
        pong.displayBoard(message);
        // initialisation();
    });

    socket.on('err', (data) => {
        alert(data.message);
        location.reload();
    });
}());