const { saveGame, getGame } = require('../utils/gameControls');

const calculateScore = (scoreUpdate, score) => {
  const re = /^([-+]?)(.+)/;
  const [, operator, value] = re.exec(scoreUpdate);
  const numValue = +value;

  const operations = {
    '': () => numValue,
    '-': () => (score -= numValue),
    '+': () => (score += numValue),
  };
  return operations[operator]();
};

module.exports = {
  name: 'correct',
  description: 'Correct score with parameters passed in',
  async execute(message, [user, scoreUpdate]) {
    const mentionedUser = message.mentions.users.first();
    if (mentionedUser.bot) {
      return message.channel.send(
        `:robot: Silly Trivia Master, bots can't play trivia :rolling_eyes: `
      );
    }
    const triviaMaster = message.author;
    const gameData = getGame(triviaMaster.id);
    const { currentScores } = gameData;

    if (!(mentionedUser.id in currentScores)) {
      return message.channel.send(
        `:robot: Oops, can't find the user **${user}** in this game :person_shrugging:`
      );
    }

    const newScore = calculateScore(
      scoreUpdate,
      currentScores[mentionedUser.id].score
    );
    currentScores[mentionedUser.id].score = newScore;
    gameData.currentScores = currentScores;
    saveGame(triviaMaster.id, gameData);
    message.channel.send(
      `:mega: The score for **${user}** has been updated to **${
        currentScores[mentionedUser.id].score
      }**`
    );
  },
};
