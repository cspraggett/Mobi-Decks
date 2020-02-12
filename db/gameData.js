// required from routes/socket/socket.js

const goofServer = {
  rooms: {},
  players: {}
};

const crazyServer = {
  rooms: {},
  players: {}
};

let gameData = {
  goof: {}
};

module.exports = { gameData, goofServer, crazyServer };
