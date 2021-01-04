import { TriviaCommand } from '../utils/commandInterface';
import { tallyScores } from '../utils/tallyScores';
import { settings } from '../config';

const scoresCommand: TriviaCommand = {
  name: 'Scores',
  description: 'Output current game scores',
  trigger: 'score',
  aliases: ['scores'],
  async execute(message) {
    const scores = await tallyScores(message);
    if (scores.length) {
      let currentScores = ':mega: Current scores:\n';
      scores.forEach(contestant => {
        currentScores += `*${contestant.user}:*\t**${contestant.score}**\n`;
      });
      await message.channel.send(currentScores.trim());
    } else {
      let noScores =
        'No Scores Found. Mark messages with the following reactions:';
      for (const keeper of settings.scoreKeepers) {
        noScores += `\n${keeper.emoji} “${keeper.name}” for ${keeper.score} ${
          keeper.score === 1 ? 'point' : 'points'
        }`;
      }
      await message.channel.send(noScores);
    }
  },
};

module.exports = scoresCommand;
