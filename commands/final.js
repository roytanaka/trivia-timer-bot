const getScores = require('../utils/tallyScores');

module.exports = {
  name: 'final',
  description: 'Post final Score',
  async execute(message) {
    const scores = getScores(message);

    const emojis = [
      ':first_place:',
      ':second_place:',
      ':third_place:',
      ':medal:',
      ':dizzy_face:',
    ];
    let finalScore = `**FINAL SCORE**\n`;
    scores.forEach((player, i) => {
      if (i < 3) {
        finalScore += `${emojis[i]} *${player.user}* - **${player.score}**\n`;
      } else if (i === scores.length - 1) {
        finalScore += `${emojis[4]} *${player.user}* - **${player.score}**\n`;
      } else {
        finalScore += `${emojis[3]} *${player.user}* - **${player.score}**\n`;
      }
    });
    await message.channel.send(finalScore.trim());
    // message.delete();
  },
};
