import { TriviaCommand } from '../utils/commandInterface';
import { tallyScores } from '../utils/tallyScores';
import { deleteGame } from '../utils/gameControls';

const finalCommand: TriviaCommand = {
  name: 'Final score command',
  description: 'Outputs final game score with medals. Also ends current game.',
  trigger: 'final',
  aliases: ['finals'],
  async execute(message) {
    const scores = await tallyScores(message);
    const emojis = [
      ':first_place:',
      ':second_place:',
      ':third_place:',
      ':medal:',
      ':dizzy_face:',
    ];
    let finalScore = `**FINAL SCORE**\n`;
    const outPutScores = scores.reduce((outputText, player, i) => {
      if (i < 3) {
        outputText += `${emojis[i]} *${player.user}*\t**${player.score}**\n`;
      } else if (i === scores.length - 1) {
        outputText += `${emojis[4]} *${player.user}*\t**${player.score}**\n`;
      } else {
        outputText += `${emojis[3]} *${player.user}*\t**${player.score}**\n`;
      }
      return outputText;
    }, finalScore);
    // scores.forEach((player, i) => {
    // });
    await message.channel.send(outPutScores.trim());

    deleteGame(message.author.id);
  },
};

module.exports = finalCommand;
