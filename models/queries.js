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
<<<<<<< ea016179145ddf665d477629df98874bd6d460be
    from results join users on results.user_id = (select users.id from users where users.username = $1 limit 1)
=======
    from results join users on results.user_id = (select users.id from users where users.username = $1 LIMIT 1)
>>>>>>> saving before merge
    join history on game_id = history.id
    where users.username = $1;
  `, [playerID])
    .then(res => console.log(res.rows));
});
console.log(getArchive('bob'));

const getLeaderBoard = (() => {
  return db.query(`
    select history.game_type as game ,users.username,count(results.result) as number_of_wins
    from results
    join users on users.id = user_id
    join history on game_id = history.id
    group by history.game_type, users.username, results.result
    having results.result = true
    order by game desc, number_of_wins desc
    Limit 10;

  `,)
    .then(res => res.rows);
});

// getLeaderBoard('crazy');

const updateResults = ((player1, player2, game, result) => {
  let p1, p2;
  return db.query(`
  select users.id
  from users
  where username in ($1, $2);
  `,[player1, player2])
    .then(res => {
      // console.log(res);
      p1 = res.rows[0].id;
      p2 = res.rows[1].id;
      // console.log(p1,p2);
    })
    .then(res => {
      return db.query(`
    insert into history(game_type)
    values ($1)
    returning *;
  `, [game]);
    })
    .then(res => {
      console.log(res.rows[0].id);
      return db.query(`
        insert into results (user_id, game_id, result)
        values ($1, $2, $3)
        returning *;
      `, [p1, res.rows[0].id, (result === 1 ? true : false)]);
    })
    .then(res => {
      return db.query(`
        insert into results (user_id, game_id, result)
        values ($1, $2, $3)
        returning *;
      `, [p2, res.rows[0].game_id, (result === 2 ? true : false)]);
    })
    .then(res => res.rows);
});

// updateResults('bob', 'Anne', 'goof', 1);
module.exports = {
  updateResults, getLeaderBoard, getArchive
};



// let test;
// getLeaderBoard()
//   .then(res =>{
//     test = res;
//     console.log(test);
//   });

