module.exports = function(io) {

  const {compareHands, Deck, GoofDealer, GoofPlayer} = require('../../cards/cards.js');

  const players = {
    "count": 0,
    "player1": null,
    "player2": null
  };

  const game = {
    dealer: {_id: 0, _hand: [...Array(13).keys()], _currentCard: "" },
    player1: {_id: 1, _hand: [...Array(13).keys()], _wonBids: [], _socketID: "", _currentBid: ""},
    player2: {_id: 2, _hand: [...Array(13).keys()], _wonBids: [], _socketID: "", _currentBid: ""}
  };

  let gameData = {};

  // testing information load in
  // const game1 = require('../../db/sampleData.js');
  // console.log(game1);

  io.of("/game").on('connection', function(socket){
    // assign player # and socket id to newly connected socket
    for (const player in players) {
      if (players[player] === null) {
        players[player] = socket.id;
        players.count += 1;
        console.log('new connection');
        console.log(players);
        socket.emit('system', `{ "type": "announcement", "msg": "you are ${player}!" }`);
        break;
      }
    };

    socket.on('gameUpdate', (msg) => {
      const data = JSON.parse(msg);
      // console.log(data);
      // console.log('updating');

      if (data.item === 'bid') {
        let currentPlayer = `player${data.player}`;
        gameData[currentPlayer].currentBid = parseInt(data.value);
        // verifyBid to be implemented

        io.of('/game').emit('gameUpdate:bid', msg);
        if (gameData.player1.currentBid !== null & gameData.player2.currentBid !== null) {
          compareHands(gameData.player1, gameData.player2, gameData.dealer);
          gameData.player1.currentBid = null;
          gameData.player2.currentBid = null;

          gameData.phase += 1;
          io.of('/game').to(players.player1).emit('gamePhase', JSON.stringify({
            phase: gameData.phase,
            ready: false,
            pScore: gameData.player1.score,
            oScore: gameData.player2.score,
            player: gameData.player1,
            opponent: gameData.player2,
            dealer: gameData.dealer
          }));
          io.of('/game').to(players.player2).emit('gamePhase', JSON.stringify({
            phase: gameData.phase,
            ready: false,
            pScore: gameData.player2.score,
            oScore: gameData.player1.score,
            player: gameData.player2,
            opponent: gameData.player1,
            dealer: gameData.dealer
          }));
          if (gameData.phase === 14) {
            //victory effect here;
          }
        }
      }

    });

    // send each player their own data and send everyone dealer data
    const startMatch = function() {
      // assign initial values
      const deck = new Deck(52);
      gameData = {
        phase: 0,
        player_id: null,
        player1: new GoofPlayer(deck),
        player2: new GoofPlayer(deck),
        dealer: new GoofDealer(deck)
      },
      gameData.player1._id = 1;
      gameData.player2._id = 2;

      io.of('/game').to(players.player1).emit('gamePhase', JSON.stringify({
        phase: gameData.phase,
        ready: false,
        pScore: gameData.player1.score,
        oScore: gameData.player2.score,
        player: gameData.player1,
        opponent: gameData.player2,
        dealer: gameData.dealer
      }));
      io.of('/game').to(players.player2).emit('gamePhase', JSON.stringify({
        phase: gameData.phase,
        ready: false,
        pScore: gameData.player2.score,
        oScore: gameData.player1.score,
        player: gameData.player2,
        opponent: gameData.player1,
        dealer: gameData.dealer
      }));

      gameData.phase = 1;
    };

    // when there are 2 connected players send notification to all and run update function
    if (players.count === 2) {
      io.of('/game').emit('system', `{ "type": "start", "msg": "2 players detected!" }`);
      startMatch();
    }

    // // when a player type something in chat display message to all: DISABLED UNTIL REIMPLEMENTATION
    // socket.on('chat message', (msg) => {
    //   const data = JSON.parse(msg);
    //   console.log(data.msg);
    //   for (const player in players) {
    //     if (players[player] === socket.id) {
    //       io.of('/game').emit('chat message', `{ "id": "${socket.id}", "msg": "${player}: ${data.msg}" }`);
    //     }
    //   }
    // });

    // remove socket id from appropriate player slot when a player leave
      // note: when error occurs disconnect function below may not execute properly, causing additional issues
    socket.on('disconnect', function() {
      for (const player in players) {
        if (players[player] === socket.id) {
          players[player] = null;
          players.count -= 1;
          console.log('lost connection');
          console.log(players);
          break;
        }
      }
    })
  })
};
