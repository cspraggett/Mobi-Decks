const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("error");
  });

  router.get("/:room_id", (req, res) => {
    const templateVars = {username: undefined};
    if (req.session.user_id) {
      templateVars.username = req.session.user_id;
    }
    res.render("crazy", templateVars);
  });

  router.post("/new", (req, res) => {
    const newRoomUrl = generateRandomString(10);
    res.redirect(`/crazy/${newRoomUrl}`);
  });

  return router;
};
