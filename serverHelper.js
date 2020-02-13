const {goofServer, crazyServer } = require('./db/gameData.js');

const generateRandomString = function(n) {
  let result = '';
  for (let i = 0; i < n; i++) {
    switch(Math.floor(Math.random() * 3)) {
      case 0: result += String.fromCharCode(Math.floor(Math.random() * 26) + 97); break;
      case 1: result += String.fromCharCode(Math.floor(Math.random() * 26) + 65); break;
      default: result += String.fromCharCode(Math.floor(Math.random() * 10) + 48);
    }
  }
  return result;
};

const findMatchingRoom = function(username, gametype) {
  let type = {};
  if (gametype === 'goof') type = goofServer;
  else if (gametype === 'crazy') type = crazyServer;

  let foundRoom = null;
  for (const room in goofServer.rooms) {
    if (goofServer.rooms[room].player1 === null && goofServer.rooms[room].player1 !== username
      || goofServer.rooms[room].player2 === null && goofServer.rooms[room].player2 !== username) {
      foundRoom = room;
      break;
    }
  }
  return foundRoom;
}

module.exports = { generateRandomString, findMatchingRoom };
