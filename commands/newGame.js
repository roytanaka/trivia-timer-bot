const { newGame, deleteGame } = require('../utils/gameControls');

module.exports = {
  name: 'newGame',
  description: 'Delete current game and create new game data',
  async execute(message) {
    const author = message.author;
    try {
      deleteGame(author.id);
      newGame(message);
      message.channel.send(':mega: Trivia Time! Good luck, have fun!');
    } catch (error) {
      console.log(error);
    }
  },
};
