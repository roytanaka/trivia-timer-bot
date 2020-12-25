const { emojis } = require('../config.json');
const { getGame, saveGame } = require('../utils/gameControls');

module.exports = {
  name: 'question',
  description: 'Start countdown timer when trivia question is posted',
  async execute(message) {
    const gameData = getGame(message.author.id);
    gameData.lastQuestionId = message.id;
    saveGame(message.author.id, gameData);
    const msg = await message.channel.send(`:mega: Timer Starting!`);
    let i = 0;
    const interval = setInterval(() => {
      if (i === 15) {
        // Time's up stop interval
        msg.edit(':mega: TIME’S UP :alarm_clock: Submit your answer!');
        clearInterval(interval);
      } else if (i % 5 === 0 || (i >= 12 && i <= 14)) {
        // Update timer at 15, 10, 5, 3, 2, 1
        msg.edit(`:mega: Submit your answer in ${emojis[i]} seconds!`);
      }
      i++;
    }, 1000);
  },
};
