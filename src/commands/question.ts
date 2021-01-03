import { TriviaCommand } from '../utils/commandInterface';
import { getGame, saveGame } from '../utils/gameControls';
import { settings } from '../config';

const questionCommand: TriviaCommand = {
  name: 'Question',
  trigger: 'q',
  aliases: ['question', 'questions'],
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
        msg.edit(
          `:mega: Submit your answer in ${settings.timerEmojis[i]} seconds!`
        );
      }
      i++;
    }, 1000);
  },
};

module.exports = questionCommand;
