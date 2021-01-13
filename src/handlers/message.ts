import Discord, { Message } from 'discord.js';
import { settings } from '../config';
import { isTriviaMaster, getCommands } from '../utils/utilFunctions';
import { newGame, gameExists } from '../utils/gameControls';

const triviaCommands = getCommands();

for (const command of triviaCommands.keys()) {
  const commandObj = triviaCommands.get(command)!;
  commandObj.aliases.forEach(alias => {
    triviaCommands.set(alias, commandObj);
  });
}

export const messageHandler = async (message: Message) => {
  const channel = message.channel;
  if (channel.type === 'text' && !channel.name.startsWith('trivia')) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(settings.prefix)) return;
  if (!isTriviaMaster(message)) return;
  const [command, ...args] = message.content
    .toLowerCase()
    .slice(settings.prefix.length) // remove prefix
    .split(/ +|(?<=^q)\d/i); // split by space or digit

  try {
    if (!triviaCommands.has(command)) {
      throw `The command \`::${command}\` does not exist`;
    }
    if (!gameExists(message.author.id)) {
      newGame(message);
    }
    await triviaCommands.get(command)?.execute(message, args);
  } catch (error) {
    const errorEmbed = new Discord.MessageEmbed()
      .setColor('#B00020')
      .setTitle(':robot: Does not compute!')
      .setDescription(`Oops. ${error}`);
    message.channel.send(errorEmbed);
  }
};
