import { Message } from 'discord.js';
import { TriviaCommand } from './commandInterface';
import fs from 'fs';
import { join } from 'path';

export const isTriviaMaster = (message: Message) => {
  return message?.member?.roles.cache.some(role =>
    role.name.toLowerCase().includes('trivia master')
  );
};

export const getCommands = () => {
  const triviaCommands = new Map<string, TriviaCommand>();
  const commandFolder = join(__dirname, '..', 'commands');
  const commandFiles = fs.readdirSync(commandFolder);
  for (const file of commandFiles) {
    const command: TriviaCommand = require(join(commandFolder, file));
    triviaCommands.set(command.trigger, command);
  }
  return triviaCommands;
};
