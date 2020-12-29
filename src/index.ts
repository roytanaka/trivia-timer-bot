import { token, settings } from './config';
import { Client } from 'discord.js';

const client = new Client();

client.on('ready', () => {
  console.log('ready');
});

client.login(token);
