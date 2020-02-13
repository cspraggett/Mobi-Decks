module.exports = function(io) {

  const {compareHands, Deck, GoofDealer, GoofPlayer} = require('../../cards/cards.js');
  const {gameData, goofServer} = require('../../db/gameData.js');

  // 1. when joining server
  io.of('/goof').on('connect', function(socket) {
  if (!goofServer.players[socket.id]) {
    goofServer.players[socket.id] = [];
  }

    // 2. receive room name, add player info
    socket.on('join', (joinMsg) => {
      console.log('this is joinMsg here', joinMsg);
      const joinData = JSON.parse(joinMsg);
      const user_id = joinData.username;
      const room_id = joinData.room_id;

      // console.log('this is goofServer at start: ', goofServer);

      // 3. check if player is already in this room
      if (goofServer.players[socket.id].includes(room_id)) {
        // leave
      } else {
        // 4. create room if room does not exist
        if (!goofServer.rooms[room_id]) {
          goofServer.rooms[room_id] = {
            "count": 0,
            "player1": null,
            "player2": null
          }
        }
        // 5. join room if there is empty slot
        for (const slot in goofServer.rooms[room_id]) {
          if (goofServer.rooms[room_id][slot] === socket.id) {
            break;
          } else if (goofServer.rooms[room_id][slot] === null) {
            goofServer.rooms[room_id].count += 1; // room population tracker
            goofServer.rooms[room_id][slot] = socket.id; // room to user tracking system
            socket.emit('system', `{ "type": "announcement", "msg": "you are ${slot}!" }`);
            socket.join(room_id); // actual socket room join
            if (!goofServer.players[socket.id].includes(room_id)) {
              goofServer.players[socket.id].push(room_id); // user to room tracking system
            }

            // when there are 2 connected players send notification to all and run update function
            if (goofServer.rooms[room_id].count === 2) {
              io.of('/goof').to(room_id).emit('system', `{ "type": "start", "msg": "2 players detected!" }`);
              if (room_id.substring(1, 5 === 'goof')) startGoofMatch(room_id);
            }
            break;
          }
        }
        // 6 if no empty slot, leave
        if (!goofServer.players[socket.id].includes(room_id)) {
          // leave
        }
        // console.log('this is goofServer:\n', goofServer);
        console.log('*-connected----------------------');
        console.log('*-object keys io.nsps------------');
        console.log(Object.keys(io.nsps));
        console.log('*-all rooms----------------------');
        console.log(Object.keys(io.nsps['/goof'].adapter.rooms));
        console.log('*-goofServer rooms---------------');
        console.log(goofServer.rooms);
        console.log('*-goofServer players-------------');
        console.log(goofServer.players);
        console.log('--------------------------------*');
        console.log('');
      }
    })

    socket.on('gameUpdate:goof', (msg) => {
      const data = JSON.parse(msg);
      const room_id = data.room_id;
      // console.log(data);
      // console.log('updating');

      if (data.item === 'bid') {
        let currentPlayer = `player${data.player}`;
        gameData.goof[room_id][currentPlayer].currentBid = parseInt(data.value);
        // verifyBid to be implemented

        io.of('/goof').to(room_id).emit('gameUpdate:goof', msg);
        if (gameData.goof[room_id].player1.currentBid !== null & gameData.goof[room_id].player2.currentBid !== null) {
          compareHands(gameData.goof[room_id].player1, gameData.goof[room_id].player2, gameData.goof[room_id].dealer);
          gameData.goof[room_id].player1.currentBid = null;
          gameData.goof[room_id].player2.currentBid = null;

          gameData.goof[room_id].phase += 1;
          io.of('/goof').to(goofServer.rooms[room_id].player1).emit('gamePhase', JSON.stringify({
            phase: gameData.goof[room_id].phase,
            ready: false,
            pScore: gameData.goof[room_id].player1.score,
            oScore: gameData.goof[room_id].player2.score,
            player: gameData.goof[room_id].player1,
            opponent: gameData.goof[room_id].player2,
            dealer: gameData.goof[room_id].dealer
          }));
          io.of('/goof').to(goofServer.rooms[room_id].player2).emit('gamePhase', JSON.stringify({
            phase: gameData.goof[room_id].phase,
            ready: false,
            pScore: gameData.goof[room_id].player2.score,
            oScore: gameData.goof[room_id].player1.score,
            player: gameData.goof[room_id].player2,
            opponent: gameData.goof[room_id].player1,
            dealer: gameData.goof[room_id].dealer
          }));
          // console.log(gameData);
          if (gameData.goof[room_id].phase === 14) {
            //victory effect here;
          }
        }
      }

    });

    // send each player their own data and send everyone dealer data
    const startGoofMatch = function(room_id) {
      // assign initial values
      const deck = new Deck(52);
      gameData.goof[room_id] = {
        phase: 0,
        player_id: null,
        player1: new GoofPlayer(deck),
        player2: new GoofPlayer(deck),
        dealer: new GoofDealer(deck)
      },
      gameData.goof[room_id].player1._id = 1;
      gameData.goof[room_id].player2._id = 2;

      io.of('/goof').to(goofServer.rooms[room_id].player1).emit('gamePhase', JSON.stringify({
        phase: gameData.goof[room_id].phase,
        ready: false,
        pScore: gameData.goof[room_id].player1.score,
        oScore: gameData.goof[room_id].player2.score,
        player: gameData.goof[room_id].player1,
        opponent: gameData.goof[room_id].player2,
        dealer: gameData.goof[room_id].dealer
      }));
      io.of('/goof').to(goofServer.rooms[room_id].player2).emit('gamePhase', JSON.stringify({
        phase: gameData.goof[room_id].phase,
        ready: false,
        pScore: gameData.goof[room_id].player2.score,
        oScore: gameData.goof[room_id].player1.score,
        player: gameData.goof[room_id].player2,
        opponent: gameData.goof[room_id].player1,
        dealer: gameData.goof[room_id].dealer
      }));

      gameData.goof[room_id].phase = 1;
    };



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

    // 1. when a socket leave server find list of rooms the socket was connected to
    //    delete list if no contents exist
    socket.on('disconnect', function() {
      // console.log('a player has left');

      for (let i = 0; i < goofServer.players[socket.id].length; i++) {
        let room = goofServer.players[socket.id][i];

        // console.log(goofServer.players);
        // 2. check if the room is still there in socket io
        if (io.nsps['/goof'].adapter.rooms[room]) {
          // console.log('found', io.nsps['/game'].adapter.rooms[room]);
          let found = false;

          // 3. look into room and check individual users remaining
          for (const sockId of Object.keys(io.nsps['/goof'].adapter.rooms[room].sockets)) {

            // 4. check if socket has left this room (found === false)
            if (socket.id === sockId) {
              found = true;
            }
          }

          // 5. if (found === false) this room is one that socket has left
          if (found === false) {
            goofServer.rooms[room].count -= 1; // room population tracker
            for (const slot in goofServer.rooms[room]) {
              if (goofServer.rooms[room][slot] === socket.id) {
                goofServer.rooms[room][slot] = null; // room to user tracking system
              }
            }
            //socket.leave(room_id); // actual socket room leave: done automatically
            if (goofServer.players[socket.id].includes(room)) {
            let index = goofServer.players[socket.id].indexOf(room);
            goofServer.players[socket.id].splice(index, 1); // user to room tracking system
            }
          }
        } else {

          goofServer.rooms[room].count -= 1; // room population tracker
          for (const slot in goofServer.rooms[room]) {
            if (goofServer.rooms[room][slot] === socket.id) {
              goofServer.rooms[room][slot] = null; // room to user tracking system
            }
          }

          if (goofServer.rooms[room].count === 0) {
            console.log('test');
            delete goofServer.rooms[room];
          }
          //socket.leave(room_id); // actual socket room leave: done automatically
          if (goofServer.players[socket.id].includes(room)) {
          let index = goofServer.players[socket.id].indexOf(room);
          goofServer.players[socket.id].splice(index, 1); // user to room tracking system
          }

        }
      }
      // 6. delete list if it is empty
      // console.log(goofServer.players[socket.id]);
      if (goofServer.players[socket.id].length <= 0) {
        delete goofServer.players[socket.id];
      }

      console.log('*-connected----------------------');
      console.log('*-object keys io.nsps------------');
      console.log(Object.keys(io.nsps));
      console.log('*-all rooms----------------------');
      console.log(Object.keys(io.nsps['/goof'].adapter.rooms));
      console.log('*-goofServer rooms---------------');
      console.log(goofServer.rooms);
      console.log('*-goofServer players-------------');
      console.log(goofServer.players);
      console.log('--------------------------------*');
      console.log('');
    })

  })
};
