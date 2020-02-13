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

const getLeaderBoard = (() => {
  return db.query(`
    select users.username, count(results.result) as number_of_wins
    from results join users on users.id = user_id
    group by users.username, results.result
    having results.result = true
    order by number_of_wins desc
    Limit 10;

  `,)
    .then(res => {

      console.log(res.rows);
    });
});

// getLeaderBoard();

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
    .then(res => console.log(res));
});

updateResults('bob', 'Anne', 'goof', 1);
