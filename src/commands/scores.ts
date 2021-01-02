import { TriviaCommand } from '../../typings/commandInterface';

const scoresCommand: TriviaCommand = {
  name: 'Scores command',
  trigger: 'score',
  aliases: ['scores'],
  execute(message) {
    message.channel.send('scores command');
  },
};

module.exports = scoresCommand;
