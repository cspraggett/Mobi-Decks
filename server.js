// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');

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
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/game", (req, res) => {
  res.render("game");
});

var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  // assign player # and socket id to newly connected socket
  for (const player in players) {
    if (players[player] === null) {
      players[player] = socket.id;
      players.count += 1;
      socket.emit('chat message', `{ "msg": "you are ${player}!" }`);
      console.log(players);
      break;
    }
  };

  // send each player their own data and send everyone dealer data
  const update = function() {
    const player1 = JSON.stringify({id: 1, hand: [...Array(13).keys()], wonBids: [], score: 0, socketID: "", currentBid: ""});
    const player2 = JSON.stringify({id: 2, hand: [...Array(13).keys()], wonBids: [], score: 0, socketID: "", currentBid: ""});
    const dealer = JSON.stringify({id: 0, hand: [...Array(13).keys()], heldCard: [], currentCard: "" });

    io.to(players.player1).emit('game info', player1);
    io.to(players.player2).emit('game info', player2);
    io.emit('game info', dealer);
  };

  // when there are 2 connected players send notification to all and run update function
  if (players.count === 2) {
    console.log(players);
    io.emit('chat message', `{ "msg": "2 players detected!" }`);
    update();
  }

  // when a player type something in chat display message to all
  socket.on('chat message', (msg) => {
    const data = JSON.parse(msg);
    for (const player in players) {
      if (players[player] === socket.id) {
        io.emit('chat message', `{ "id": "${socket.id}", "msg": "${player}: ${data.msg}" }`);
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
