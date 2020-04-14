const express = require('express');
const app = express();
const path = require('path');
const port = process.env.SERVER_PORT || 8080
const title = process.env.TITLE || 'PingPongGame'
const server = require('http').Server(app);
const io = require('socket.io')(server);

let rooms = 0;
let player1 = null;
let player2 = null;
let player3 = null;
let player4 = null;
let nb_player = null;

require('dotenv-flow').config();
app.use(express.static('.'));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

io.on('connection', function (socket) {
    socket.on('createGame', function (data) {
        socket.join(`room-${++rooms}`);
        nb_player = data.nb_player;
        socket.emit('newGame', { name: data.name, room: `room-${rooms}` });
        player1 = {
            name: data.name,
            position: 1
        };
    })

    // Connect the Player 2 to the room he requested. Show error if room full.
    socket.on('joinGame', function (data) {
        let room = io.nsps['/'].adapter.rooms[data.room];
        if (nb_player == 2) {
            if (room && room.length === 1) {
                socket.join(data.room);
                socket.broadcast.to(data.room).emit('player1', { player1: player1 });
                player2 = {
                    name: data.name,
                    position: 2
                };
                socket.emit('player2', { player2: player2, room: data.room });
                io.sockets.in(data.room).emit('playgame', { room: data.room, player1: player1, player2: player2, nb_player: nb_player })
            } else {
                socket.emit('err', { message: 'Sorry, The room is full!' });
            }
        }
        else if (nb_player == 4) {
            if (room && room.length === 1) {
                socket.join(data.room);
                socket.broadcast.to(data.room).emit('player1', { player1: player1 });
                player2 = {
                    name: data.name,
                    position: 2
                };
                socket.emit('player2', { player2: player2, room: data.room });
            } else if (room && room.length === 2) {
                socket.join(data.room);

                player3 = {
                    name: data.name,
                    position: 3
                };
                socket.emit('player3', { player3: player3, room: data.room });
            } else if (room && room.length === 3) {
                socket.join(data.room);
                player4 = {
                    name: data.name,
                    position: 4
                };
                socket.emit('player4', { player4: player4, room: data.room });
                io.sockets.in(data.room).emit('playgame', { room: data.room, player1: player1, player2: player2, player3: player3, player4: player4, nb_player: nb_player })
            } else {
                socket.emit('err', { message: 'Sorry, The room is full!' });
            }
        }
    });

    socket.on('updatePlayer', function (data) {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('movePlayers', { id: data.id, position: data.position });
    });

    socket.on('updateBall', function (data) {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('moveBall', { posX: data.posX, posY: data.posY });
    });

    socket.on('updateGameStatus', function (data) {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('updateStart', { start: data.start });
    })


    socket.on('endGame', function (data) {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('exitGame', { id: data.id });
    });
});

server.listen(port);
console.log(title + ' is running on port : ' + port);