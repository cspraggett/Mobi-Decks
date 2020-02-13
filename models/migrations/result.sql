DROP TABLE IF EXISTS results CASCADE;
CREATE TABLE results (
  user_id INTEGER REFERENCES users(id),
  game_id INTEGER REFERENCES history(id),
  result BOOLEAN DEFAULT NULL,
  PRIMARY KEY(user_id, game_id)
);
