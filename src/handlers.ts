import { Message } from 'discord.js';

export const messageHandler = async (message: Message) => {
  if (message.author.bot) return;
  if (message.content === 'ping') {
    message.channel.send('pong');
  }
};
