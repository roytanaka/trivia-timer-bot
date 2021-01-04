import { Message } from 'discord.js';
import { TriviaCommand } from './commandInterface';
import fs from 'fs';

export const isTriviaMaster = (message: Message) => {
  return message?.member?.roles.cache.some(role =>
    role.name.toLowerCase().includes('trivia master')
  );
};

export const getCommands = (): Map<string, TriviaCommand> => {
  const triviaCommands = new Map();
  const commandFiles = fs.readdirSync('./src/commands');
  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    triviaCommands.set(command.trigger, command);
  }
  return triviaCommands;
};
