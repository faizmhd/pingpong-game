(function () {
    var socket = io();
    $('#new').on('click', () => {
        const name = $('#nameNew').val();
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        socket.emit('createGame', { name });
    });

    // New Game created by current client. Update the UI and create new Game var.
    socket.on('newGame', (data) => {
        const message =
            `Hello, ${data.name}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for player 2...`;

        // displayBoard(message);
        $('.menu').css('display', 'none');
        $('.main_game').css('display', 'block');
        $('#userHello').html(message);

    });
}());

// displayBoard(message) {
//     $('.menu').css('display', 'none');
//     $('.main_game').css('display', 'block');
//     $('#userHello').html(message);
// }