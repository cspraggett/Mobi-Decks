/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

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

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("error");
  });

  router.get("/:room_id", (req, res) => {
    res.render("game");
  });

  router.post("/new", (req, res) => {
    const newRoomUrl = generateRandomString(10);
    res.redirect(`/goof/${newRoomUrl}`);
  });

  return router;
};
