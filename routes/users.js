/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const app     = express();

const {getArchive} = require('../models/queries');

app.set("view engine", "ejs");
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  httpOnly:false,
  secret: 'test',
  maxAge: 24 * 60 * 60 * 1000,
}));

const {getPassFromUser} = require('../serverHelper.js');

// module.exports = (db) => {
//   router.get("/", (req, res) => {
//     db.query(`SELECT * FROM users;`)
//       .then(data => {
//         const users = data.rows;
//         res.json({ users });
//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//   });
//   return router;
// };

// helper funcs
// const getPassFromUser = function(username) {
//   for (const user in users) {
//     if (users[user].name === username) {
//       return users[user].password;
//     }
//   }
// };

// user routes

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("error");
  });

  router.get("/login", (req, res) => {
    if (req.session.user_id) {
      res.redirect('/');
      return;
    }
    const templateVars = {username: undefined};
    res.render("login", templateVars);
  });

  router.get("/register", (req, res) => {
    if (req.session.user_id) {
      res.redirect('/');
      return;
    }
    const templateVars = {username: undefined};
    res.render("register", templateVars);
  });

  router.get("/archive", (req, res) => {
    const templateVars = {username: undefined};
    if (req.session.user_id) {
      templateVars.username = req.session.user_id;
      getArchive(templateVars.username)
        .then(result => {
          console.log('in archive:', result);
          templateVars['archive'] = result;
          res.render('archive', templateVars);
          return;
        });
    }
    res.render("archive", templateVars);
  });

  router.post("/login", (req, res) => {
    let user = req.body.username;
    let pass = getPassFromUser(req.body.username);
    if (pass === req.body.password) {
      req.session.user_id = user;
    }
    res.redirect("/");
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  return router;
};
