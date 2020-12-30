import { Message } from 'discord.js';
import { settings } from './config';
import { isTriviaMaster } from './utils/utilFunctions';

export const messageHandler = async (message: Message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(settings.prefix)) return;
  if (!isTriviaMaster(message)) return;
  message.channel.send('hello world');
};
