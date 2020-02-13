/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const { generateRandomString, findMatchingRoom } = require('../serverHelper.js');
const {gameData, goofServer} = require('../db/gameData.js');

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("error");
  });

  router.get("/:room_id", (req, res) => {
    const templateVars = {username: undefined};
    let username = null;
    if (req.session.user_id) {
      templateVars.username = req.session.user_id;
      username = req.session.user_id;
    }

    res.render("game", templateVars);
  });

  router.post("/new", (req, res) => {
    const username = req.session.user_id;
    let newRoomUrl = findMatchingRoom(username, "goof");
    if (newRoomUrl === null) {
      newRoomUrl = generateRandomString(10);
    }
    res.redirect(`${newRoomUrl}`);
  });

  return router;
};
