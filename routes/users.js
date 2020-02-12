/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

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

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("error");
  });

  router.get("/login", (req, res) => {
    if (req.session.user_id) {
      res.redirect('/');
      return;
    }
    const templateVars = {user: [req.session.user_id]};
    res.render("login", templateVars);
  });

  router.get("/register", (req, res) => {
    res.render("register");
  });

  router.get("/war", (req, res) => {
    res.render("war");
  });

  return router;
};
