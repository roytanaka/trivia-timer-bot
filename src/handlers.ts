import { Message } from 'discord.js';
import { settings } from './config';
import { isTriviaMaster } from './utils/utilFunctions';
import { TriviaCommand } from '../typings/commandInterface';
import { newGame, gameExists } from './utils/gameControls';

import fs from 'fs';

const triviaCommands = new Map();
const commandFiles = fs.readdirSync('./src/commands');
for (const file of commandFiles) {
  const command: TriviaCommand = require(`./commands/${file}`);
  triviaCommands.set(command.trigger, command.execute);
  for (const alias of command.aliases) {
    triviaCommands.set(alias, command.execute);
  }
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

  if (!triviaCommands.has(command)) return;
  if (!gameExists(message.author.id)) {
    newGame(message);
  }

  triviaCommands.get(command)(message, args);
};
