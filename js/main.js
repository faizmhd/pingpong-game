(function () {
    // début du code isolé
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

    window.onload = initialisation; // appel de la fonction initialisation au chargement de la page

    // fin du code isolé
  })();