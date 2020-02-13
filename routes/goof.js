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

    // // 2. receive room name, add player info
    // if (!goofServer.players[room_id]) {
    //   goofServer.players[socket.id] = [];
    // }

    // // 3. check if player is already in this room
    // if (goofServer.players[socket.id].includes(room_id)) {

    // } else {
    //   // 4. create room if room does not exist
    //   if (!goofServer.rooms[room_id]) {
    //     goofServer.rooms[room_id] = {
    //       "count": 0,
    //       "player1": {"username": null, "socket": null},
    //       "player2": {"username": null, "socket": null}
    //     }
    //   }

    //   // 5. join room if there is empty slot
    //   for (const slot in goofServer.rooms[room_id]) {
    //     if (goofServer.rooms[room_id][slot].username === null) {
    //       goofServer.rooms[room_id].count += 1; // room population tracker
    //       goofServer.rooms[room_id][slot].username = username; // room to user tracking system
    //       if (!goofServer.players[socket.id].includes(room_id)) {
    //         goofServer.players[socket.id].push(room_id); // user to room tracking system
    //       }
    //     }
    //   }

    //   // console.log('this is goofServer:\n', goofServer);
    //   console.log('*-connected-at-route-------------');
    //   console.log('*-object keys io.nsps------------');
    //   console.log(Object.keys(io.nsps));
    //   console.log('*-all rooms----------------------');
    //   console.log(Object.keys(io.nsps['/goof'].adapter.rooms));
    //   console.log('*-goofServer rooms---------------');
    //   console.log(goofServer.rooms);
    //   console.log('*-goofServer players-------------');
    //   console.log(goofServer.players);
    //   console.log('--------------------------------*');
    //   console.log('');
    // }

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
