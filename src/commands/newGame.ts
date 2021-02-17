import Discord, { Message } from 'discord.js';
import { TriviaCommand } from '../utils/commandInterface';
import { deleteGame, newGame } from '../utils/gameControls';
import { settings } from '../config';
import { getCommands } from '../utils/utilFunctions';

const newGameCommand: TriviaCommand = {
  name: 'New game command',
  description: 'Start a new game. Clears existing game if one exists.',
  trigger: 'newgame',
  aliases: ['new-game', 'new'],
  execute(message: Message) {
    const author = message.author;
    try {
      deleteGame(author.id);
      newGame(message);
      let usableEmojis = '';
      for (const keeper of settings.scoreKeepers) {
        usableEmojis += `\n${keeper.emoji}  “${keeper.name}” for ${
          keeper.score
        } ${keeper.score === 1 ? 'point' : 'points'}`;
      }
      const commands = getCommands();
      let usableCommands = '';
      for (const command of commands.values()) {
        usableCommands += `\n\`::${command.trigger}\` ${command.description}`;
      }
      const newGameEmbed = new Discord.MessageEmbed()
        .setColor('#7289da')
        .setTitle(':mega: New Game. Good luck, have fun!')
        .addField('Use these commands:', usableCommands)
        .addField('Use these reactions:', usableEmojis);
      message.channel.send(newGameEmbed);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = newGameCommand;
