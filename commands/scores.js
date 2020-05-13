const getScores = require('../utils/tallyScores');

module.exports = {
  name: 'scores',
  description: 'Tally score of every contestant, sort and post results',
  async execute(message) {
    const scores = await getScores(message);

    let currentScores = 'Current scores:\n';
    scores.forEach((score) => {
      currentScores += `*${score.user}* - **${score.score}**\n`;
    });
    await message.channel.send(currentScores.trim());
    // message.delete();
  },
};
