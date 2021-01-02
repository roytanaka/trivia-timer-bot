import Discord from 'discord.js';
import { Message, TextChannel } from 'discord.js';
import { settings } from './config';
import { isTriviaMaster } from './utils/utilFunctions';
import { TriviaCommand } from '../typings/commandInterface';

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

console.log('🚀 ~ commands', triviaCommands);

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
  console.log('🚀 ~ messageHandler ~ args', args);

  if (!triviaCommands.has(command)) return;

  triviaCommands.get(command)(message, args);
};
