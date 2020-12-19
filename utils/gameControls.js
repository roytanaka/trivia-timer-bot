const JSONdb = require('simple-json-db');
const db = new JSONdb('utils/database.json');

const newGame = message => {
  const author = message.author;
  const gameData = {
    time: new Date(),
    master: author.username,
  };
  db.set(author.id, gameData);
  return gameData;
};

const deleteGame = message => {
  const author = message.author;
  db.delete(author.id);
};

exports.newGame = newGame;
exports.deleteGame = deleteGame;
