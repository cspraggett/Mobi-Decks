module.exports = function(io) {

  const {game} = require('../../cards/crazy8s.js');
  const {gameData, crazyServer} = require('../../db/gameData.js');

  // 1. when joining server
  io.of('/crazy').on('connect', function(socket) {

    // 2. receive room name, add player info
    socket.on('join', (joinMsg) => {
      const joinData = JSON.parse(joinMsg);
      const user_id = joinData.username;
      const room_id = joinData.room_id;

      if (!crazyServer.players[user_id]) {
        crazyServer.players[user_id] = {};
      }

      // console.log('this is crazyServer at start: ', crazyServer);

      // 3. check if player is already in this room
      if (!Object.values(crazyServer.players[user_id]).includes(room_id) || user_id === 'guest') {

        // 4. create room if room does not exist
        if (!crazyServer.rooms[room_id]) {
          crazyServer.rooms[room_id] = {
            "count": 0,
            "player1": {user: null, socket: null},
            "player2": {user: null, socket: null}
          }
        }
        // 5. join room if there is empty slot
        for (const slot in crazyServer.rooms[room_id]) {
          if (crazyServer.rooms[room_id][slot] !== "count"
          && crazyServer.rooms[room_id][slot].user === user_id
          && user_id !== 'guest'
          ) {
            break;
          } else if (crazyServer.rooms[room_id][slot].user === null) {
            crazyServer.rooms[room_id].count += 1; // room population tracker
            crazyServer.rooms[room_id][slot].user = user_id; // room to user tracking system
            crazyServer.rooms[room_id][slot].socket = socket.id;
            socket.emit('system', `{ "type": "announcement", "msg": "you are ${slot}!" }`);
            socket.join(room_id); // actual socket room join
            if (!Object.values(crazyServer.players[user_id]).includes(room_id)
            || user_id === 'guest'
            ) {
              crazyServer.players[user_id][socket.id] = room_id; // user to room tracking system
            }

            // when there are 2 connected players send notification to all and run update function
            if (crazyServer.rooms[room_id].count === 2) {
              io.of('/crazy').to(room_id).emit('system', `{ "type": "start", "msg": "2 players detected!" }`);
              io.of('/crazy').to(crazyServer.rooms[room_id].player1.socket).emit('system',
                `{ "type": "opponent", "msg": "${crazyServer.rooms[room_id].player2.user}" }`
              );
              io.of('/crazy').to(crazyServer.rooms[room_id].player2.socket).emit('system',
                `{ "type": "opponent", "msg": "${crazyServer.rooms[room_id].player1.user}" }`
              );
              if (room_id.substring(1, 5 === 'crazy')) startCrazyMatch(room_id);
            }
            break;
          }
        }
        // 6 if no empty slot, leave
        if (!Object.values(crazyServer.players[user_id]).includes(room_id)) {
          // leave
        }
        // console.log('this is crazyServer:\n', crazyServer);
        // console.log('*-connected----------------------');
        // console.log('*-object keys io.nsps------------');
        // console.log(Object.keys(io.nsps));
        // console.log('*-all rooms----------------------');
        // console.log(Object.keys(io.nsps['/crazy'].adapter.rooms));
        // console.log('*-crazyServer rooms---------------');
        // console.log(crazyServer.rooms);
        // console.log('*-crazyServer players-------------');
        // console.log(crazyServer.players);
        // console.log('--------------------------------*');
        // console.log('');
      }
    })

<<<<<<< HEAD
    socket.on('gameUpdate:crazy-draws', (msg) => {
      const data = JSON.parse(msg);
      const player = parseInt(data.player);
      const room_id = data.room_id;
      let query = {player, pickUp: data.pickUp};
    })

=======
>>>>>>> 497106d179dad73e68aed5e25e00fe09807457c5
    socket.on('gameUpdate:crazy-picks', (msg) => {
      const data = JSON.parse(msg);
      const player = parseInt(data.player);
      const room_id = data.room_id;
      let query = {player, cards: data.result};
<<<<<<< HEAD
=======
      gameData.crazy[room_id].crazy8.position = 0;
>>>>>>> 497106d179dad73e68aed5e25e00fe09807457c5

      console.log(gameData.crazy[room_id].crazy8.players)
      console.log(gameData.crazy[room_id].crazy8.position)
      console.log(gameData.crazy[room_id].crazy8.faceUpCard)
      console.log(gameData.crazy[room_id].crazy8.runOf2)
      console.log('before ----------------------');
      console.log(query);
      gameData.crazy[room_id].crazy8.makeMove(query);
      console.log('after -----------------------');
      console.log(gameData.crazy[room_id].crazy8.players)
      console.log(gameData.crazy[room_id].crazy8.position)
      console.log(gameData.crazy[room_id].crazy8.faceUpCard)
      console.log(gameData.crazy[room_id].crazy8.runOf2)
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
    //       io.of('/crazy').to(crazyServer.rooms[room_id].player1.socket).emit('gamePhase', JSON.stringify({
    //         phase: gameData.crazy[room_id].phase,
    //         ready: false,
    //         pScore: gameData.crazy[room_id].player1.score,
    //         oScore: gameData.crazy[room_id].player2.score,
    //         player: gameData.crazy[room_id].player1,
    //         opponent: gameData.crazy[room_id].player2,
    //         dealer: gameData.crazy[room_id].dealer
    //       }));
    //       io.of('/crazy').to(crazyServer.rooms[room_id].player2.socket).emit('gamePhase', JSON.stringify({
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

    });

    // send each player their own data and send everyone dealer data
    const startCrazyMatch = function(room_id) {
      const crazy8 = new game();
<<<<<<< HEAD
      crazy8.position = 0;
      crazy8.players[0].position = 0;
      crazy8.players[1].position = 1;
      console.log(crazy8);
=======
      crazy8.players[0].position = 0;
      crazy8.players[1].position = 1;

>>>>>>> 497106d179dad73e68aed5e25e00fe09807457c5
      // assign initial values
      gameData.crazy[room_id] = {
        phase: 0,
        crazy8
      }
<<<<<<< HEAD

      io.of('/crazy').to(crazyServer.rooms[room_id].player1.socket).emit('gamePhase', JSON.stringify({
        playerNum: 0,
        phase: 0,
        ready: false,
        crazy8
      }));
      io.of('/crazy').to(crazyServer.rooms[room_id].player2.socket).emit('gamePhase', JSON.stringify({
        playerNum: 1,
        phase: 0,
        ready: false,
        crazy8
      }));
      gameData.crazy[room_id].phase = 1;
    };

=======

      io.of('/crazy').to(crazyServer.rooms[room_id].player1.socket).emit('gamePhase', JSON.stringify({
        playerNum: 0,
        phase: 0,
        ready: false,
        crazy8
      }));
      io.of('/crazy').to(crazyServer.rooms[room_id].player2.socket).emit('gamePhase', JSON.stringify({
        playerNum: 1,
        phase: 0,
        ready: false,
        crazy8
      }));
      gameData.crazy[room_id].phase = 1;
    };

>>>>>>> 497106d179dad73e68aed5e25e00fe09807457c5


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
      let user_id = null;
      let room = null;
      for (const user in crazyServer.players) {
        if (Object.keys(crazyServer.players[user]).includes(socket.id)) {
          user_id = user;
          room = crazyServer.players[user][socket.id];
          break;
        }
      }

      if (room !== null) { // otherwise crashes!

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
              if (crazyServer.rooms[room][slot].socket === socket.id) {
                crazyServer.rooms[room][slot].socket = null; // room to user tracking system
                crazyServer.rooms[room][slot].user = null;
              }
            }
            //socket.leave(room_id); // actual socket room leave: done automatically
            if (Object.keys(crazyServer.players[user_id]).includes(socket.id)) {
              delete crazyServer.players[user_id][socket.id]; // user to room tracking system
            }
          }
        } else {

          // console.log('crazyServer: ', crazyServer);
          // console.log('room: ', room);
          crazyServer.rooms[room].count -= 1; // room population tracker
          for (const slot in crazyServer.rooms[room]) {
            if (crazyServer.rooms[room][slot].socket === socket.id) {
              crazyServer.rooms[room][slot].socket = null; // room to user tracking system
              crazyServer.rooms[room][slot].user = null;
            }
          }

          if (crazyServer.rooms[room].count === 0) {
            delete crazyServer.rooms[room];
          }

          //socket.leave(room_id); // actual socket room leave: done automatically
          if (Object.keys(crazyServer.players[user_id]).includes(socket.id)) {
            delete crazyServer.players[user_id][socket.id]; // user to room tracking system
          }

        }
      }
      // 6. delete list if it is empty
      // console.log(crazyServer.players[socket.id]);
      if (crazyServer.players[user_id] === {}) {
        // console.log('should delete now');
        delete crazyServer.players[user_id];
      }
      // console.log('*-connected----------------------');
      // console.log('*-object keys io.nsps------------');
      // console.log(Object.keys(io.nsps));
      // console.log('*-all rooms----------------------');
      // console.log(Object.keys(io.nsps['/crazy'].adapter.rooms));
      // console.log('*-crazyServer rooms---------------');
      // console.log(crazyServer.rooms);
      // console.log('*-crazyServer players-------------');
      // console.log(crazyServer.players);
      // console.log('--------------------------------*');
      // console.log('');
    })

  })
};
