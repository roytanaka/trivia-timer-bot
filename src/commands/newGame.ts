import { TriviaCommand } from '../../typings/commandInterface';
import { deleteGame, newGame } from '../utils/gameControls';

const scoresCommand: TriviaCommand = {
  name: 'Scores command',
  trigger: 'newgame',
  aliases: ['new-game'],
  execute(message) {
    const author = message.author;
    try {
      deleteGame(author.id);
      newGame(message);
      message.channel.send(':mega: Trivia Time! Good luck, have fun!');
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = scoresCommand;
