const express = require('express');
const app = express();
const path = require('path');
const port = process.env.SERVER_PORT || 8080
const server = require('http').Server(app);
const io = require('socket.io')(server);

let rooms = 0;

require('dotenv-flow').config();
app.use(express.static('.'));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

io.on('connection', function (socket) {
    socket.on('createGame', function (data) {
        socket.join(`room-${++rooms}`);
        socket.emit('newGame', { name: data.name, room: `room-${rooms}` });
    })

    // Connect the Player 2 to the room he requested. Show error if room full.
    socket.on('joinGame', function (data) {
        let room = io.nsps['/'].adapter.rooms[data.room];
        if (room && room.length === 1) {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('player1', {});
            socket.emit('player2', { name: data.name, room: data.room })
        } else {
            socket.emit('err', { message: 'Sorry, The room is full!' });
        }
    });
    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });
});

server.listen(port);
console.log(process.env.TITLE + ' is running on port : ' + port);