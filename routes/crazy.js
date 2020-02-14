const express = require('express');
const router  = express.Router();

const { generateRandomString, findMatchingRoom } = require('../serverHelper.js');
const { crazyServer } = require('../db/gameData.js');

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("error");
  });

  router.get("/:room_id", (req, res) => {
    const templateVars = {username: undefined};
    if (req.session.user_id) {
      templateVars.username = req.session.user_id;
    }
    const room_id = '/crazy/' + req.params.room_id;
    if (crazyServer.rooms[room_id]
      && crazyServer.rooms[room_id].count >= 2) {
      res.redirect("/");
    } else {
      res.render("crazy", templateVars);
    }
  });

  router.post("/new", (req, res) => {
    const username = req.session.user_id;
    let newRoomUrl = findMatchingRoom(username, "crazy");
    if (newRoomUrl === null) {
      newRoomUrl = generateRandomString(10);
    }
    res.redirect(`${newRoomUrl}`);
  });

  return router;
};
