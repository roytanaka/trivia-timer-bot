import { token } from './config';
import { Client } from 'discord.js';
import { messageHandler } from './handlers/message';
import { reactionHandler } from './handlers/reaction';

const client = new Client();

client.on('ready', () => {
  console.log('⏰ Ready!');
});

client.on('message', messageHandler);

client.on('messageReactionAdd', reactionHandler);

client.login(token);
