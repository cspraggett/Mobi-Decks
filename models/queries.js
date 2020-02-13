const { db } = require('./db');
const getUsers = (() => {
  return db.query(`
    select * from users;
  `)
    .then(res => console.log(res.rows));
});
// getUsers();

// getHistory();

const getArchive = (playerID => {
  return db.query(`
    SELECT users.username, history.game_type, results.result
    from results join users on results.user_id = users.id
    join history on game_id = history.id
    where users.id = $1;
  `, [playerID])
    .then(res => {
      console.log(res.rows);
    });
});
// console.log(getArchive(7));

const getLeaderBoard = ((playerID) => {
  return db.query(`
    select users.username, count(results.result)
    from results join users on users.id = user_id
    where users.id = $1
    group by users.username;

  `, [playerID])
    .then(res => {

      console.log(res.rows);
    });
});

getLeaderBoard(1);
