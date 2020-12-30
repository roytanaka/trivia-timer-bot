import { token } from './config';
import { Client } from 'discord.js';
import { messageHandler } from './handlers';

const client = new Client();

client.on('ready', () => {
  console.log('ready');
});

client.on('message', messageHandler);

client.login(token);
