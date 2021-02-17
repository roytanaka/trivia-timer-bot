import { Guild, Role, User } from 'discord.js';
import { TriviaCommand } from './commandInterface';
import fs from 'fs';
import { join } from 'path';

export const checkTriviaMaster = (user: User, guild: Guild) => {
  const triviaMasterRole = guild.roles.cache
    .array()
    .find(role => /trivia master/i.test(role.name))!;

  return triviaMasterRole.members.some(member => member.id === user.id);
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
