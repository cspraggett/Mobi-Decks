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
const cookieSession = require('cookie-session');
// const morgan     = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  secret: 'test',
  maxAge: 24 * 60 * 60 * 1000,
}),
);

// Separated Routes for each Resource
const usersRoutes = require("./routes/users");
const goofRoutes = require("./routes/goof");

// Mount all resource routes
app.use("/users", usersRoutes(db));
app.use("/goof", goofRoutes(db));

// Separate them into separate routes files
app.get("/", (req, res) => {
  res.render("index");
});

// app.get("/login", (req, res) => { * moved to routes/users.js: use "/users/login"
//   res.render("login");
// });

// app.get("/register", (req, res) => {
//   res.render("register");
// });

app.get("/game", (req, res) => {
  // res.sendFile(__dirname + '/views/game.html');
  res.render("game");
});

app.get("/war", (req, res) => {
  res.render("war");
});

app.get("/archive", (req, res) => {
  res.render("archive");
});

app.get("/leaderboard", (req, res) => {
  res.render("leaderboard");
});

app.get("/game2/:random", (req, res) => {
  res.render("newSocket");
});

require('./routes/socket/socket.js')(io);
require('./routes/socket/newSocket.js')(io);

http.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
