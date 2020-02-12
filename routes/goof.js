/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const { generateRandomString, findMatchingRoom } = require('../serverHelper.js');

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("error");
  });

  router.get("/:room_id", (req, res) => {
    const templateVars = {username: undefined};
    if (req.session.user_id) {
      templateVars.username = req.session.user_id;
    }
    res.render("game", templateVars);
  });

  router.post("/new", (req, res) => {
    const username = req.session.user_id;
    const newRoomurl = findMatchingRoom(username, "goof");
    if (newRoomurl === null) newRoomUrl = generateRandomString(10);
    res.redirect(`/goof/${newRoomUrl}`);
  });

  return router;
};
