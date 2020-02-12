const dotenv = require('dotenv').config();
const ENV        = process.env.ENV || "development";
const { Pool } = require('pg');
const dbParams = require('../lib/db.js');



const db = new Pool(dbParams);
db.connect();

const getUsers = (() => {
  return db.query(`
  SELECT * FROM users;
  `)
    .then(res => {
      console.log(res.rows);
    });
});

// getUsers();
// console.log(ENV);

module.exports = { getUsers, db};
