import { Message } from 'discord.js';

export const isTriviaMaster = (message: Message) => {
  return message?.member?.roles.cache.some(role =>
    role.name.toLowerCase().includes('trivia master')
  );
};
