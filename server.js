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

app.get("/game", (req, res) => {
  // res.sendFile(__dirname + '/views/game.html');
  res.render("game");
});

require('./routes/socket/socket.js')(io);

http.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
