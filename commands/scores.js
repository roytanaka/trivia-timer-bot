const getScores = require('../utils/tallyScores');
const { scoreKeepers } = require('../config.json');

module.exports = {
  name: 'scores',
  description: 'Tally score of every contestant, sort and post results',
  async execute(message) {
    const scores = await getScores(message);
    if (scores.length) {
      let currentScores = 'Current scores:\n';
      scores.forEach((score) => {
        currentScores += `*${score.user}* - **${score.score}**\n`;
      });
      await message.channel.send(currentScores.trim());
    } else {
      let noScores =
        'No Scores Found. Mark messages with the following reactions:';
      for (const keeper of scoreKeepers) {
        noScores += `\n${keeper.emoji} “${keeper.name}” for ${keeper.score} ${
          keeper.score === 1 ? 'point' : 'points'
        }`;
      }
      noScores +=
        '\nNote: messages older than 3 hours and messages by the Trivia Master are ignored.';
      await message.channel.send(noScores);
    }
  },
};
