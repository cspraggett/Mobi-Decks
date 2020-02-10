module.exports = function(io) {

  const {compareHands, Cards, Dealer, Player} = require('../../cards/cards.js');

  const players = {
    "count": 0,
    "player1": null,
    "player2": null
  };

  const game = {
    dealer: {_id: 0, _hand: [...Array(13).keys()], _currentCard: "" },
    player1: {_id: 1, _hand: [...Array(13).keys()], wonBids: [], socketID: "", currentBid: ""},
    player2: {_id: 2, _hand: [...Array(13).keys()], wonBids: [], socketID: "", currentBid: ""}
  };

  const gameData = {};

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
      console.log(data);
      console.log('updating');
      io.of('/game').emit('gameUpdate', msg);
    });

    // send each player their own data and send everyone dealer data
    const startMatch = function() {
      // assign initial values
      const player3 = new Player;
      const player4 = new Player;
      const dealer = new Dealer;
      player3.setId(3);
      player4.setId(4);
      gameData.game1 = {phase: 0, player1: player3, player2: player4, dealer};

      io.of('/game').to(players.player1).emit('gamePhase', JSON.stringify({ phase: 0, player_id: 1, player: game.player1, opponent: game.player2, dealer }));
      io.of('/game').to(players.player2).emit('gamePhase', JSON.stringify({ phase: 0, player_id: 2, player: game.player2, opponent: game.player1, dealer }));
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
