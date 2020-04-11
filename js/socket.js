(function () {
    let pong;
    let player
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
    });
    // Creation of the pong for P1
    socket.on('newGame', (data) => {
        const message =
            `Hello, ${data.name}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for player 2...`;

        pong = new Game(data.room);
        pong.displayBoard(message);

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
    });

    socket.on('player2', (data) => {
        const message = `Hello, ${data.name}`;

        pong = new Game(data.room);
        pong.displayBoard(message);
    });

    socket.on('err', (data) => {
        alert(data.message);
        location.reload();
    });

    class Player {
        constructor(name, position) {
            this.name = name;
            this.position = position;
        }
        getPlayerName() {
            return this.name;
        }
        getPlayerPosition() {
            return this.position;
        }
    }

    class Game {
        constructor(roomId) {
            this.roomId = roomId;
        }

        displayBoard(message) {
            $('.menu').css('display', 'none');
            $('.main_game').css('display', 'block');
            $('#userHello').html(message);
        }
    }
}());