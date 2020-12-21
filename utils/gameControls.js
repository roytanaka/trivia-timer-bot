const JSONdb = require('simple-json-db');
const db = new JSONdb('utils/database.json');

const gameExists = id => {
  return db.has(id);
};

const getGame = id => {
  return db.get(id);
};

const saveGame = (id, gameData) => {
  if ('currentScores' in gameData) {
    const scores = gameData.currentScores;
    for (const key in scores) {
      scores[key].score = Math.round(scores[key].score * 100) / 100;
    }
  }
  return db.set(id, gameData);
};

const newGame = message => {
  const gameData = {
    time: new Date(),
    lastScoreId: message.id,
    master: message.author.username,
    currentScores: {},
  };
  saveGame(message.author.id, gameData);
  return gameData;
};

const deleteGame = id => {
  db.delete(id);
};

exports.gameExists = gameExists;
exports.getGame = getGame;
exports.saveGame = saveGame;
exports.newGame = newGame;
exports.deleteGame = deleteGame;
