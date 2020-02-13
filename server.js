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
// const morgan     = require('morgan');

// PG database client/connection setup
// const { Pool } = require('pg');
// const dbParams = require('./lib/db.js');
// const db = new Pool(dbParams);
// db.connect();

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
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  secret: 'test',
  maxAge: 24 * 60 * 60 * 1000,
}));

// Separated Routes for each Resource
const usersRoutes = require("./routes/users");
const goofRoutes = require("./routes/goof");
const crazyRoutes = require("./routes/crazy");

// Mount all resource routes
app.use("/users", usersRoutes());
app.use("/goof", goofRoutes());
app.use("/crazy", crazyRoutes());

// Separate them into separate routes files
app.get("/", (req, res) => {
  const templateVars = {username: undefined};
  if (req.session.user_id) {
    templateVars.username = req.session.user_id;
  }
  res.render("index", templateVars);
});

// app.get("/login", (req, res) => { * moved to routes/users.js: use "/users/login"
//   res.render("login");
// });

// app.get("/register", (req, res) => {
//   res.render("register");
// });

app.get("/game", (req, res) => {
  const templateVars = {username: undefined};
  if (req.session.user_id) {
    templateVars.username = req.session.user_id;
  }
  res.render("game", templateVars);
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

require('./routes/socket/socket-goof.js')(io);
require('./routes/socket/socket-crazy.js')(io);

http.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
