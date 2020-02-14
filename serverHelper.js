const {goofServer, crazyServer } = require('./db/gameData.js');
const {users} = require('./db/tempUsers.js');

const getPassFromUser = function(username) {
  for (const user in users) {
    if (users[user].name === username) {
      return users[user].password;
    }
  }
};

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
  else if (gametype === 'war') type = warServer;
  else if (gametype === 'crazy') type = crazyServer;

  let foundRoom = null;
  for (const room in type.rooms) {
    if (type.rooms[room].player1.user === null || type.rooms[room].player2.user === null) {
      if (type.rooms[room].player1.user !== username
        && type.rooms[room].player2.user !== username
        || username === 'guest'
      ) {
        foundRoom = room;
        break;
      }
    }
  }
  return foundRoom;
}

module.exports = { generateRandomString, findMatchingRoom, getPassFromUser };
