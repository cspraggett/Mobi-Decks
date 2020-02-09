// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const morgan     = require('morgan');

const express    = require("express");
const app        = express();
const http       = require('http').createServer(app);
const io         = require('socket.io').listen(http);

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
// const usersRoutes = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/game", (req, res) => {
  res.sendFile(__dirname + '/views/game.html');
  res.render("game");
});

const players = {
  "count": 0,
  "player1": null,
  "player2": null
};

const game = {
  dealer: {id: 0, phase: 0, hand: [...Array(13).keys()], heldCard: [], currentCard: "" },
  player1: {id: 1, hand: [...Array(13).keys()], wonBids: [], score: 0, socketID: "", currentBid: ""},
  player2: {id: 2, hand: [...Array(13).keys()], wonBids: [], score: 0, socketID: "", currentBid: ""}

}

io.of("/game").on('connection', function(socket){
  console.log('connect');
  // assign player # and socket id to newly connected socket
  for (const player in players) {
    if (players[player] === null) {
      players[player] = socket.id;
      players.count += 1;
      socket.emit('system', `{ "msg": "you are ${player}!" }`);
      console.log(players);
      break;
    }
  };

  socket.on('gameUpdate', (msg) => {
    const data = JSON.parse(msg);
    console.log(data.msg);
    console.log('updating');
    io.of('/game').emit('gameUpdate', msg);
  });

  // send each player their own data and send everyone dealer data
  const startMatch = function() {
    // io.of('/game').emit('gameInfo', JSON.stringify({ phase: 0, player1: game.player1, player2: game.player2, dealer: game.dealer }));
<<<<<<< 42cb5095b47a9e9fb925e51eec93204e5fab6b75
    io.of('/game').to(players.player1).emit('gamePhase', JSON.stringify({ phase: 0, player_id: 1, player: game.player1, opponent: game.player2, dealer: game.dealer }));
    io.of('/game').to(players.player2).emit('gamePhase', JSON.stringify({ phase: 0, player_id: 2, player: game.player2, opponent: game.player1, dealer: game.dealer }));
=======
    io.of('/game').to(players.player1).emit('gameInfo', JSON.stringify({ phase: 0, player_id: 1, player: game.player1, opponent: game.player2, dealer: game.dealer }));
    io.of('/game').to(players.player2).emit('gameInfo', JSON.stringify({ phase: 0, player_id: 2, player: game.player2, opponent: game.player1, dealer: game.dealer }));
>>>>>>> made proper cards appear on game.ejs
  };

  // when there are 2 connected players send notification to all and run update function
  if (players.count === 2) {
    console.log(players);
    io.of('/game').emit('system', `{ "type": "start", "msg": "2 players detected!" }`);
    startMatch();
  }

  // when a player type something in chat display message to all
  socket.on('chat message', (msg) => {
    const data = JSON.parse(msg);
    console.log(data.msg);
    for (const player in players) {
      if (players[player] === socket.id) {
        io.of('/game').emit('chat message', `{ "id": "${socket.id}", "msg": "${player}: ${data.msg}" }`);
      }
    }
  });

  // remove socket id from appropriate player slot when a player leave
    // note: when error occurs disconnect function below may not execute properly, causing additional issues
  socket.on('disconnect', function() {
    for (const player in players) {
      if (players[player] === socket.id) {
        players[player] = null;
        players.count -= 1;
        console.log(players);
        break;
      }
    }
  });

});

http.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
