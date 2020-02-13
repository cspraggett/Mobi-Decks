module.exports = function(io) {

  const {compareHands, Deck, CrazyDealer, CrazyPlayer} = require('../../cards/cards.js');
  const {gameData, crazyServer } = require('../../db/gameData.js');

  // 1. when joining server
  io.of('/crazy').on('connect', function(socket) {
  if (!crazyServer.players[socket.id]) {
    crazyServer.players[socket.id] = [];
  }

    // 2. receive room name, add player info
    socket.on('join', (room_id) => {

      // 3. check if player is already in this room
      if (crazyServer.players[socket.id].includes(room_id)) {
        // leave
      } else {
        // 4. create room if room does not exist
        if (!crazyServer.rooms[room_id]) {
          crazyServer.rooms[room_id] = {
            "count": 0,
            "player1": null,
            "player2": null
          }
        }
        // 5. join room if there is empty slot
        for (const slot in crazyServer.rooms[room_id]) {
          if (crazyServer.rooms[room_id][slot] === socket.id) {
            break;
          } else if (crazyServer.rooms[room_id][slot] === null) {
            crazyServer.rooms[room_id].count += 1; // room population tracker
            crazyServer.rooms[room_id][slot] = socket.id; // room to user tracking system
            socket.emit('system', `{ "type": "announcement", "msg": "you are ${slot}!" }`);
            socket.join(room_id); // actual socket room join
            if (!crazyServer.players[socket.id].includes(room_id)) {
              crazyServer.players[socket.id].push(room_id); // user to room tracking system
            }

            // when there are 2 connected players send notification to all and run update function
            if (crazyServer.rooms[room_id].count === 2) {
              io.of('/crazy').to(room_id).emit('system', `{ "type": "start", "msg": "2 players detected!" }`);
              if (room_id.substring(1, 5 === 'crazy')) ;// startCrazyMatch(room_id);
            }
            break;
          }
        }
        // 6 if no empty slot, leave
        if (!crazyServer.players[socket.id].includes(room_id)) {
          // leave
        }
        // console.log('this is crazyServer:\n', crazyServer);
        console.log('*-connected----------------------');
        console.log('*-object keys io.nsps------------');
        console.log(Object.keys(io.nsps));
        console.log('*-all rooms----------------------');
        console.log(Object.keys(io.nsps['/crazy'].adapter.rooms));
        console.log('*-crazyServer rooms---------------');
        console.log(crazyServer.rooms);
        console.log('*-crazyServer players-------------');
        console.log(crazyServer.players);
        console.log('--------------------------------*');
        console.log('');
      }
    })

    // socket.on('gameUpdate:crazy', (msg) => {
    //   const data = JSON.parse(msg);
    //   const room_id = data.room_id;
    //   // console.log(data);
    //   // console.log('updating');

    //   if (data.item === 'bid') {
    //     let currentPlayer = `player${data.player}`;
    //     gameData.crazy[room_id][currentPlayer].currentBid = parseInt(data.value);
    //     // verifyBid to be implemented

    //     io.of('/crazy').to(room_id).emit('gameUpdate:crazy', msg);
    //     if (gameData.crazy[room_id].player1.currentBid !== null & gameData.crazy[room_id].player2.currentBid !== null) {
    //       compareHands(gameData.crazy[room_id].player1, gameData.crazy[room_id].player2, gameData.crazy[room_id].dealer);
    //       gameData.crazy[room_id].player1.currentBid = null;
    //       gameData.crazy[room_id].player2.currentBid = null;

    //       gameData.crazy[room_id].phase += 1;
    //       io.of('/crazy').to(crazyServer.rooms[room_id].player1).emit('gamePhase', JSON.stringify({
    //         phase: gameData.crazy[room_id].phase,
    //         ready: false,
    //         pScore: gameData.crazy[room_id].player1.score,
    //         oScore: gameData.crazy[room_id].player2.score,
    //         player: gameData.crazy[room_id].player1,
    //         opponent: gameData.crazy[room_id].player2,
    //         dealer: gameData.crazy[room_id].dealer
    //       }));
    //       io.of('/crazy').to(crazyServer.rooms[room_id].player2).emit('gamePhase', JSON.stringify({
    //         phase: gameData.crazy[room_id].phase,
    //         ready: false,
    //         pScore: gameData.crazy[room_id].player2.score,
    //         oScore: gameData.crazy[room_id].player1.score,
    //         player: gameData.crazy[room_id].player2,
    //         opponent: gameData.crazy[room_id].player1,
    //         dealer: gameData.crazy[room_id].dealer
    //       }));
    //       // console.log(gameData);
    //       if (gameData.crazy[room_id].phase === 14) {
    //         //victory effect here;
    //       }
    //     }
    //   }

    // });

    // // send each player their own data and send everyone dealer data
    // const startCrazyMatch = function(room_id) {
    //   // assign initial values
    //   const deck = new Deck(52);
    //   gameData.crazy[room_id] = {
    //     phase: 0,
    //     player_id: null,
    //     player1: new CrazyPlayer(deck),
    //     player2: new CrazyPlayer(deck),
    //     dealer: new CrazyDealer(deck)
    //   },
    //   gameData.crazy[room_id].player1._id = 1;
    //   gameData.crazy[room_id].player2._id = 2;

    //   io.of('/crazy').to(crazyServer.rooms[room_id].player1).emit('gamePhase', JSON.stringify({
    //     phase: gameData.crazy[room_id].phase,
    //     ready: false,
    //     pScore: gameData.crazy[room_id].player1.score,
    //     oScore: gameData.crazy[room_id].player2.score,
    //     player: gameData.crazy[room_id].player1,
    //     opponent: gameData.crazy[room_id].player2,
    //     dealer: gameData.crazy[room_id].dealer
    //   }));
    //   io.of('/crazy').to(crazyServer.rooms[room_id].player2).emit('gamePhase', JSON.stringify({
    //     phase: gameData.crazy[room_id].phase,
    //     ready: false,
    //     pScore: gameData.crazy[room_id].player2.score,
    //     oScore: gameData.crazy[room_id].player1.score,
    //     player: gameData.crazy[room_id].player2,
    //     opponent: gameData.crazy[room_id].player1,
    //     dealer: gameData.crazy[room_id].dealer
    //   }));

    //   gameData.crazy[room_id].phase = 1;
    // };



    // // // when a player type something in chat display message to all: DISABLED UNTIL REIMPLEMENTATION
    // // socket.on('chat message', (msg) => {
    // //   const data = JSON.parse(msg);
    // //   console.log(data.msg);
    // //   for (const player in players) {
    // //     if (players[player] === socket.id) {
    // //       io.of('/game').emit('chat message', `{ "id": "${socket.id}", "msg": "${player}: ${data.msg}" }`);
    // //     }
    // //   }
    // // });

    // 1. when a socket leave server find list of rooms the socket was connected to
    //    delete list if no contents exist
    socket.on('disconnect', function() {
      // console.log('a player has left');

      for (let i = 0; i < crazyServer.players[socket.id].length; i++) {
        let room = crazyServer.players[socket.id][i];

        // console.log(crazyServer.players);
        // 2. check if the room is still there in socket io
        if (io.nsps['/crazy'].adapter.rooms[room]) {
          // console.log('found', io.nsps['/game'].adapter.rooms[room]);
          let found = false;

          // 3. look into room and check individual users remaining
          for (const sockId of Object.keys(io.nsps['/crazy'].adapter.rooms[room].sockets)) {

            // 4. check if socket has left this room (found === false)
            if (socket.id === sockId) {
              found = true;
            }
          }

          // 5. if (found === false) this room is one that socket has left
          if (found === false) {
            crazyServer.rooms[room].count -= 1; // room population tracker
            for (const slot in crazyServer.rooms[room]) {
              if (crazyServer.rooms[room][slot] === socket.id) {
                crazyServer.rooms[room][slot] = null; // room to user tracking system
              }
            }
            //socket.leave(room_id); // actual socket room leave: done automatically
            if (crazyServer.players[socket.id].includes(room)) {
            let index = crazyServer.players[socket.id].indexOf(room);
            crazyServer.players[socket.id].splice(index, 1); // user to room tracking system
            }
          }
        } else {

          crazyServer.rooms[room].count -= 1; // room population tracker
          for (const slot in crazyServer.rooms[room]) {
            if (crazyServer.rooms[room][slot] === socket.id) {
              crazyServer.rooms[room][slot] = null; // room to user tracking system
            }
          }

          if (crazyServer.rooms[room].count === 0) {
            console.log('test');
            delete crazyServer.rooms[room];
          }
          //socket.leave(room_id); // actual socket room leave: done automatically
          if (crazyServer.players[socket.id].includes(room)) {
          let index = crazyServer.players[socket.id].indexOf(room);
          crazyServer.players[socket.id].splice(index, 1); // user to room tracking system
          }

        }
      }
      // 6. delete list if it is empty
      // console.log(crazyServer.players[socket.id]);
      if (crazyServer.players[socket.id].length <= 0) {
        delete crazyServer.players[socket.id];
      }

      console.log('*-connected----------------------');
      console.log('*-object keys io.nsps------------');
      console.log(Object.keys(io.nsps));
      console.log('*-all rooms----------------------');
      console.log(Object.keys(io.nsps['/crazy'].adapter.rooms));
      console.log('*-crazyServer rooms---------------');
      console.log(crazyServer.rooms);
      console.log('*-crazyServer players-------------');
      console.log(crazyServer.players);
      console.log('--------------------------------*');
      console.log('');
    })

  })
};
