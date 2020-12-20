const { saveGame, getGame } = require('../utils/gameControls');

const validateMathInput = input => {
  const re = /^([-+]?)(.+)/;
  const parsedValue = re.exec(input);
  return parsedValue && isNaN(parsedValue[2]) ? null : parsedValue;
};

const calculateScore = (validInput, score) => {
  const [str, operator, value] = validInput;
  const numValue = Number(value);
  switch (operator) {
    case '':
      score = numValue;
      break;
    case '-':
      score -= numValue;
      break;
    case '+':
      score += numValue;
      break;
    default:
      break;
  }
  return score;
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

    const validInput = validateMathInput(scoreUpdate);
    if (!(mentionedUser.id in currentScores)) {
      return message.channel.send(
        `:robot: Oops, can't find the user **${user}** in this game :person_shrugging:`
      );
    }

    if (user && validInput) {
      const newScore = calculateScore(
        validInput,
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
    } else if (user && !validInput) {
      const points = currentScores[mentionedUser.id].score;
      const plural = points !== 1;
      await message.channel.send(
        `:mega: **${user}** has ${points} point${plural ? 's' : ''}.
Enter a number to update their score or you can let me do the math.
Enter a "+" or "-" before the number and I'll calculate it for you. :robot: *Meep morp. Zeep*.
e.g. +2`
      );

      const response = await message.channel.awaitMessages(
        m => m.author.id === triviaMaster.id,
        { max: 1 }
      );

      const validInput = validateMathInput(response.first().content);

      if (!validInput) {
        return message.channel.send(
          `:robot: Does not compute. You'll need to start over.`
        );
      } else {
        const newScore = calculateScore(
          validInput,
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
      }
    }
  },
};
