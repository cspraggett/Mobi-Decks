// load .env data into process.env
require('dotenv').config();

// Web server config
const ENV        = process.env.ENV || "development";
const express    = require("express");
const app        = express();
const http       = require('http').createServer(app);
const io         = require('socket.io').listen(http);
const PORT       = process.env.PORT || 8080;

const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const morgan     = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

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
const usersRoutes = require("./routes/users");

// Mount all resource routes
app.use("/users", usersRoutes(db));

// Separate them into separate routes files
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
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

};

io.of("/game").on('connection', function(socket) {
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
  }

  socket.on('gameUpdate', (msg) => {
    const data = JSON.parse(msg);
    console.log(data.msg);
    console.log('updating');
    io.of('/game').emit('gameUpdate', msg);
  });

  // send each player their own data and send everyone dealer data
  const startMatch = function() {
    // io.of('/game').emit('gameInfo', JSON.stringify({ phase: 0, player1: game.player1, player2: game.player2, dealer: game.dealer }));
    io.of('/game').to(players.player1).emit('gamePhase', JSON.stringify({ phase: 0, player_id: 1, player: game.player1, opponent: game.player2, dealer: game.dealer }));
    io.of('/game').to(players.player2).emit('gamePhase', JSON.stringify({ phase: 0, player_id: 2, player: game.player2, opponent: game.player1, dealer: game.dealer }));
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
=======
app.get("/register", (req, res) => {
  res.render("register");
});
>>>>>>> 4625639bcea0dc2216c66a862fdfe4bd2116653a

app.get("/game", (req, res) => {
  // res.sendFile(__dirname + '/views/game.html');
  res.render("game");
});

=======
>>>>>>> 58df33945d32af89b913e25c1ae00715cb628c95
require('./routes/socket/socket.js')(io);

http.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
